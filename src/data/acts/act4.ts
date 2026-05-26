import type { ActGuide } from "../../types/guide";

const act4: ActGuide = {
	id: "act4",
	label: "Act IV",
	title: "The Karui Archipelago",
	zones: [
		{
			id: "kingsmarch",
			name: "Kingsmarch",
			level: "42",
			tags: ["town"],
			tasks: [
				{ id: "act4-kingsmarch-talk-doryani", text: "Talk to Doryani + NPCs" },
				{ id: "act4-kingsmarch-talk-alva-rog", text: "Talk to Alva (with Rog)" },
				{ id: "act4-kingsmarch-talk-rog", text: "Talk to Rog in house — boat charter" },
				{ id: "act4-kingsmarch-talk-farrow", text: "Talk to Farrow → accept Quest 4", rewards: ["Unlocks 13 Ancient Runes via Remnants"] },
			],
		},
		{
			id: "whakapanu-island",
			name: "Whakapanu Island",
			level: "42-43",
			tasks: [
				{ id: "act4-whakapanu-petrified-pirate", text: "Petrified Pirate on coast", optional: true, boss: true, rewards: ["Torn Map 2/4"] },
				{ id: "act4-whakapanu-shark-pit", text: "Shark Pit: Kill Great White One", optional: true, boss: true, rewards: ["Shark Fin"] },
				{ id: "act4-whakapanu-clawcrunch", text: "Crabshell Cavern: Kill Clawcrunch", optional: true, boss: true, rewards: ["Support Gem Lv4"] },
				{ id: "act4-whakapanu-enter-singing-caverns", text: "Enter Singing Caverns" },
			],
		},
		{
			id: "singing-caverns",
			name: "Singing Caverns",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-singing-caverns-humming-pearl", text: "Beckoning Clam → Humming Pearl (for Rog)", optional: true, rewards: ["Humming Pearl"] },
				{ id: "act4-singing-caverns-kill-diamora", text: "Kill Diamora, Song of Death", required: true, boss: true, rewards: ["Fragment"] },
				{ id: "act4-singing-caverns-return-town", text: "Talk to Hooded One, return to Kingsmarch" },
			],
		},
		{
			id: "shrike-island",
			name: "Shrike Island",
			level: "43-44",
			tasks: [
				{ id: "act4-shrike-impaled-karui", text: "Corpse Nest — Impaled Karui", optional: true, boss: true, rewards: ["Torn Map 4/4"] },
				{ id: "act4-shrike-kill-scourge", text: "Kill Scourge of the Skies", required: true, boss: true, rewards: ["Fragment"] },
				{ id: "act4-shrike-return-town", text: "Talk to Hooded One, teleport and sail" },
			],
		},
		{
			id: "abandoned-prison",
			name: "Abandoned Prison",
			level: "44",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-prison-kill-mobs-key", text: "Kill mobs until Chapel Key drops", required: true, rewards: ["Chapel Key"] },
				{ id: "act4-prison-kill-forael", text: "Open Chapel, kill Forael", required: true, boss: true, rewards: ["Flask choice"] },
				{ id: "act4-prison-enter-solitary", text: "Enter Solitary Confinement" },
			],
		},
		{
			id: "solitary-confinement",
			name: "Solitary Confinement",
			tasks: [
				{ id: "act4-solitary-kill-prisoner", text: "Kill The Prisoner", required: true, boss: true, rewards: ["Fragment"] },
				{ id: "act4-solitary-return-town", text: "Talk to Hooded One, sail to Isle of Kin" },
			],
		},
		{
			id: "isle-of-kin",
			name: "Isle of Kin",
			level: "45",
			tasks: [
				{ id: "act4-isle-of-kin-flayed-sailor", text: "Flayed Sailor near shore", optional: true, boss: true, rewards: ["Torn Map 3/4"] },
				{ id: "act4-isle-of-kin-beast-pen", text: "Beast Pen", optional: true, rewards: ["Skill Gem + Support Gem"] },
				{ id: "act4-isle-of-kin-kill-mimok", text: "Kill Mimok the Enslaved", required: true, boss: true, rewards: ["Support Gem Lv4"] },
				{ id: "act4-isle-of-kin-enter-warrens", text: "Enter Volcanic Warrens" },
			],
		},
		{
			id: "volcanic-warrens",
			name: "Volcanic Warrens",
			level: "45-46",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-volcanic-warrens-magma-twins", text: "Volcanic Nest: Magma Twins", optional: true, boss: true, rewards: ["Ruby Ring (Lightning first) OR Topaz Ring (Fire first)"], note: "Kill Lightning first for Ruby Ring" },
				{ id: "act4-volcanic-warrens-kill-krutog", text: "Kill Krutog, Lord of Kin", required: true, boss: true },
				{ id: "act4-volcanic-warrens-free-matiki", text: "Click cage, free Matiki" },
				{ id: "act4-volcanic-warrens-tp-kingsmarch", text: "Teleport to Kingsmarch" },
			],
		},
		{
			id: "eye-of-hinekora",
			name: "Eye of Hinekora",
			level: "46-47",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-eye-of-hinekora-talk-matiki", text: "Talk to Matiki in town, click well" },
				{ id: "act4-eye-of-hinekora-waterfall-chest", text: "Chest behind waterfall", optional: true, rewards: ["Skill Gem Lv12", "Spirit Gem Lv12"] },
				{ id: "act4-eye-of-hinekora-three-tests", text: "Complete 3 Tests: Fire, Nature, Cold", required: true },
				{ id: "act4-eye-of-hinekora-altar-navali", text: "Silent Hall altar (Pay Respects), talk to Navali", rewards: ["+5% Max Mana"] },
				{ id: "act4-eye-of-hinekora-enter-halls", text: "Enter Halls of the Dead" },
			],
		},
		{
			id: "halls-of-the-dead",
			name: "Halls of the Dead",
			level: "47",
			tasks: [
				{ id: "act4-halls-trial-ngakanu", text: "Trial of Ngakanu (3 tests in clover-leaf)", required: true, rewards: ["Blank Tattoos"] },
				{ id: "act4-halls-kill-yama", text: "Fight Yama the White", required: true, boss: true, note: "Low life pool" },
				{ id: "act4-halls-enter-trial-ancestors", text: "Enter Trial of the Ancestors" },
			],
		},
		{
			id: "trial-of-the-ancestors",
			name: "Trial of the Ancestors",
			level: "47-48",
			tasks: [
				{ id: "act4-trial-ancestors-talk-hinekora", text: "Talk to Hinekora", required: true, rewards: ["+2 Skill Points"] },
				{ id: "act4-trial-ancestors-choose-tattoo", text: "Choose tattoo: +5% Res (recommended) OR +5 Stat", required: true, rewards: ["+5% Fire/Cold/Lightning Res OR +5 Str/Dex/Int"] },
				{ id: "act4-trial-ancestors-sail-kedge", text: "Teleport, sail to Kedge Bay" },
			],
		},
		{
			id: "kedge-bay",
			name: "Kedge Bay",
			level: "47-48",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-kedge-bay-dead-mans-chest", text: "Dead Man's Chest / Smuggler's Stash", optional: true, rewards: ["Torn Map 1/4"] },
				{ id: "act4-kedge-bay-enter-journeys-end", text: "Enter Journey's End" },
			],
		},
		{
			id: "journeys-end",
			name: "Journey's End",
			level: "48-49",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-journeys-end-talk-tujen", text: "Talk to Tujen" },
				{ id: "act4-journeys-end-kill-harlin", text: "Kill Captain Harlin", required: true, boss: true, rewards: ["Verisium"] },
				{ id: "act4-journeys-end-talk-freya", text: "TP to start, talk to Freya Hartlin" },
				{ id: "act4-journeys-end-dannig-spikes", text: "Town → Dannig → Verisium Spikes" },
				{ id: "act4-journeys-end-return-freya", text: "Return to Journey's End → Freya" },
				{ id: "act4-journeys-end-kill-omniphobia", text: "Activate Totem → kill Omniphobia", required: true, boss: true, rewards: ["+2 Skill Points"] },
				{ id: "act4-journeys-end-tujen-reward", text: "Talk to Tujen in town for reward" },
			],
		},
		{
			id: "plunderers-point",
			name: "Plunderer's Point",
			tags: ["optional"],
			notes: [{ type: "info", text: "Requires all 4 Torn Maps — give to Makoru, sail, Dannig → Expedition" }],
			tasks: [
				{ id: "act4-plunderers-point-torn-maps", text: "Give 4 Torn Maps to Makoru → Expedition", optional: true },
			],
		},
		{
			id: "arastas",
			name: "Arastas",
			level: "49-50",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-arastas-lorandis", text: "Follow Missionari Lorandis → destroy shield", required: true },
				{ id: "act4-arastas-bells", text: "Evening/Morning Bells", optional: true, rewards: ["3 Regals per bell"] },
				{ id: "act4-arastas-kill-torvian", text: "Kill Torvian", required: true, boss: true },
				{ id: "act4-arastas-enter-excavation", text: "Enter The Excavation" },
			],
		},
		{
			id: "the-excavation",
			name: "The Excavation",
			level: "50-51",
			tasks: [
				{ id: "act4-excavation-kill-benedictus", text: "Kill Benedictus", required: true, boss: true },
				{ id: "act4-excavation-talk-hooded-one", text: "Talk to Hooded One" },
				{ id: "act4-excavation-sail-ngakanu", text: "Sail to Ngakanu" },
			],
		},
		{
			id: "ngakanu",
			name: "Ngakanu",
			level: "51",
			tasks: [
				{ id: "act4-ngakanu-navigate-maze", text: "Navigate maze → Heart of the Tribe" },
				{ id: "act4-ngakanu-kill-tavaki", text: "Kill Tavaki", required: true, boss: true },
				{ id: "act4-ngakanu-tp-rhodri", text: "TP to town → talk to Rhodri → sail to final" },
			],
		},
		{
			id: "act4-finale",
			name: "Act IV Finale",
			level: "52",
			tags: ["boss-zone"],
			tasks: [
				{ id: "act4-finale-kill-zarokh", text: "Kill Zarokh (Act Boss)", required: true, boss: true },
				{ id: "act4-finale-talk-hooded-one", text: "Return, talk to Hooded One → Interludes unlock" },
			],
		},
	],
};

export default act4;
