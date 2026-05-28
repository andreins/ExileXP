import { useRef, useState } from "react";

type Props = {
	activeIndex: number;
	totalZones: number;
	isZoneDone: boolean;
	canCatchUp: boolean;
	onPrev: () => void;
	onNext: () => void;
	onMarkDone: () => void;
	onCatchUp: () => void;
	currentZoneName: string | null;
};

export default function ZoneNav({ activeIndex, totalZones, isZoneDone, canCatchUp, onPrev, onNext, onMarkDone, onCatchUp, currentZoneName }: Props) {
	const [confirming, setConfirming] = useState(false);
	const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function clearConfirmTimer() {
		if (confirmTimerRef.current) {
			clearTimeout(confirmTimerRef.current);
			confirmTimerRef.current = null;
		}
	}

	function handleCatchUp(e: React.MouseEvent<HTMLButtonElement>) {
		e.currentTarget.blur();
		if (!confirming) {
			setConfirming(true);
			clearConfirmTimer();
			// Revert if the user doesn't confirm within 3 s.
			confirmTimerRef.current = setTimeout(() => setConfirming(false), 3000);
			return;
		}
		clearConfirmTimer();
		setConfirming(false);
		onCatchUp();
	}

	const catchUpLabel = confirming ? "Sure?" : "⇤ Catch up";
	const catchUpTitle = confirming
		? "Click again to confirm"
		: currentZoneName
			? `Mark every task in every zone before "${currentZoneName}" as complete`
			: "Mark every task in every zone before this one as complete";

	return (
		<div className="zoneNav">
			<button
				className="zoneNavBtn"
				onClick={(e) => { e.currentTarget.blur(); onPrev(); }}
				disabled={activeIndex === 0}
			>
				‹ Prev
			</button>

			{canCatchUp && (
				<button
					className={`zoneNavBtn zoneNavBtn--catchup ${confirming ? "zoneNavBtn--confirming" : ""}`}
					onClick={handleCatchUp}
					title={catchUpTitle}
				>
					{catchUpLabel}
				</button>
			)}

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
