import type { ActGuide } from "../../types/guide";

const act1: ActGuide = {
	id: "act1",
	label: "Act I",
	title: "The Bloated Land",
	zones: [
		{
			id: "riverbank",
			name: "Riverbank",
			level: "1",
			tags: [],
			tasks: [
				{ id: "act1-riverbank-wounded-man", text: "Talk to Wounded Man, equip starter weapon" },
				{ id: "act1-riverbank-large-chests", text: "Loot Large Chests, equip items + skills" },
				{ id: "act1-riverbank-bloated-miller", text: "Kill The Bloated Miller", required: true, boss: true },
				{ id: "act1-riverbank-clearfell", text: "Enter Clearfell Encampment behind boss" }
			]
		},
		{
			id: "clearfell-encampment",
			name: "Clearfell Encampment",
			level: "2",
			tags: ["town", "waypoint"],
			tasks: [
				{ id: "act1-clearfell-encampment-talk-renly", text: "Talk to Renly" },
				{ id: "act1-clearfell-encampment-talk-una", text: "Talk to Una" },
				{ id: "act1-clearfell-encampment-enter-clearfell", text: "Enter Clearfell" }
			]
		}
	]
};

export default act1;
