export type ActId = "act1" | "act2" | "act3" | "act4" | "interludes";

// ── Gem types ──────────────────────────────────────────────────────────────

export type GemAttr = "red" | "green" | "blue" | "white";

export type SupportGemEntry = {
	name: string;
	attr?: GemAttr; // optional override; default derive from name lookup
};

export type SkillGemEntry = {
	slot: number; // 1..9, render order in the grid
	name: string; // canonical PoE2 skill gem name (e.g. "Tempest Bell")
	displayName?: string; // optional override (e.g. "Hollow Focus" — shown instead of name)
	level: number | string; // "5" or "5–6"
	attr?: GemAttr; // optional override; default derive from name lookup
	supports: SupportGemEntry[];
};

export type GemSectionKind = "warning" | "order" | "mapping" | "bossing" | "priority" | "note";

export type GemSection = {
	kind: GemSectionKind; // drives styling (warning = amber callout, priority = ordered list, etc.)
	title?: string; // optional explicit title; otherwise derived from kind
	body: string; // paragraph text with markup tokens {npc:X} {boss:X} {loc:X} {item:X}; \n\n = paragraph break
};

export type ActGems = {
	requirements?: { str?: number; dex?: number; int?: number };
	title?: string; // optional banner above grid (e.g. Act 4 "Whirling Assault Swap")
	skills: SkillGemEntry[];
	sections: GemSection[]; // ordered: warnings/order first, then mapping, bossing, priority
};

export type ProfileGems = Partial<Record<ActId, ActGems>>;

export type ProfileId = "standard" | "monk";

export type ZoneOverride = {
	tasks?: GuideTask[];   // when present, REPLACES base tasks entirely
	notes?: ZoneNote[];    // when present, REPLACES base notes entirely
};

export type ProfileContent = Record<string /* ZoneGuide.id */, ZoneOverride>;

export type ActGuide = {
	id: ActId;
	label: string;
	title: string;
	subtitle?: string;
	zones: ZoneGuide[];
};

export type ZoneTag = "waypoint" | "town" | "required" | "optional" | "boss-zone";

export type ZoneNote = {
	type: "info" | "warning" | "tip" | "patch";
	text: string;
};

export type HighlightKind = "npc" | "boss" | "loc" | "item";

export type TaskNoteType = "new" | "tip" | "warning" | "success" | "info";
export type TaskNote = {
	type: TaskNoteType;
	label?: string;
	text: string;
};

export type RewardKind = "default" | "gem" | "craft" | "optional" | "perm";
export type Reward = { text: string; kind?: RewardKind };

export type GuideTask = {
	id: string;
	text: string;
	required?: boolean;
	optional?: boolean;
	boss?: boolean;
	rewards?: Reward[];
	note?: string;
	notesAfter?: TaskNote[];
};

export type ZoneGuide = {
	id: string;
	name: string;
	level?: string;
	tags?: ZoneTag[];
	notes?: ZoneNote[];
	tasks: GuideTask[];
};
