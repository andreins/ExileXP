import { app, BrowserWindow, dialog, globalShortcut, ipcMain, screen } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClientLogTail } from "./clientLogTail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;
let clickThrough = false;
let desiredHeight = 390;
let desiredWidth = 460;

// ── Client.txt auto-detection ───────────────────────────────────────────────
// Cross common drives × common install patterns. Order matters: first match wins.

const DRIVES = ["C", "D", "E", "F", "G", "H"];
const INSTALL_PATTERNS = [
	"Program Files (x86)/Steam/steamapps/common/Path of Exile 2/logs/Client.txt",
	"Program Files/Steam/steamapps/common/Path of Exile 2/logs/Client.txt",
	"SteamLibrary/steamapps/common/Path of Exile 2/logs/Client.txt",
	"Steam/steamapps/common/Path of Exile 2/logs/Client.txt",
	"Games/Steam/steamapps/common/Path of Exile 2/logs/Client.txt",
	"steamapps/common/Path of Exile 2/logs/Client.txt",
	"Program Files (x86)/Grinding Gear Games/Path of Exile 2/logs/Client.txt",
	"Program Files/Grinding Gear Games/Path of Exile 2/logs/Client.txt",
	"Grinding Gear Games/Path of Exile 2/logs/Client.txt",
];

function detectClientLogPath(): string | null {
	for (const d of DRIVES) {
		for (const p of INSTALL_PATTERNS) {
			const full = `${d}:/${p}`;
			if (fs.existsSync(full)) return full;
		}
	}
	return null;
}

const defaultClientLogPath = detectClientLogPath();

let userClientLogPath: string | null = null;

function getEffectiveClientLogPath(): string | null {
	return userClientLogPath ?? defaultClientLogPath;
}

const isDev = !app.isPackaged;

function createWindow() {
	win = new BrowserWindow({
		width: 460,
		height: 390,
		x: 40,
		y: 80,
		frame: false,
		transparent: true,
		resizable: true,
		alwaysOnTop: true,
		skipTaskbar: false,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	win.setAlwaysOnTop(true, "screen-saver");
	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

	// Block user drag-resize by setting min == max to the current size.
	// Updated whenever the IPC handler resizes the window.
	win.setMinimumSize(desiredWidth, desiredHeight);
	win.setMaximumSize(desiredWidth, desiredHeight);

	if (isDev) {
		win.loadURL("http://localhost:5173");
		win.webContents.openDevTools({ mode: "detach" });
	} else {
		win.loadFile(path.join(__dirname, "../dist/index.html"));
	}
}

app.whenReady().then(() => {
	if (process.platform === "win32") {
		app.setAppUserModelId("com.exilexp.overlay");
	}

	createWindow();

	// Client.txt tail — instantiate after window is created
	const logTail = createClientLogTail(getEffectiveClientLogPath, win!);
	logTail.start();

	globalShortcut.register("CommandOrControl+Shift+X", () => {
		if (!win) return;

		clickThrough = !clickThrough;
		win.setIgnoreMouseEvents(clickThrough, { forward: true });
		win.webContents.send("overlay:click-through", clickThrough);
	});

	globalShortcut.register("CommandOrControl+Shift+H", () => {
		if (!win) return;

		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		}
	});

	ipcMain.on("overlay:set-height", (_event, height: number) => {
		if (!win) return;
		const [width] = win.getSize();
		const [, winY] = win.getPosition();
		const { workArea } = screen.getDisplayMatching(win.getBounds()) ?? screen.getPrimaryDisplay();
		const maxH = workArea.y + workArea.height - winY - 8;
		const newH = Math.min(Math.max(Math.ceil(height), 80), maxH);
		// Briefly drop the min/max lock so setSize can change the window size,
		// then re-pin to the new dimensions so the user still can't drag-resize.
		win.setMinimumSize(0, 0);
		win.setMaximumSize(0, 0);
		win.setSize(width, newH);
		win.setMinimumSize(width, newH);
		win.setMaximumSize(width, newH);
		desiredHeight = newH;
		desiredWidth = width;
		const [actualW, actualH] = win.getSize();
		console.log(`[overlay] resize requested=${height} → applied=${newH}, actual=${actualW}x${actualH}`);
	});

	ipcMain.handle("overlay:set-click-through", (_event, value: boolean) => {
		if (!win) return false;

		clickThrough = value;
		win.setIgnoreMouseEvents(clickThrough, { forward: true });
		win.webContents.send("overlay:click-through", clickThrough);

		return clickThrough;
	});

	// Renderer-driven temporary override: when the user has click-through ON but the
	// cursor is hovering an "always interactive" hot zone (e.g. the click-through
	// button itself), the renderer asks main to temporarily process mouse events so
	// the button stays clickable. When the cursor leaves the hot zone we revert.
	ipcMain.on("overlay:set-mouse-interactive", (_event, interactive: boolean) => {
		if (!win) return;
		const shouldIgnore = clickThrough && !interactive;
		win.setIgnoreMouseEvents(shouldIgnore, { forward: true });
	});

	ipcMain.handle("overlay:set-client-log-path", (_event, p: string | null) => {
		userClientLogPath = p && p.trim() !== "" ? p.trim() : null;
		logTail.restart();
		return getEffectiveClientLogPath();
	});

	ipcMain.handle("overlay:get-default-client-log-path", () => {
		return defaultClientLogPath;
	});

	// Open a folder picker. User selects a PoE2 install folder (or its parent or `logs/`)
	// and we derive Client.txt from there. Returns the resolved Client.txt path on success,
	// the string "not-found" if a folder was chosen but Client.txt couldn't be located,
	// or null if the dialog was cancelled.
	ipcMain.handle("overlay:pick-client-log-path", async () => {
		if (!win) return null;
		const result = await dialog.showOpenDialog(win, {
			title: "Select Path of Exile 2 folder",
			properties: ["openDirectory"],
		});
		if (result.canceled || result.filePaths.length === 0) return null;
		const picked = result.filePaths[0];
		// Try common layouts relative to what the user picked.
		const candidates = [
			path.join(picked, "logs", "Client.txt"),                          // picked PoE2 root
			path.join(picked, "Client.txt"),                                  // picked PoE2/logs
			path.join(picked, "Path of Exile 2", "logs", "Client.txt"),       // picked steamapps/common
			path.join(picked, "common", "Path of Exile 2", "logs", "Client.txt"), // picked steamapps
		];
		const found = candidates.find((p) => fs.existsSync(p));
		if (!found) return "not-found";
		userClientLogPath = found;
		logTail.restart();
		return found;
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});