import SettingsButton from "./SettingsButton";

type Props = {
	clickThrough: boolean;
	onToggleClickThrough: () => void;
	settingsOpen: boolean;
	onOpenSettings: () => void;
};

export default function OverlayHeader({ clickThrough, onToggleClickThrough, settingsOpen, onOpenSettings }: Props) {
	return (
		<div className="overlayHeader">
			<div className="overlayHeaderLeft">
				<span className="overlayTitle">ExileXP</span>
				<span className="overlayHint">Ctrl+Shift+X · Ctrl+Shift+H</span>
			</div>
			<div className="overlayHeaderRight">
				<SettingsButton open={settingsOpen} onClick={onOpenSettings} />
				<button
					className={`clickThroughBtn ${clickThrough ? "clickThroughBtn--locked" : ""}`}
					onClick={onToggleClickThrough}
					title={clickThrough ? "Click-through ON — click here to disable" : "Click-through OFF (interactive)"}
					data-always-interactive="true"
				>
					{clickThrough ? "⊘" : "◎"}
				</button>
			</div>
		</div>
	);
}
