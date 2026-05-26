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

export type GuideTask = {
	id: string;
	text: string;
	required?: boolean;
	optional?: boolean;
	boss?: boolean;
	rewards?: string[];
	note?: string;
};

export type ZoneGuide = {
	id: string;
	name: string;
	level?: string;
	tags?: ZoneTag[];
	notes?: ZoneNote[];
	tasks: GuideTask[];
};
