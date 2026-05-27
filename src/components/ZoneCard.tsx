import type { ZoneGuide } from "../types/guide";
import { renderMarkup } from "../lib/markup";
import TaskRow from "./TaskRow";

type Props = {
	zone: ZoneGuide;
	completed: Record<string, boolean>;
	onToggleTask: (taskId: string) => void;
};

const TAG_LABELS: Record<string, string> = {
	waypoint: "WP",
	town: "Town",
	required: "Req",
	optional: "Opt",
	"boss-zone": "Boss",
};

export default function ZoneCard({ zone, completed, onToggleTask }: Props) {
	return (
		<section className="zoneCard">
			<header className="zoneHeader">
				<div className="zoneHeaderLeft">
					<h2 className="zoneName">{zone.name}</h2>
					<div className="zoneBadges">
						{zone.level && <span className="zoneBadge">Target Level: {zone.level}</span>}
						{zone.tags?.map((tag) => (
							<span key={tag} className={`zoneBadge zoneBadge--${tag}`}>
								{TAG_LABELS[tag] ?? tag}
							</span>
						))}
					</div>
				</div>
			</header>

			{zone.notes && zone.notes.length > 0 && (
				<div className="zoneNotes">
					{zone.notes.map((note, i) => (
						<p key={i} className={`zoneNote zoneNote--${note.type}`}>
							{renderMarkup(note.text)}
						</p>
					))}
				</div>
			)}

			<div className="taskList">
				{
					// Optional tasks render after mandatory ones; stable order within each group.
					[...zone.tasks]
						.map((t, i) => ({ t, i }))
						.sort((a, b) => Number(!!a.t.optional) - Number(!!b.t.optional) || a.i - b.i)
						.map(({ t: task }) => (
							<TaskRow
								key={task.id}
								task={task}
								done={Boolean(completed[task.id])}
								onToggle={() => onToggleTask(task.id)}
							/>
						))
				}
			</div>
		</section>
	);
}
