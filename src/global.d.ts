export {};

declare global {
	interface Window {
		overlay?: {
			setClickThrough: (value: boolean) => Promise<boolean>;
			onClickThroughChanged: (callback: (value: boolean) => void) => () => void;
			setWindowHeight: (height: number) => void;
		};
	}
}
