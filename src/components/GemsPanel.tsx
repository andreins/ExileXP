import { useEffect, useState } from "react";
import type { ActId, ActGems, GemSection, ProfileId } from "../types/guide";
import { profileMap } from "../data/profiles";
import { renderMarkup } from "../lib/markup";
import GemCard from "./GemCard";

// ── Helpers ──────────────────────────────────────────────────────────────────

function actLabel(actId: ActId): string {
	switch (actId) {
		case "act1": return "Act 1";
		case "act2": return "Act 2";
		case "act3": return "Act 3";
		case "act4": return "Act 4";
		case "interludes": return "Interludes";
		default: return actId;
	}
}

function sectionDefaultTitle(kind: GemSection["kind"]): string {
	switch (kind) {
		case "order": return "Skill Gem Order";
		case "mapping": return "How to Play — Mapping";
		case "bossing": return "How to Play — Bossing";
		case "priority": return "Gem Level Up Priority";
		case "warning": return "Note";
		case "note": return ""; // intro / unlabeled — render body only
		default: return "";
	}
}

// ── Priority section: parse "N. text" lines into an ordered list ─────────────

function PriorityBody({ body }: { body: string }) {
	const lines = body.split("\n").filter((l) => l.trim() !== "");
	const isNumbered = lines.every((l) => /^\d+\./.test(l.trim()));

	if (isNumbered) {
		return (
			<ol className="gemsSection__priorityList">
				{lines.map((line, i) => {
					const text = line.replace(/^\d+\.\s*/, "");
					return (
						<li key={i}>
							{renderMarkup(text)}
						</li>
					);
				})}
			</ol>
		);
	}
	// Fallback: render as normal paragraphs
	return <SectionBody body={body} />;
}

// ── Generic section body with paragraph support ───────────────────────────────

function SectionBody({ body }: { body: string }) {
	const paragraphs = body.split("\n\n");
	return (
		<>
			{paragraphs.map((para, i) => (
				<p key={i} className="gemsSection__para">
					{renderMarkup(para)}
				</p>
			))}
		</>
	);
}

// ── Single section ─────────────────────────────────────────────────────────────

function GemSection({ section }: { section: GemSection }) {
	const title = section.title ?? sectionDefaultTitle(section.kind);

	return (
		<div className={`gemsSection gemsSection--${section.kind}`}>
			{title && <div className="gemsSection__title">{title}</div>}
			<div className="gemsSection__body">
				{section.kind === "priority" ? (
					<PriorityBody body={section.body} />
				) : (
					<SectionBody body={section.body} />
				)}
			</div>
		</div>
	);
}

// ── Requirements row ──────────────────────────────────────────────────────────

function RequirementsRow({ req }: { req: NonNullable<ActGems["requirements"]> }) {
	const parts: string[] = [];
	if (req.str) parts.push(`Str ${req.str}`);
	if (req.dex) parts.push(`Dex ${req.dex}`);
	if (req.int) parts.push(`Int ${req.int}`);
	if (parts.length === 0) return null;
	return (
		<div className="gemsPanel__requirements">
			{parts.join(" · ")}
		</div>
	);
}

// ── GemsPanel ─────────────────────────────────────────────────────────────────

type Props = {
	act: ActId;
	profile: ProfileId;
	open: boolean;
	onToggle: () => void;
};

export default function GemsPanel({ act, profile, open, onToggle }: Props) {
	// Hooks must run unconditionally — even when gems data is absent — to keep
	// hook order stable across profile/act changes.
	const sectionsKey = `poe2-overlay-gems-sections-open:${profile}:${act}`;
	const [sectionsOpen, setSectionsOpen] = useState<boolean>(true);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(sectionsKey);
			setSectionsOpen(raw === null ? true : raw === "true");
		} catch {
			setSectionsOpen(true);
		}
	}, [sectionsKey]);

	const toggleSections = () => {
		setSectionsOpen((prev) => {
			const next = !prev;
			try {
				localStorage.setItem(sectionsKey, String(next));
			} catch {
				/* ignore */
			}
			return next;
		});
	};

	const gems = profileMap[profile]?.gems?.[act];
	if (!gems) return null;

	return (
		<div className="gemsPanel">
			<button
				type="button"
				className="gemsPanel__header"
				onClick={onToggle}
				aria-expanded={open}
			>
				<span className="gemsPanel__headerTitle">Skill Gems · {actLabel(act)}</span>
				<span className={`gemsPanel__chevron${open ? " gemsPanel__chevron--open" : ""}`}>
					▾
				</span>
			</button>

			{open && (
				<div className="gemsPanel__body">
					{gems.title && (
						<div className="gemsPanel__banner">{gems.title}</div>
					)}
					{gems.requirements && (
						<RequirementsRow req={gems.requirements} />
					)}

					<div className="gemsPanel__grid">
						{gems.skills.map((gem) => (
							<GemCard key={gem.slot} gem={gem} />
						))}
					</div>

					{gems.sections.length > 0 && (
						<>
							<button
								type="button"
								className="gemsPanel__sectionsToggle"
								onClick={toggleSections}
								aria-expanded={sectionsOpen}
							>
								<span>{sectionsOpen ? "Hide notes" : "Show notes"}</span>
								<span className={`gemsPanel__chevron${sectionsOpen ? " gemsPanel__chevron--open" : ""}`}>
									▾
								</span>
							</button>
							{sectionsOpen && (
								<div className="gemsPanel__sections">
									{gems.sections.map((section, i) => (
										<GemSection key={i} section={section} />
									))}
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
