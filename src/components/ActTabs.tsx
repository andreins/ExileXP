import type { ActGuide, ActId } from "../types/guide";

type Props = {
	acts: ActGuide[];
	activeActId: ActId;
	onSelectAct: (id: ActId) => void;
};

export default function ActTabs({ acts, activeActId, onSelectAct }: Props) {
	return (
		<nav className="actTabs">
			{acts.map((act) => (
				<button
					key={act.id}
					className={`actTab ${act.id === activeActId ? "actTab--active" : ""}`}
					onClick={() => onSelectAct(act.id)}
				>
					{act.label}
				</button>
			))}
		</nav>
	);
}
