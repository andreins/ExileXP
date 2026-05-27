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
			notes: [{ type: "tip", text: "Weapon Fragments and Matiki are randomized across the four islands each league — Kingsmarch dialogue tells you which" }],
			tasks: [
				{ id: "act4-kingsmarch-talk-doryani", text: "Talk to {npc:Doryani}" },
				{ id: "act4-kingsmarch-talk-alva-rog", text: "Continue to town, talk to {npc:Alva} (with {npc:Rog})" },
				{ id: "act4-kingsmarch-talk-rog", text: "Talk to {npc:Rog} in house — boat charter" },
				{
					id: "act4-kingsmarch-talk-farrow",
					text: "Talk to {npc:Farrow} → accept Quest 4",
					rewards: [{ text: "Unlocks 13 Ancient Runes via Remnants", kind: "craft" }],
					notesAfter: [{ type: "new", label: "0.5 New", text: "{npc:Farrow}'s Act 4 quest unlocks the 13 {item:Ancient Runes} — powerful weapon-type-specific runes crafted at Remnant encounters." }],
				},
				{ id: "act4-kingsmarch-talk-makoru", text: "Talk to {npc:Makoru} on ship, choose destination" },
			],
		},
		{
			id: "whakapanu-island",
			name: "Whakapanu Island",
			level: "42-43",
			tasks: [
				{ id: "act4-whakapanu-petrified-pirate", text: "{item:Petrified Pirate} on coast", optional: true, rewards: [{ text: "Torn Map 2/4", kind: "optional" }] },
				{ id: "act4-whakapanu-shark-pit", text: "Shark Pit: {boss:Great White One}", optional: true, boss: true, rewards: [{ text: "Shark Fin", kind: "optional" }] },
				{ id: "act4-whakapanu-clawcrunch", text: "Crabshell Cavern: {boss:Clawcrunch}", optional: true, boss: true, rewards: [{ text: "Support Gem Lv4", kind: "gem" }] },
				{ id: "act4-whakapanu-enter-singing-caverns", text: "Enter {loc:Singing Caverns}" },
			],
		},
		{
			id: "singing-caverns",
			name: "Singing Caverns",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-singing-caverns-humming-pearl", text: "{item:Beckoning Clam} → {item:Humming Pearl} (give to {npc:Rog})", optional: true, rewards: [{ text: "Humming Pearl", kind: "optional" }] },
				{ id: "act4-singing-caverns-kill-diamora", text: "Kill {boss:Diamora, Song of Death}", required: true, boss: true, rewards: [{ text: "Fragment", kind: "default" }] },
				{ id: "act4-singing-caverns-return-town", text: "Talk to {npc:Hooded One}, TP to town" },
			],
		},
		{
			id: "kingsmarch-hideout",
			name: "Kingsmarch — Hideout",
			tags: ["town"],
			tasks: [
				{ id: "act4-kingsmarch-hideout-talk-ange", text: "Talk to {npc:Ange} → {loc:Shoreline Hideout}" },
				{
					id: "act4-kingsmarch-hideout-clear",
					text: "Clear hideout, talk to {npc:Ange}",
					required: true,
					rewards: [{ text: "Hideout + Trading", kind: "perm" }],
				},
			],
		},
		{
			id: "shrike-island",
			name: "Shrike Island",
			level: "43-44",
			tasks: [
				{ id: "act4-shrike-impaled-karui", text: "{item:Corpse Nest} (Impaled Karui)", optional: true, rewards: [{ text: "Torn Map 4/4", kind: "optional" }] },
				{ id: "act4-shrike-kill-scourge", text: "Kill {boss:Scourge of the Skies}", required: true, boss: true, rewards: [{ text: "Fragment", kind: "default" }] },
				{ id: "act4-shrike-return-town", text: "Talk to {npc:Hooded One}, TP, sail next" },
			],
		},
		{
			id: "abandoned-prison",
			name: "Abandoned Prison",
			level: "44",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-prison-kill-mobs-key", text: "Kill mobs until {item:Chapel Key} drops", required: true },
				{
					id: "act4-prison-kill-forael",
					text: "Open Chapel, kill {boss:Forael}, use {item:Goddess of Justice}",
					required: true,
					boss: true,
					rewards: [{ text: "Flask choice", kind: "craft" }],
				},
				{ id: "act4-prison-enter-solitary", text: "Enter {loc:Solitary Confinement}" },
			],
		},
		{
			id: "solitary-confinement",
			name: "Solitary Confinement",
			tasks: [
				{ id: "act4-solitary-kill-prisoner", text: "Kill {boss:The Prisoner}", required: true, boss: true, rewards: [{ text: "Fragment", kind: "default" }] },
				{ id: "act4-solitary-return-town", text: "Talk to {npc:Hooded One}, sail to {loc:Isle of Kin}" },
			],
		},
		{
			id: "isle-of-kin",
			name: "Isle of Kin",
			level: "45",
			tasks: [
				{ id: "act4-isle-of-kin-flayed-sailor", text: "{item:Flayed Sailor} near shore", optional: true, rewards: [{ text: "Torn Map 3/4", kind: "optional" }] },
				{ id: "act4-isle-of-kin-beast-pen", text: "Beast Pen", optional: true, rewards: [{ text: "Skill Gem + Support Gem", kind: "gem" }] },
				{ id: "act4-isle-of-kin-kill-mimok", text: "Kill {boss:Mimok the Enslaved}", required: true, boss: true, rewards: [{ text: "Tier 4 Support Gem", kind: "gem" }] },
				{ id: "act4-isle-of-kin-blind-beast", text: "Primal Arena: {boss:Blind Beast}", optional: true, boss: true, rewards: [{ text: "Greater Blank Rune", kind: "craft" }] },
				{ id: "act4-isle-of-kin-enter-warrens", text: "Enter {loc:Volcanic Warrens}" },
			],
		},
		{
			id: "volcanic-warrens",
			name: "Volcanic Warrens",
			level: "45-46",
			tags: ["waypoint"],
			tasks: [
				{
					id: "act4-volcanic-warrens-magma-twins",
					text: "Volcanic Nest: {boss:Magma Twins} — kill Lightning first",
					optional: true,
					boss: true,
					rewards: [{ text: "Ruby Ring (Lightning first)", kind: "optional" }, { text: "Topaz Ring (Fire first)", kind: "optional" }],
					notesAfter: [{ type: "tip", text: "Kill order: Lightning first → Ruby Ring · Fire first → Topaz Ring" }],
				},
				{ id: "act4-volcanic-warrens-kill-krutog", text: "Kill {boss:Krutog, Lord of Kin}", required: true, boss: true },
				{ id: "act4-volcanic-warrens-free-matiki", text: "Click cage, free {npc:Matiki}" },
				{ id: "act4-volcanic-warrens-tp-kingsmarch", text: "TP to {loc:Kingsmarch}" },
			],
		},
		{
			id: "eye-of-hinekora",
			name: "Eye of Hinekora",
			level: "46-47",
			tags: ["waypoint"],
			notes: [{ type: "tip", text: "Hidden chest behind waterfall = Skill Gem Lv12 + Spirit Gem Lv12" }],
			tasks: [
				{ id: "act4-eye-of-hinekora-talk-matiki", text: "Talk to {npc:Matiki} in town, click well" },
				{
					id: "act4-eye-of-hinekora-waterfall-chest",
					text: "Chest behind waterfall",
					optional: true,
					rewards: [{ text: "Skill Gem Lv12", kind: "gem" }, { text: "Spirit Gem Lv12", kind: "gem" }],
				},
				{ id: "act4-eye-of-hinekora-three-tests", text: "Complete 3 Tests: {item:Fire}, {item:Nature}, {item:Cold}", required: true },
				{
					id: "act4-eye-of-hinekora-altar-navali",
					text: "{loc:Silent Hall} altar (Pay Respects), talk to {npc:Navali}",
					rewards: [{ text: "+5% Max Mana", kind: "perm" }],
				},
				{ id: "act4-eye-of-hinekora-enter-halls", text: "Enter {loc:Halls of the Dead}" },
			],
		},
		{
			id: "halls-of-the-dead",
			name: "Halls of the Dead",
			level: "47",
			tasks: [
				{ id: "act4-halls-trial-ngakanu", text: "Trial of Ngakanu (3 tests in clover-leaf), loot {item:Blank Tattoos}", required: true, rewards: [{ text: "Blank Tattoos", kind: "default" }] },
				{ id: "act4-halls-kill-yama", text: "Fight {boss:Yama the White} (low life pool — easy stun)", required: true, boss: true },
				{ id: "act4-halls-enter-trial-ancestors", text: "Enter {loc:Trial of Ancestors}" },
			],
		},
		{
			id: "trial-of-the-ancestors",
			name: "Trial of the Ancestors",
			level: "47-48",
			tasks: [
				{ id: "act4-trial-ancestors-talk-hinekora", text: "Talk to {npc:Hinekora}", required: true, rewards: [{ text: "+2 Skill Points", kind: "perm" }] },
				{
					id: "act4-trial-ancestors-choose-tattoo",
					text: "Choose tattoo",
					required: true,
					rewards: [{ text: "+5% Fire/Cold/Lightning Res (recommended)", kind: "perm" }, { text: "+5 Str/Dex/Int (alt)", kind: "optional" }],
				},
				{ id: "act4-trial-ancestors-sail-kedge", text: "TP, sail to {loc:Kedge Bay}" },
			],
		},
		{
			id: "kedge-bay",
			name: "Kedge Bay",
			level: "47-48",
			tags: ["waypoint"],
			tasks: [
				{
					id: "act4-kedge-bay-dead-mans-chest",
					text: "{item:Dead Man's Chest} / {item:Smuggler's Stash}",
					optional: true,
					rewards: [{ text: "Torn Map 1/4", kind: "optional" }],
				},
				{ id: "act4-kedge-bay-enter-journeys-end", text: "Enter {loc:Journey's End}" },
			],
		},
		{
			id: "journeys-end",
			name: "Journey's End",
			level: "48-49",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-journeys-end-talk-tujen", text: "Talk to {npc:Tujen}" },
				{ id: "act4-journeys-end-kill-harlin", text: "Kill {boss:Captain Harlin}, loot {item:Verisium}", required: true, boss: true },
				{ id: "act4-journeys-end-talk-freya", text: "TP to start, talk to {npc:Freya Hartlin}" },
				{ id: "act4-journeys-end-dannig-spikes", text: "Town → {npc:Dannig} → {item:Verisium Spikes}" },
				{ id: "act4-journeys-end-return-freya", text: "Back to {loc:Journey's End} → {npc:Freya}" },
				{
					id: "act4-journeys-end-kill-omniphobia",
					text: "Totem → kill {boss:Omniphobia}",
					required: true,
					boss: true,
					rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				},
				{ id: "act4-journeys-end-tujen-reward", text: "Talk to {npc:Tujen} in town for reward" },
			],
		},
		{
			id: "plunderers-point",
			name: "Plunderer's Point",
			tags: ["optional"],
			notes: [
				{ type: "info", text: "Requires all 4 Torn Maps turned in at Kingsmarch — give to Makoru, sail, Dannig → Expedition" },
				{ type: "patch", text: "0.5 Gating: Plunderer's Point can no longer be entered until all 4 Map Pieces are turned in." },
			],
			tasks: [
				{ id: "act4-plunderers-point-torn-maps", text: "Give 4 maps to {npc:Makoru} → sail → {npc:Dannig} → Expedition", optional: true },
			],
		},
		{
			id: "arastas",
			name: "Arastas",
			level: "49-50",
			tags: ["waypoint"],
			tasks: [
				{ id: "act4-arastas-lorandis", text: "{npc:Missionari Lorandis} → follow → destroy shield", required: true },
				{ id: "act4-arastas-bells", text: "{item:Evening/Morning Bells}", optional: true, rewards: [{ text: "3 Regals each", kind: "craft" }] },
				{ id: "act4-arastas-kill-torvian", text: "Kill {boss:Torvian} → enter {loc:Excavation}", required: true, boss: true },
				{ id: "act4-arastas-enter-excavation", text: "Enter {loc:The Excavation}" },
			],
		},
		{
			id: "the-excavation",
			name: "The Excavation",
			level: "50-51",
			tasks: [
				{ id: "act4-excavation-kill-benedictus", text: "Kill {boss:Benedictus}", required: true, boss: true },
				{ id: "act4-excavation-talk-hooded-one", text: "Talk to {npc:Hooded One}" },
				{ id: "act4-excavation-sail-ngakanu", text: "Sail to {loc:Ngakanu}" },
			],
		},
		{
			id: "ngakanu",
			name: "Ngakanu",
			level: "51",
			tasks: [
				{ id: "act4-ngakanu-navigate-maze", text: "Navigate maze → {loc:Heart of the Tribe}" },
				{ id: "act4-ngakanu-kill-tavaki", text: "Kill {boss:Tavaki}", required: true, boss: true },
				{ id: "act4-ngakanu-tp-rhodri", text: "TP town → {npc:Rhodri} → sail to final" },
			],
		},
		{
			id: "act4-finale",
			name: "Act IV Finale",
			level: "52",
			tags: ["boss-zone"],
			tasks: [
				{ id: "act4-finale-kill-zarokh", text: "Kill {boss:Zarokh} (Final Act 4 Boss)", required: true, boss: true },
				{
					id: "act4-finale-talk-hooded-one",
					text: "Return, talk to {npc:Hooded One} → Interludes unlock",
					notesAfter: [{ type: "success", text: "Act IV Complete — proceed to the Interludes" }],
				},
			],
		},
	],
};

export default act4;
