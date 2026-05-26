type Props = {
	activeIndex: number;
	totalZones: number;
	isZoneDone: boolean;
	onPrev: () => void;
	onNext: () => void;
	onMarkDone: () => void;
};

export default function ZoneNav({ activeIndex, totalZones, isZoneDone, onPrev, onNext, onMarkDone }: Props) {
	return (
		<div className="zoneNav">
			<button
				className="zoneNavBtn"
				onClick={onPrev}
				disabled={activeIndex === 0}
			>
				‹ Prev
			</button>

			<button
				className={`zoneNavBtn zoneNavBtn--complete ${isZoneDone ? "zoneNavBtn--done" : ""}`}
				onClick={onMarkDone}
			>
				{isZoneDone ? "✓ Undo Zone" : "✓ Complete"}
			</button>

			<button
				className="zoneNavBtn"
				onClick={onNext}
				disabled={activeIndex >= totalZones - 1}
			>
				Next ›
			</button>
		</div>
	);
}
