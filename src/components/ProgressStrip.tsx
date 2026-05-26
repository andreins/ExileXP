import type { ZoneGuide } from "../types/guide";

type Props = {
	zones: ZoneGuide[];
	activeZoneIndex: number;
	completed: Record<string, boolean>;
};

function isZoneComplete(zone: ZoneGuide, completed: Record<string, boolean>): boolean {
	return zone.tasks.length > 0 && zone.tasks.every((t) => completed[t.id]);
}

export default function ProgressStrip({ zones, activeZoneIndex, completed }: Props) {
	if (zones.length === 0) return null;

	return (
		<div className="progressStrip">
			<div className="progressDots">
				{zones.map((zone, i) => {
					const done = isZoneComplete(zone, completed);
					const active = i === activeZoneIndex;
					let cls = "progressDot";
					if (done) cls += " progressDot--done";
					else if (active) cls += " progressDot--active";
					return <span key={zone.id} className={cls} />;
				})}
			</div>
			<span className="progressLabel">
				{activeZoneIndex + 1} / {zones.length}
			</span>
		</div>
	);
}
