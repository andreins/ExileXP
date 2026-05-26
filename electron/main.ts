import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;
let clickThrough = false;

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
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	win.setAlwaysOnTop(true, "screen-saver");
	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

	if (isDev) {
		win.loadURL("http://localhost:5173");
		win.webContents.openDevTools({ mode: "detach" });
	} else {
		win.loadFile(path.join(__dirname, "../dist/index.html"));
	}
}

app.whenReady().then(() => {
	createWindow();

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

	ipcMain.handle("overlay:set-click-through", (_event, value: boolean) => {
		if (!win) return false;

		clickThrough = value;
		win.setIgnoreMouseEvents(clickThrough, { forward: true });
		win.webContents.send("overlay:click-through", clickThrough);

		return clickThrough;
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