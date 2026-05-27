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
				{ id: "act2-vastiri-outskirts-talk-hooded-one", text: "Talk to {npc:The Hooded One}", required: true },
				{ id: "act2-vastiri-outskirts-kill-rathbreaker", text: "Kill {boss:Rathbreaker}", required: true, boss: true },
				{ id: "act2-vastiri-outskirts-tp-start", text: "TP back to start of zone" },
				{ id: "act2-vastiri-outskirts-talk-zarka", text: "Talk to {npc:Zarka}" },
				{ id: "act2-vastiri-outskirts-enter-ardura", text: "Enter {loc:The Ardura Caravan}" },
			],
		},
		{
			id: "ardura-caravan",
			name: "The Ardura Caravan",
			tags: ["town", "waypoint"],
			tasks: [
				{ id: "act2-ardura-caravan-talk-hooded-one", text: "Talk to {npc:Hooded One} + {npc:Sekhema Asala} (×2)" },
				{
					id: "act2-ardura-caravan-talk-farrow",
					text: "Talk to {npc:Farrow} → accept Quest 2",
					rewards: [{ text: "Unlocks Runic Alloy Crafting", kind: "craft" }],
					notesAfter: [{ type: "new", label: "0.5 New", text: "{npc:Farrow}'s Act 2 quest unlocks {item:Runic Alloy} currencies — used to upgrade socketed runes into more powerful combined versions." }],
				},
				{ id: "act2-ardura-caravan-desert-map", text: "Use {item:Desert Map} → travel to {loc:Halani Gates}" },
				{ id: "act2-ardura-caravan-halani-gates", text: "Enter {loc:Halani Gates} → talk to {npc:Sekhema Asala}" },
				{ id: "act2-ardura-caravan-mawdun-quarry", text: "Travel to {loc:Mawdun Quarry}" },
			],
		},
		{
			id: "mawdun-quarry",
			name: "Mawdun Quarry",
			level: "15",
			tasks: [
				{ id: "act2-mawdun-quarry-war-cache", text: "{item:Faridun War Cache} near checkpoint", optional: true, rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
				{ id: "act2-mawdun-quarry-enter-mine", text: "Enter {loc:Mawdun Mine} (follow checkpoints)" },
			],
		},
		{
			id: "mawdun-mine",
			name: "Mawdun Mine",
			level: "16",
			tasks: [
				{ id: "act2-mawdun-mine-kill-rudja", text: "Kill {boss:Rudja}", required: true, boss: true },
				{ id: "act2-mawdun-mine-talk-risu", text: "Talk to {npc:Risu} in cage", note: "Freeing Risu enables route shortcut" },
				{ id: "act2-mawdun-mine-tp-town", text: "TP back to town" },
			],
		},
		{
			id: "traitors-passage",
			name: "Traitor's Passage",
			level: "17",
			notes: [{ type: "patch", text: "0.5 Pathing: Interact with the {item:Ancient Seal} door to open a shortcut — follow torches through to {loc:Halani Gates} faster." }],
			tasks: [
				{ id: "act2-traitors-passage-runic-seals", text: "Interact with {item:Ancient Seal} door + {item:Runic Seals}", required: true },
				{
					id: "act2-traitors-passage-kill-balbala",
					text: "Kill {boss:Balbala, the Traitor} ({item:Djinn Barya})",
					optional: true,
					boss: true,
					note: "Most builds skip; obtain alternate Barya at Lvl 28",
					notesAfter: [{ type: "tip", text: "Skip Balbala here — kill the vultures in {loc:Deshar} later for a Lvl 28 {item:Djinn Barya} instead." }],
				},
				{ id: "act2-traitors-passage-bell-chest", text: "Bell Chest in dead end", optional: true, rewards: [{ text: "Support Gem", kind: "gem" }] },
				{ id: "act2-traitors-passage-enter-halani", text: "Enter {loc:The Halani Gates}" },
			],
		},
		{
			id: "the-halani-gates",
			name: "The Halani Gates",
			level: "18",
			tasks: [
				{
					id: "act2-halani-gates-summon-asala",
					text: "Summon {npc:Asala} to open gates",
					required: true,
					notesAfter: [{ type: "tip", text: "{npc:Asala} can lag behind — wait near the gate if she doesn't trigger it." }],
				},
				{ id: "act2-halani-gates-kill-jamanra", text: "Kill {boss:Jamanra} (first encounter)", required: true, boss: true },
				{ id: "act2-halani-gates-checkpoint", text: "Stairs up, search checkpoint area" },
			],
		},
		{
			id: "mastodon-badlands",
			name: "Mastodon Badlands",
			level: "19-20",
			notes: [
				{ type: "warning", text: "Run BEFORE Keth for proper level scaling" },
				{ type: "patch", text: "0.5 Pathing: Follow ground cracks on the floor — they lead to {loc:Lightless Caverns} and the entrance to {loc:The Bone Pits}." },
			],
			tasks: [
				{ id: "act2-mastodon-badlands-effigy", text: "Effigy near checkpoint", optional: true, rewards: [{ text: "Support Gem Lv2", kind: "gem" }] },
				{
					id: "act2-mastodon-badlands-enter-bone-pits",
					text: "Enter {loc:The Bone Pits}",
					notesAfter: [{ type: "tip", text: "Complete Mastodon before {loc:Keth} — {boss:Kabala} only drops the Lv7 gem if Mastodon is cleared first." }],
				},
			],
		},
		{
			id: "the-bone-pits",
			name: "The Bone Pits",
			level: "20-21",
			tasks: [
				{
					id: "act2-bone-pits-sun-clan-relic",
					text: "Kill hyenas until {item:Sun Clan Relic} drops",
					required: true,
					rewards: [{ text: "Sun Clan Relic", kind: "default" }],
					notesAfter: [{ type: "tip", text: "Tall Goliath hyenas have a higher drop chance for the {item:Sun Clan Relic}." }],
				},
				{ id: "act2-bone-pits-kill-iktab-ekbab", text: "Kill {boss:Iktab & Ekbab}", required: true, boss: true, rewards: [{ text: "Mastodon Tusks", kind: "default" }] },
			],
		},
		{
			id: "keth",
			name: "Keth",
			level: "22",
			tags: ["waypoint"],
			tasks: [
				{ id: "act2-keth-kabala-relic", text: "Kill snakes until {item:Kabala Clan Relic} drops", required: true, rewards: [{ text: "Kabala Clan Relic", kind: "default" }] },
				{
					id: "act2-keth-kill-kabala",
					text: "Kill {boss:Kabala, Constrictor Queen}",
					required: true,
					boss: true,
					note: "Drops Lv7 gem only if Mastodon completed first",
					rewards: [{ text: "+2 Skill Points", kind: "perm" }, { text: "Skill Gem Lv7", kind: "gem" }],
				},
				{ id: "act2-keth-enter-lost-city", text: "Enter {loc:The Lost City}" },
			],
		},
		{
			id: "the-lost-city",
			name: "The Lost City",
			level: "23",
			tasks: [
				{ id: "act2-lost-city-ninth-treasure", text: "Kill {boss:Ninth Treasure of Keth}", optional: true, boss: true },
				{ id: "act2-lost-city-golden-tomb", text: "{loc:Golden Tomb}", optional: true, rewards: [{ text: "Spirit Gem Lv7", kind: "gem" }] },
				{ id: "act2-lost-city-enter-buried-shrines", text: "Enter {loc:Buried Shrines}" },
			],
		},
		{
			id: "buried-shrines",
			name: "Buried Shrines",
			level: "23",
			tasks: [
				{ id: "act2-buried-shrines-sarcophagus", text: "Guarded sarcophagus", optional: true, rewards: [{ text: "Support Gem", kind: "gem" }, { text: "Lesser Jeweller's Orb", kind: "craft" }] },
				{ id: "act2-buried-shrines-offering", text: "Choose Offering (fire / water / lightning)", optional: true, rewards: [{ text: "Resist Ring", kind: "optional" }] },
				{ id: "act2-buried-shrines-enter-heart", text: "Enter {loc:The Heart of Keth}" },
			],
		},
		{
			id: "heart-of-keth",
			name: "The Heart of Keth",
			level: "24",
			tags: ["boss-zone"],
			tasks: [
				{ id: "act2-heart-of-keth-kill-azarian", text: "Kill {boss:Azarian}", required: true, boss: true },
				{ id: "act2-heart-of-keth-water-goddess", text: "Talk to {npc:Water Goddess} → {item:Everburning Cinders} → ignite", required: true },
			],
		},
		{
			id: "valley-of-the-titans",
			name: "Valley of the Titans",
			level: "25",
			tags: ["waypoint"],
			tasks: [
				{ id: "act2-valley-ancient-seals", text: "Find 3 {item:Ancient Seals} (perimeter)", required: true },
				{
					id: "act2-valley-place-relics",
					text: "Find {item:Medallion} near WP, place both relics",
					required: true,
					rewards: [{ text: "+30% Charm Charges", kind: "perm" }, { text: "+15% Mana Recovery (alt)", kind: "optional" }],
					notesAfter: [{ type: "tip", text: "Check all side paths — league mechanic at Valley of the Titans gives strong currency rewards." }],
				},
				{ id: "act2-valley-enter-grotto", text: "Enter {loc:The Titan Grotto}" },
			],
		},
		{
			id: "the-titan-grotto",
			name: "The Titan Grotto",
			level: "25-26",
			tasks: [
				{ id: "act2-titan-grotto-kill-zalmarath", text: "Kill {boss:Zalmarath, the Colossus}", required: true, boss: true, rewards: [{ text: "Flame Ruby", kind: "default" }] },
			],
		},
		{
			id: "deshar",
			name: "Deshar",
			level: "26-27",
			tasks: [
				{ id: "act2-deshar-fallen-dekhara", text: "Find {item:Fallen Dekhara} near tower", required: true, rewards: [{ text: "+2 Skill Points", kind: "perm" }] },
				{ id: "act2-deshar-letter-delivery", text: "Deliver {npc:Lihl Lima}'s letter to {npc:Shambrin} in town", required: true },
				{
					id: "act2-deshar-kill-vultures",
					text: "Kill 2 Vultures",
					optional: true,
					note: "Preferred speedrun alternative to Balbala fight",
					rewards: [{ text: "Djinn Barya Lv28", kind: "craft" }],
					notesAfter: [{ type: "success", text: "Easy kills → straight path to {loc:Trial of Sekhemas} with the Lvl 28 {item:Djinn Barya}." }],
				},
				{ id: "act2-deshar-dead-end", text: "Side dead-end", optional: true, rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
				{ id: "act2-deshar-enter-path", text: "Enter {loc:Path of Mourning}" },
			],
		},
		{
			id: "path-of-mourning",
			name: "Path of Mourning",
			level: "27",
			tasks: [
				{ id: "act2-path-of-mourning-shifting-vases", text: "Shifting Vases encounter", optional: true, rewards: [{ text: "4 Rares", kind: "optional" }, { text: "Support Gem Lv2", kind: "gem" }] },
				{ id: "act2-path-of-mourning-enter-spires", text: "Enter {loc:The Spires of Deshar}" },
			],
		},
		{
			id: "spires-of-deshar",
			name: "The Spires of Deshar",
			level: "27",
			notes: [{ type: "warning", text: "Cap lightning resistance before Tor Gul — one of the hardest fights in Act II" }],
			tasks: [
				{ id: "act2-spires-sisters-shrine", text: "Interact with {item:Sisters of Garukhan} shrine", required: true, rewards: [{ text: "+10% Lightning Res", kind: "perm" }] },
				{ id: "act2-spires-kill-tor-gul", text: "Kill {boss:Tor Gul}", required: true, boss: true },
			],
		},
		{
			id: "trial-of-sekhemas",
			name: "Trial of Sekhemas",
			level: "28",
			tags: ["waypoint"],
			notes: [
				{ type: "patch", text: "0.5 New: {item:Reforging Bench} inside the trial lets you re-roll {item:Runic Ward} Honour at the cost of relics — powerful mid-trial recovery option." },
				{ type: "tip", text: "Select Lvl 28 {item:Djinn Barya} — do NOT use the default Lv22 {item:Balbala Barya}" },
			],
			tasks: [
				{
					id: "act2-trial-sekhemas-barya",
					text: "Enter trial with Lvl 28 {item:Djinn Barya}",
					required: true,
					notesAfter: [{ type: "warning", text: "Use the Lvl 28 {item:Djinn Barya} (from vulture kill), NOT the Lv22 default — the higher Barya gives substantially better Ascendancy rewards." }],
				},
				{ id: "act2-trial-sekhemas-room-order", text: "Prefer Ritual > Chalice > Hourglass > Gauntlet rooms", optional: true },
				{ id: "act2-trial-sekhemas-ascend", text: "Complete trial → 1st Ascendancy", required: true, rewards: [{ text: "First Ascendancy", kind: "perm" }] },
			],
		},
		{
			id: "the-dreadnought",
			name: "The Dreadnought",
			level: "28-29",
			tags: ["boss-zone"],
			notes: [
				{ type: "tip", text: "~55k phys damage stuns before lightning fence phase" },
				{ type: "patch", text: "0.5 Change: The second Dreadnought area has been removed — fight proceeds directly to {boss:Jamanra} after boarding." },
			],
			tasks: [
				{ id: "act2-dreadnought-kill-jamanra", text: "Kill {boss:Jamanra, the Risen King} (Act Boss)", required: true, boss: true },
				{ id: "act2-dreadnought-return-caravan", text: "Return to {loc:Ardura Caravan}" },
				{ id: "act2-dreadnought-exit-caravan", text: "Exit caravan (top left) → talk to {npc:Hooded One}", note: "Wait for animation" },
				{
					id: "act2-dreadnought-talk-asala",
					text: "Talk to {npc:Sekhema Asala} → Travel to {loc:Sandswept Marsh}",
					notesAfter: [{ type: "success", text: "Act II Complete — proceed to Act III" }],
				},
			],
		},
	],
};

export default act2;
