import type { GuideTask } from "../types/guide";

type Props = {
	task: GuideTask;
	done: boolean;
	onToggle: () => void;
};

export default function TaskRow({ task, done, onToggle }: Props) {
	let rowClass = "taskRow";
	if (done) rowClass += " taskRow--done";
	if (task.boss) rowClass += " taskRow--boss";
	if (task.optional) rowClass += " taskRow--optional";

	return (
		<label className={rowClass}>
			<input
				type="checkbox"
				className="taskCheckbox"
				checked={done}
				onChange={onToggle}
			/>
			<span className="taskText">{task.text}</span>
			{task.optional && <span className="taskOptional">opt</span>}
			{task.rewards?.map((reward) => (
				<span key={reward} className="badge">{reward}</span>
			))}
		</label>
	);
}
