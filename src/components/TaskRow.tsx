import type { GuideTask } from "../types/guide";
import { renderMarkup } from "../lib/markup";
import TaskNote from "./TaskNote";

type Props = {
	task: GuideTask;
	done: boolean;
	onToggle: () => void;
	autocompleteOnLeave: "on" | "off";
};

export default function TaskRow({ task, done, onToggle, autocompleteOnLeave }: Props) {
	let rowClass = "taskRow";
	if (done) rowClass += " taskRow--done";
	if (task.optional) rowClass += " taskRow--optional";

	return (
		<div className="taskGroup">
			<div className={rowClass} onClick={onToggle}>
				{autocompleteOnLeave === "on" ? (
					<button
						className={`checkbox checkbox--bullet${done ? " checkbox--done" : ""}`}
						role="checkbox"
						aria-checked={done}
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							onToggle();
						}}
						onKeyDown={(e) => {
							if (e.key === " " || e.key === "Enter") {
								e.preventDefault();
								onToggle();
							}
						}}
					>
						{!done && <span className="checkbox__bullet">•</span>}
					</button>
				) : (
					<button
						className={`checkbox${done ? " checkbox--done" : ""}`}
						role="checkbox"
						aria-checked={done}
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							onToggle();
						}}
						onKeyDown={(e) => {
							if (e.key === " " || e.key === "Enter") {
								e.preventDefault();
								onToggle();
							}
						}}
					/>
				)}
				<span className="taskText">{renderMarkup(task.text)}</span>
				{task.optional && <span className="taskOptional">opt</span>}
				{task.rewards?.map((reward, i) => (
					<span
						key={i}
						className={`reward-tag reward-tag--${reward.kind ?? "default"}`}
					>
						{reward.text}
					</span>
				))}
			</div>
			{task.notesAfter?.map((note, i) => (
				<TaskNote key={i} note={note} />
			))}
		</div>
	);
}
