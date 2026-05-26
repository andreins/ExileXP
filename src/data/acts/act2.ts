import type { ActGuide } from "../../types/guide";

const act2: ActGuide = {
	id: "act2",
	label: "Act II",
	title: "The Vastiri Desert",
	zones: [
		{
			id: "vastiri-outskirts",
			name: "Vastiri Outskirts",
			level: "14-15",
			tasks: [
				{ id: "act2-vastiri-outskirts-talk-hooded-one", text: "Talk to The Hooded One", required: true },
				{ id: "act2-vastiri-outskirts-kill-rathbreaker", text: "Kill Rathbreaker", required: true, boss: true },
				{ id: "act2-vastiri-outskirts-tp-start-zone", text: "TP back to start of zone" },
				{ id: "act2-vastiri-outskirts-talk-zarka", text: "Talk to Zarka" },
				{ id: "act2-vastiri-outskirts-enter-ardura-caravan", text: "Enter The Ardura Caravan" }
			]
		},
		{
			id: "ardura-caravan",
			name: "The Ardura Caravan",
			tags: ["town", "waypoint"],
			tasks: [
				{ id: "act2-ardura-caravan-talk-hooded-one-asekhma", text: "Talk to Hooded One + Sekhema Asala (x2)" },
				{ id: "act2-ardura-caravan-talk-farrow", text: "Talk to Farrow → accept Quest 2 (Runic Alloys)" },
				{ id: "act2-ardura-caravan-use-desert-map", text: "Use Desert Map → travel to Halani Gates" },
				{ id: "act2-ardura-caravan-enter-halani-gates", text: "Enter Halani Gates → talk to Sekhema Asala" },
				{ id: "act2-ardura-caravan-travel-mawdun-quarry", text: "Travel to Mawdun Quarry" }
			]
		},
		{
			id: "mawdun-quarry",
			name: "Mawdun Quarry",
			level: "15",
			tasks: [
				{ id: "act2-mawdun-quarry-faridun-war-cache", text: "Faridun War Cache near checkpoint", optional: true },
				{ id: "act2-mawdun-quarry-enter-mawdun-mine", text: "Enter Mawdun Mine (follow checkpoints)" }
			]
		},
		{
			id: "mawdun-mine",
			name: "Mawdun Mine",
			level: "16",
			tags: ["required"],
			tasks: [
				{ id: "act2-mawdun-mine-kill-rudja", text: "Kill Rudja", required: true, boss: true },
				{ id: "act2-mawdun-mine-talk-risu", text: "Talk to Risu in cage" },
				{ id: "act2-mawdun-mine-tp-town", text: "TP back to town" }
			]
		}
	]
};

export default act2;
