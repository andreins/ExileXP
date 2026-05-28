export {};

declare global {
	// Injected at build time by vite.config.ts from package.json#version.
	const __APP_VERSION__: string;

	interface Window {
		overlay?: {
			setClickThrough: (value: boolean) => Promise<boolean>;
			onClickThroughChanged: (callback: (value: boolean) => void) => () => void;
			setWindowHeight: (height: number) => void;
			setMouseInteractive: (interactive: boolean) => void;
			setFocusTracking: (enabled: boolean) => void;
			closeApp: () => void;
			toggleHide: () => void;
			setClientLogPath: (p: string | null) => Promise<string | null>;
			getDefaultClientLogPath: () => Promise<string | null>;
			pickClientLogPath: () => Promise<string | null>;
			onZoneEntered: (cb: (name: string) => void) => () => void;
			onZoneInternal: (cb: (raw: string) => void) => () => void;
			onSceneCleared: (cb: (kind: string) => void) => () => void;
		};
	}
}
