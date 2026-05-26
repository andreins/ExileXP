type Props = {
	clickThrough: boolean;
	onToggleClickThrough: () => void;
};

export default function OverlayHeader({ clickThrough, onToggleClickThrough }: Props) {
	return (
		<div className="overlayHeader">
			<div className="overlayHeaderLeft">
				<span className="overlayTitle">ExileXP</span>
				<span className="overlayHint">Ctrl+Shift+X · Ctrl+Shift+H</span>
			</div>
			<button
				className={`clickThroughBtn ${clickThrough ? "clickThroughBtn--locked" : ""}`}
				onClick={onToggleClickThrough}
				title={clickThrough ? "Click-through ON (locked)" : "Click-through OFF (interactive)"}
			>
				{clickThrough ? "⊘" : "◎"}
			</button>
		</div>
	);
}
