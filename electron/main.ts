import { app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu, nativeImage, screen, shell, Tray } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClientLogTail } from "./clientLogTail.js";
import { createFocusWatcher } from "./focusWatcher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single-instance lock — refuse to spawn a second ExileXP process. If the
// user double-clicks the .exe again while one is already running, surface
// the existing window instead of starting a second copy.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
	app.quit();
	// Halt module evaluation — nothing below should run in the duplicate
	// process. Throwing here is the documented Electron pattern; the
	// `app.quit()` above takes effect on the next tick.
	throw new Error("Another ExileXP instance is already running");
}

let win: BrowserWindow | null = null;
let tray: Tray | null = null;
let clickThrough = false;
let desiredHeight = 390;
let desiredWidth = 460;
// Tracks Ctrl+Shift+H state: when true, the user explicitly hid the window
// and the focus-watcher must not re-show it on the next foreground change.
// Cleared when the user presses Ctrl+Shift+H again to bring the window back.
let userHidden = false;
// Set by clientLogTail when PoE2's [SCENE] is "(null)" or "(unknown)" —
// the player is at character select / between scenes. Cleared when a real
// scene name fires next.
let sceneHidden = false;

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

// ── Window position persistence ───────────────────────────────────────────
// We can't use localStorage from main, so we stash a small JSON file in the
// user's app-data folder. Tracks just (x, y) — width/height stay fixed.

type WindowState = { x: number; y: number };

function windowStatePath() {
	return path.join(app.getPath("userData"), "window-state.json");
}

function loadWindowState(): WindowState | null {
	try {
		const raw = fs.readFileSync(windowStatePath(), "utf8");
		const obj = JSON.parse(raw) as WindowState;
		if (typeof obj.x === "number" && typeof obj.y === "number") return obj;
	} catch {
		/* ignore — missing file or bad json */
	}
	return null;
}

function saveWindowState(state: WindowState) {
	try {
		fs.writeFileSync(windowStatePath(), JSON.stringify(state), "utf8");
	} catch {
		/* ignore */
	}
}

function defaultTopRightPosition(width: number): { x: number; y: number } {
	const { workArea } = screen.getPrimaryDisplay();
	return {
		x: workArea.x + workArea.width - width - 8,
		y: workArea.y + 8,
	};
}

function clampToWorkArea(state: WindowState, width: number, height: number): WindowState {
	const { workArea } = screen.getDisplayMatching({ x: state.x, y: state.y, width, height });
	return {
		x: Math.max(workArea.x, Math.min(state.x, workArea.x + workArea.width - width)),
		y: Math.max(workArea.y, Math.min(state.y, workArea.y + workArea.height - height)),
	};
}

function createWindow() {
	const initialWidth = 460;
	const initialHeight = 390;
	const saved = loadWindowState();
	const initialPos = saved
		? clampToWorkArea(saved, initialWidth, initialHeight)
		: defaultTopRightPosition(initialWidth);

	win = new BrowserWindow({
		width: initialWidth,
		height: initialHeight,
		x: initialPos.x,
		y: initialPos.y,
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

	// Debounced position save on user-driven window moves.
	let moveTimer: ReturnType<typeof setTimeout> | null = null;
	win.on("move", () => {
		if (!win) return;
		if (moveTimer) clearTimeout(moveTimer);
		moveTimer = setTimeout(() => {
			if (!win) return;
			const [x, y] = win.getPosition();
			saveWindowState({ x, y });
		}, 300);
	});

	win.setAlwaysOnTop(true, "screen-saver");
	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

	// External http(s) links (e.g. Credits in Settings) open in the user's
	// default browser instead of a new Electron window.
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("http://") || url.startsWith("https://")) {
			shell.openExternal(url);
		}
		return { action: "deny" };
	});

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

// Toggle window visibility from outside the renderer (tray-icon click,
// global shortcut, etc.). Mirrors the Ctrl+Shift+H behaviour: hiding pins
// `userHidden = true`; showing clears the pin so focus-watcher resumes.
function toggleWindowVisible() {
	if (!win) return;
	if (win.isVisible()) {
		userHidden = true;
		win.hide();
	} else {
		userHidden = false;
		win.show();
	}
	updateTrayMenu();
}

