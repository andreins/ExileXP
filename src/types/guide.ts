export type ActId = "act1" | "act2" | "act3" | "act4" | "interludes";

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
