export {};

declare global {
	interface Window {
		overlay?: {
			setClickThrough: (value: boolean) => Promise<boolean>;
			onClickThroughChanged: (callback: (value: boolean) => void) => () => void;
			setWindowHeight: (height: number) => void;
			setMouseInteractive: (interactive: boolean) => void;
			setFocusTracking: (enabled: boolean) => void;
			closeApp: () => void;
			setClientLogPath: (p: string | null) => Promise<string | null>;
			getDefaultClientLogPath: () => Promise<string | null>;
			pickClientLogPath: () => Promise<string | null>;
			onZoneEntered: (cb: (name: string) => void) => () => void;
			onZoneInternal: (cb: (raw: string) => void) => () => void;
		};
	}
}