// Resolve the tray icon path — checked relative to dist-electron in dev,
// then relative to resources in a packaged app.
function resolveTrayIconPath(): string | null {
	const candidates = [
		path.join(__dirname, "../build/icon.ico"),
		path.join(process.resourcesPath ?? "", "icon.ico"),
		path.join(__dirname, "icon.ico"),
	];
	for (const p of candidates) {
		if (fs.existsSync(p)) return p;
	}
	return null;
}

function buildTrayMenu(): Menu {
	const isVisible = win?.isVisible() ?? false;
	return Menu.buildFromTemplate([
		{ label: isVisible ? "Hide overlay" : "Show overlay", click: toggleWindowVisible },
		{ type: "separator" },
		{
			label: "Quit ExileXP",
			click: () => {
				app.quit();
			},
		},
	]);
}

function updateTrayMenu() {
	if (tray) tray.setContextMenu(buildTrayMenu());
}

function createTray() {
	const iconPath = resolveTrayIconPath();
	if (!iconPath) {
		console.warn("[tray] icon not found — skipping tray creation");
		return;
	}
	const image = nativeImage.createFromPath(iconPath);
	tray = new Tray(image);
	tray.setToolTip("ExileXP");
	tray.setContextMenu(buildTrayMenu());
	tray.on("click", toggleWindowVisible);
	// Keep the menu's "Show / Hide" label in sync as visibility changes.
	if (win) {
		win.on("show", updateTrayMenu);
		win.on("hide", updateTrayMenu);
	}
}

// When a second .exe is launched while we already hold the lock, Electron
// notifies us instead of starting a new process. Surface the existing
// window so the user knows the app is already running.
app.on("second-instance", () => {
	if (!win) return;
	userHidden = false; // clear any sticky Ctrl+Shift+H pin
	if (win.isMinimized()) win.restore();
	if (!win.isVisible()) win.show();
	win.focus();
});

app.whenReady().then(() => {
	if (process.platform === "win32") {
		app.setAppUserModelId("com.exilexp.overlay");
	}

	createWindow();
	createTray();

	// Foreground-process watcher (Windows only) — toggled by the renderer.
	// We pass an `isHidden` predicate so the watcher refuses to re-show the
	// window when the user manually hid it OR when the player is at PoE2's
	// character select / between-scene transition.
	const focusWatcher = createFocusWatcher(() => win, () => userHidden || sceneHidden);

	// Client.txt tail — instantiate after window is created. Hook scene
	// transitions so character select / loading screens hide the overlay
	// immediately (without waiting for the next 750 ms focus-watcher tick).
	const logTail = createClientLogTail(getEffectiveClientLogPath, win!, {
		onSceneCleared: () => {
			sceneHidden = true;
			if (win?.isVisible()) win.hide();
		},
		onZoneEntered: () => {
			sceneHidden = false;
			// Don't force-show here — focusWatcher's next tick will pick this
			// up and only show if PoE2 / ExileXP is the foreground window.
		},
	});
	logTail.start();

	globalShortcut.register("CommandOrControl+Shift+X", () => {
		if (!win) return;

		clickThrough = !clickThrough;
		win.setIgnoreMouseEvents(clickThrough, { forward: true });
		win.webContents.send("overlay:click-through", clickThrough);
	});

	globalShortcut.register("CommandOrControl+Shift+H", () => {
		if (!win) return;
		// Important: flip `userHidden` BEFORE calling show()/hide(). If we
		// did it after, the focus-watcher's polling tick could fire in
		// between, observe the old userHidden value, and re-show/re-hide,
		// producing a visible blink on toggle.
		if (win.isVisible()) {
			userHidden = true;
			win.hide();
		} else {
			userHidden = false;
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

	ipcMain.on("overlay:set-focus-tracking", (_event, enabled: boolean) => {
		focusWatcher.setEnabled(Boolean(enabled));
	});

	ipcMain.on("overlay:close-app", () => {
		focusWatcher.dispose();
		app.quit();
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
	if (tray) {
		try {
			tray.destroy();
		} catch {
			/* ignore */
		}
		tray = null;
	}
});