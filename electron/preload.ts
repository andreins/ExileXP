import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("overlay", {
	setClickThrough: (value: boolean) => ipcRenderer.invoke("overlay:set-click-through", value),
	onClickThroughChanged: (callback: (value: boolean) => void) => {
		const handler = (_event: unknown, value: boolean) => callback(value);

		ipcRenderer.on("overlay:click-through", handler);

		return () => {
			ipcRenderer.removeListener("overlay:click-through", handler);
		};
	},
	setWindowHeight: (height: number) => ipcRenderer.send("overlay:set-height", height),
});
