import { app, BrowserWindow, globalShortcut, ipcMain, screen } from "electron";
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

const CANDIDATES = [
	"C:/Program Files (x86)/Steam/steamapps/common/Path of Exile 2/logs/Client.txt",
	"C:/Program Files (x86)/Grinding Gear Games/Path of Exile 2/logs/Client.txt",
];
const defaultClientLogPath = CANDIDATES.find((p) => fs.existsSync(p)) ?? null;

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

	ipcMain.handle("overlay:set-client-log-path", (_event, p: string | null) => {
		userClientLogPath = p && p.trim() !== "" ? p.trim() : null;
		logTail.restart();
		return getEffectiveClientLogPath();
	});

	ipcMain.handle("overlay:get-default-client-log-path", () => {
		return defaultClientLogPath;
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