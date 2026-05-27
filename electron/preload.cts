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
	setClientLogPath: (p: string | null) => ipcRenderer.invoke("overlay:set-client-log-path", p),
	getDefaultClientLogPath: () => ipcRenderer.invoke("overlay:get-default-client-log-path"),
	pickClientLogPath: () => ipcRenderer.invoke("overlay:pick-client-log-path"),
	onZoneEntered: (cb: (name: string) => void) => {
		const handler = (_event: unknown, name: string) => cb(name);
		ipcRenderer.on("overlay:zone-entered", handler);
		return () => {
			ipcRenderer.removeListener("overlay:zone-entered", handler);
		};
	},
});
