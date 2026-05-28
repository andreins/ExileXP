type Props = {
	activeIndex: number;
	totalZones: number;
	isZoneDone: boolean;
	onPrev: () => void;
	onNext: () => void;
	onMarkDone: () => void;
	onCatchUp: () => void;
	currentZoneName: string | null;
};

export default function ZoneNav({ activeIndex, totalZones, isZoneDone, onPrev, onNext, onMarkDone, onCatchUp, currentZoneName }: Props) {
	function handleCatchUp(e: React.MouseEvent<HTMLButtonElement>) {
		e.currentTarget.blur();
		const target = currentZoneName ? ` "${currentZoneName}"` : "";
		if (!confirm(`Mark every task in every zone BEFORE${target} as complete? Useful when you start the overlay mid-campaign.`)) return;
		onCatchUp();
	}

	return (
		<div className="zoneNav">
			<button
				className="zoneNavBtn"
				onClick={(e) => { e.currentTarget.blur(); onPrev(); }}
				disabled={activeIndex === 0}
			>
				‹ Prev
			</button>

			<button
				className="zoneNavBtn zoneNavBtn--catchup"
				onClick={handleCatchUp}
				title="Mark every task in every zone before this one as complete"
			>
				⇤ Catch up
			</button>

			<button
				className={`zoneNavBtn zoneNavBtn--complete ${isZoneDone ? "zoneNavBtn--done" : ""}`}
				onClick={(e) => { e.currentTarget.blur(); onMarkDone(); }}
			>
				{isZoneDone ? "✓ Undo Zone" : "✓ Complete"}
			</button>

			<button
				className="zoneNavBtn"
				onClick={(e) => { e.currentTarget.blur(); onNext(); }}
				disabled={activeIndex >= totalZones - 1}
			>
				Next ›
			</button>
		</div>
	);
}
