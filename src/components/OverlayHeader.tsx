import { useRef, useState } from "react";
import type { ProfileId } from "../types/guide";
import SettingsButton from "./SettingsButton";

type Props = {
	profile: ProfileId;
	clickThrough: boolean;
	onToggleClickThrough: () => void;
	settingsOpen: boolean;
	onOpenSettings: () => void;
	onCloseApp: () => void;
};

const GUIDE_URLS: Record<ProfileId, { url: string; label: string }> = {
	standard: { url: "https://domistae.github.io/poe2-leveling/", label: "domistae's guide" },
	monk: {
		url: "https://mobalytics.gg/poe-2/profile/fgkorbyn21/builds/0-5-league-start-monk-leveling-guide",
		label: "FGKorbyn21's monk guide",
	},
};

export default function OverlayHeader({ profile, clickThrough, onToggleClickThrough, settingsOpen, onOpenSettings, onCloseApp }: Props) {
	const guide = GUIDE_URLS[profile];

	// Two-click confirmation on the close button. First click → label
	// becomes "?" and stays for 3 s. Second click within that window
	// actually quits. Mirrors the Catch-up button pattern in ZoneNav.
	const [closeConfirming, setCloseConfirming] = useState(false);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function clearCloseTimer() {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}

	function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
		e.currentTarget.blur();
		if (!closeConfirming) {
			setCloseConfirming(true);
			clearCloseTimer();
			closeTimerRef.current = setTimeout(() => setCloseConfirming(false), 3000);
			return;
		}
		clearCloseTimer();
		setCloseConfirming(false);
		onCloseApp();
	}

	function handleGuideClick(e: React.MouseEvent<HTMLAnchorElement>) {
		// Only Shift-click opens the guide — keeps stray clicks from accidentally
		// launching a browser tab mid-raid.
		e.preventDefault();
		if (!e.shiftKey) return;
		window.open(guide.url, "_blank");
	}

	return (
		<div className="overlayHeader">
			<div className="overlayHeaderLeft">
				<span className="overlayTitle">ExileXP</span>
				<span className="overlayHint">Ctrl+Shift+H(ide)</span>
			</div>
			<div className="overlayHeaderRight">
				<a
					className="overlayGuideLink"
					href={guide.url}
					onClick={handleGuideClick}
					title={`Shift-click to open ${guide.label} in your browser`}
					data-always-interactive="true"
				>
					Guide ↗
				</a>
				<SettingsButton open={settingsOpen} onClick={onOpenSettings} />
				<button
					className={`clickThroughBtn ${clickThrough ? "clickThroughBtn--locked" : ""}`}
					onClick={(e) => { onToggleClickThrough(); e.currentTarget.blur(); }}
					title={clickThrough ? "Click-through ON — click here to disable" : "Click-through OFF (interactive)"}
					data-always-interactive="true"
				>
					{clickThrough ? "⊘" : "◎"}
				</button>
				<button
					className={`closeAppBtn${closeConfirming ? " closeAppBtn--confirming" : ""}`}
					onClick={handleClose}
					title={closeConfirming ? "Click again to confirm close" : "Close ExileXP"}
					data-always-interactive="true"
				>
					{closeConfirming ? "?" : "✕"}
				</button>
			</div>
		</div>
	);
}
