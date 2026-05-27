import type { TaskNote as TaskNoteType } from "../types/guide";
import { renderMarkup } from "../lib/markup";

type Props = {
	note: TaskNoteType;
};

export default function TaskNote({ note }: Props) {
	return (
		<div className={`taskNote taskNote--${note.type}`}>
			{note.label && <span className="taskNote__label">{note.label}</span>}
			{renderMarkup(note.text)}
		</div>
	);
}
