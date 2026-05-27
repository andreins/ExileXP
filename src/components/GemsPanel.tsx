import { useState } from "react";
import type { ActId, ActGems, GemSection, ProfileId } from "../types/guide";
import { profileMap } from "../data/profiles";
import { renderMarkup } from "../lib/markup";
import GemCard from "./GemCard";

// ── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(profile: ProfileId, actId: ActId): string {
	return `poe2-overlay-gems-open:${profile}:${actId}`;
}

function loadOpen(profile: ProfileId, actId: ActId): boolean {
	try {
		const raw = localStorage.getItem(storageKey(profile, actId));
		if (raw === null) return false; // default collapsed
		return raw === "true";
	} catch {
		return false;
	}
}

function saveOpen(profile: ProfileId, actId: ActId, open: boolean): void {
	try {
		localStorage.setItem(storageKey(profile, actId), String(open));
	} catch {
		// ignore
	}
}

function actLabel(actId: ActId): string {
	switch (actId) {
		case "act1": return "Act 1";
		case "act2": return "Act 2";
		case "act3": return "Act 3";
		case "act4": return "Act 4";
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
		case "note": return "Note";
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
};

export default function GemsPanel({ act, profile }: Props) {
	const gems = profileMap[profile]?.gems?.[act];
	if (!gems) return null;

	const [open, setOpen] = useState<boolean>(() => loadOpen(profile, act));

	const toggle = () => {
		const next = !open;
		setOpen(next);
		saveOpen(profile, act, next);
	};

	return (
		<div className="gemsPanel">
			<button
				type="button"
				className="gemsPanel__header"
				onClick={toggle}
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
						<div className="gemsPanel__sections">
							{gems.sections.map((section, i) => (
								<GemSection key={i} section={section} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
