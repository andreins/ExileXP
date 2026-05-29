import { useRef, useState } from "react";
import type { ActId, ProfileId } from "../types/guide";
import SettingsButton from "./SettingsButton";
import { ACT_SHOP_REGEX } from "../data/shopRegex";

type Props = {
	profile: ProfileId;
	activeActId: ActId;
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

export default function OverlayHeader({ profile, activeActId, clickThrough, onToggleClickThrough, settingsOpen, onOpenSettings, onCloseApp }: Props) {
	const guide = GUIDE_URLS[profile];
	const actRegex = ACT_SHOP_REGEX[activeActId];

	// Two-click confirmation on the close button. First click → label
	// becomes "?" and stays for 3 s. Second click within that window
	// actually quits. Mirrors the Catch-up button pattern in ZoneNav.
	const [closeConfirming, setCloseConfirming] = useState(false);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// "Copy Regex" button: flashes "Done" for 1.2 s after a successful
	// clipboard write. Falls back to a hidden textarea + execCommand when
	// navigator.clipboard isn't reachable (some Electron contexts).
	const [regexCopied, setRegexCopied] = useState(false);
	const regexTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	async function handleCopyRegex(e: React.MouseEvent<HTMLButtonElement>) {
		e.currentTarget.blur();
		if (!actRegex) return;
		let ok = false;
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(actRegex);
				ok = true;
			} else {
				const ta = document.createElement("textarea");
				ta.value = actRegex;
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				ok = document.execCommand("copy");
				document.body.removeChild(ta);
			}
		} catch {
			ok = false;
		}
		if (!ok) return;
		setRegexCopied(true);
		if (regexTimerRef.current) clearTimeout(regexTimerRef.current);
		regexTimerRef.current = setTimeout(() => setRegexCopied(false), 1200);
	}

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
				<span className="overlayTitle">
					ExileXP <span className="overlayVersion">v{__APP_VERSION__}</span>
				</span>
				<button
					className="overlayHint overlayHintBtn"
					onClick={(e) => { e.currentTarget.blur(); window.overlay?.toggleHide(); }}
					title="Click to hide / show overlay (same as Ctrl+Shift+H)"
					data-always-interactive="true"
				>
					Ctrl+Shift+H(ide)
				</button>
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
				{actRegex && (
					<button
						className={`shopRegexBtn${regexCopied ? " shopRegexBtn--ok" : ""}`}
						onClick={handleCopyRegex}
						title="Copy this act's vendor-search regex to clipboard"
						data-always-interactive="true"
					>
						{regexCopied ? "Done" : "Copy Regex"}
					</button>
				)}
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
