import { useState } from "react";
import type { ZoneGuide } from "../types/guide";

type Props = {
	zones: ZoneGuide[];
	activeZoneIndex: number;
	completed: Record<string, boolean>;
	onZoneSelect: (index: number) => void;
};

function isZoneComplete(zone: ZoneGuide, completed: Record<string, boolean>): boolean {
	return zone.tasks.length > 0 && zone.tasks.every((t) => completed[t.id]);
}

export default function ProgressStrip({ zones, activeZoneIndex, completed, onZoneSelect }: Props) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	if (zones.length === 0) return null;

	const labelText =
		hoveredIndex !== null
			? zones[hoveredIndex].name
			: `${activeZoneIndex + 1} / ${zones.length}`;

	return (
		<div className="progressStrip">
			<div className="progressDots">
				{zones.map((zone, i) => {
					const done = isZoneComplete(zone, completed);
					const active = i === activeZoneIndex;
					let cls = "progressDot";
					if (done) cls += " progressDot--done";
					else if (active) cls += " progressDot--active";
					return (
						<button
							key={zone.id}
							className={cls}
							onClick={() => onZoneSelect(i)}
							onMouseEnter={() => setHoveredIndex(i)}
							onMouseLeave={() => setHoveredIndex(null)}
						/>
					);
				})}
			</div>
			<span className={`progressLabel ${hoveredIndex !== null ? "progressLabel--zone" : ""}`}>
				{labelText}
			</span>
		</div>
	);
}
