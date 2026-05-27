import type { ReactNode } from "react";

const MARKUP_RE = /\{(npc|boss|loc|item):([^}]+)\}/g;

export function renderMarkup(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	MARKUP_RE.lastIndex = 0;
	while ((match = MARKUP_RE.exec(text)) !== null) {
		const [full, kind, value] = match;
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		nodes.push(
			<span key={match.index} className={`hl hl--${kind}`}>
				{value}
			</span>
		);
		lastIndex = match.index + full.length;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes.length > 0 ? nodes : [text];
}
