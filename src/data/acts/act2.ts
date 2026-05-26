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
				{ id: "act2-vastiri-outskirts-tp-start", text: "TP back to start of zone" },
				{ id: "act2-vastiri-outskirts-talk-zarka", text: "Talk to Zarka" },
				{ id: "act2-vastiri-outskirts-enter-ardura", text: "Enter The Ardura Caravan" },
			],
		},
		{
			id: "ardura-caravan",
			name: "The Ardura Caravan",
			tags: ["town", "waypoint"],
			tasks: [
				{ id: "act2-ardura-caravan-talk-hooded-one", text: "Talk to Hooded One + Sekhema Asala (×2)" },
				{ id: "act2-ardura-caravan-talk-farrow", text: "Talk to Farrow → accept Quest 2 (Runic Alloys)" },
				{ id: "act2-ardura-caravan-desert-map", text: "Use Desert Map → travel to Halani Gates" },
				{ id: "act2-ardura-caravan-halani-gates", text: "Enter Halani Gates → talk to Sekhema Asala" },
				{ id: "act2-ardura-caravan-mawdun-quarry", text: "Travel to Mawdun Quarry" },
			],
		},
		{
			id: "mawdun-quarry",
			name: "Mawdun Quarry",
			level: "15",
			tasks: [
				{ id: "act2-mawdun-quarry-war-cache", text: "Faridun War Cache near checkpoint", optional: true, rewards: ["Artificer's Orb"] },
				{ id: "act2-mawdun-quarry-enter-mine", text: "Enter Mawdun Mine (follow checkpoints)" },
			],
		},
		{
			id: "mawdun-mine",
			name: "Mawdun Mine",
			level: "16",
			tags: ["required"],
			tasks: [
				{ id: "act2-mawdun-mine-kill-rudja", text: "Kill Rudja", required: true, boss: true },
				{ id: "act2-mawdun-mine-talk-risu", text: "Talk to Risu in cage", note: "Freeing Risu enables route shortcut" },
				{ id: "act2-mawdun-mine-tp-town", text: "TP back to town" },
			],
		},
		{
			id: "traitors-passage",
			name: "Traitor's Passage",
			level: "17",
			tasks: [
				{ id: "act2-traitors-passage-runic-seals", text: "Interact with Ancient Seal door + Runic Seals", required: true },
				{ id: "act2-traitors-passage-kill-balbala", text: "Kill Balbala, the Traitor Djinn Barya", optional: true, boss: true, note: "Most builds skip; obtain alternate Barya at Lvl 28" },
				{ id: "act2-traitors-passage-bell-chest", text: "Bell Chest in dead end", optional: true },
				{ id: "act2-traitors-passage-enter-halani", text: "Enter The Halani Gates" },
			],
		},
		{
			id: "the-halani-gates",
			name: "The Halani Gates",
			level: "18",
			tasks: [
				{ id: "act2-halani-gates-summon-asala", text: "Summon Asala to open gates", required: true },
				{ id: "act2-halani-gates-kill-jamanra", text: "Kill Jamanra (first encounter)", required: true, boss: true },
				{ id: "act2-halani-gates-checkpoint", text: "Stairs up, search checkpoint area" },
			],
		},
		{
			id: "mastodon-badlands",
			name: "Mastodon Badlands",
			level: "19-20",
			notes: [{ type: "warning", text: "Run BEFORE Keth for proper level scaling" }],
			tasks: [
				{ id: "act2-mastodon-badlands-effigy", text: "Effigy near checkpoint", optional: true, rewards: ["Support Gem Lv2"] },
				{ id: "act2-mastodon-badlands-enter-bone-pits", text: "Enter The Bone Pits" },
			],
		},
		{
			id: "the-bone-pits",
			name: "The Bone Pits",
			level: "20-21",
			tasks: [
				{ id: "act2-bone-pits-sun-clan-relic", text: "Kill hyenas until Sun Clan Relic drops", required: true, note: "Tall Goliaths have higher drop chance", rewards: ["Sun Clan Relic"] },
				{ id: "act2-bone-pits-kill-iktab-ekbab", text: "Kill Iktab & Ekbab", required: true, boss: true, rewards: ["Mastodon Tusks"] },
			],
		},
		{
			id: "keth",
			name: "Keth",
			level: "22",
			tags: ["waypoint"],
			tasks: [
				{ id: "act2-keth-kabala-relic", text: "Kill snakes until Kabala Clan Relic drops", required: true, rewards: ["Kabala Clan Relic"] },
				{ id: "act2-keth-kill-kabala", text: "Kill Kabala, Constrictor Queen", required: true, boss: true, rewards: ["+2 Skill Points", "Skill Gem Lv7"], note: "Drops Lv7 gem only if Mastodon completed first" },
				{ id: "act2-keth-enter-lost-city", text: "Enter The Lost City" },
			],
		},
		{
			id: "the-lost-city",
			name: "The Lost City",
			level: "23",
			tasks: [
				{ id: "act2-lost-city-ninth-treasure", text: "Kill Ninth Treasure of Keth", optional: true, boss: true },
				{ id: "act2-lost-city-golden-tomb", text: "Golden Tomb", optional: true, rewards: ["Spirit Gem Lv7"] },
				{ id: "act2-lost-city-enter-buried-shrines", text: "Enter Buried Shrines" },
			],
		},
		{
			id: "buried-shrines",
			name: "Buried Shrines",
			level: "23",
			tasks: [
				{ id: "act2-buried-shrines-sarcophagus", text: "Guarded sarcophagus", optional: true, rewards: ["Support Gem", "Lesser Jeweller's Orb"] },
				{ id: "act2-buried-shrines-offering", text: "Choose Offering (fire/water/lightning)", optional: true, rewards: ["Resist Ring"] },
				{ id: "act2-buried-shrines-enter-heart", text: "Enter The Heart of Keth" },
			],
		},
		{
			id: "heart-of-keth",
			name: "The Heart of Keth",
			level: "24",
			tags: ["boss-zone"],
			tasks: [
				{ id: "act2-heart-of-keth-kill-azarian", text: "Kill Azarian", required: true, boss: true },
				{ id: "act2-heart-of-keth-water-goddess", text: "Talk to Water Goddess → Everburning Cinders → ignite", required: true },
			],
		},
		{
			id: "valley-of-the-titans",
			name: "Valley of the Titans",
			level: "25",
			tags: ["waypoint"],
			tasks: [
				{ id: "act2-valley-ancient-seals", text: "Find 3 Ancient Seals (perimeter)", required: true },
				{ id: "act2-valley-place-relics", text: "Find Medallion near WP, place both relics", required: true, rewards: ["+30% Charm Charges OR +15% Mana Recovery"] },
				{ id: "act2-valley-enter-grotto", text: "Enter The Titan Grotto" },
			],
		},
		{
			id: "the-titan-grotto",
			name: "The Titan Grotto",
			level: "25-26",
			tasks: [
				{ id: "act2-titan-grotto-kill-zalmarath", text: "Kill Zalmarath, the Colossus", required: true, boss: true, rewards: ["Flame Ruby"] },
			],
		},
		{
			id: "deshar",
			name: "Deshar",
			level: "26-27",
			tasks: [
				{ id: "act2-deshar-fallen-dekhara", text: "Find Fallen Dekhara near tower", required: true, rewards: ["+2 Skill Points"] },
				{ id: "act2-deshar-letter-delivery", text: "Deliver Lihl Lima's letter to Shambrin in town", required: true },
				{ id: "act2-deshar-kill-vultures", text: "Kill 2 Vultures", optional: true, rewards: ["Backup Djinn Barya (Lv28)"], note: "Preferred speedrun alternative to Balbala fight" },
				{ id: "act2-deshar-dead-end", text: "Side dead-end", optional: true, rewards: ["Artificer's Orb"] },
				{ id: "act2-deshar-enter-path", text: "Enter Path of Mourning" },
			],
		},
		{
			id: "path-of-mourning",
			name: "Path of Mourning",
			level: "27",
			tasks: [
				{ id: "act2-path-of-mourning-shifting-vases", text: "Shifting Vases encounter", optional: true, rewards: ["4 Rares", "Support Gem Lv2"] },
				{ id: "act2-path-of-mourning-enter-spires", text: "Enter The Spires of Deshar" },
			],
		},
		{
			id: "spires-of-deshar",
			name: "The Spires of Deshar",
			level: "27",
			notes: [{ type: "warning", text: "Cap lightning resistance before Tor Gul — one of the hardest fights in Act II" }],
			tasks: [
				{ id: "act2-spires-sisters-shrine", text: "Interact with Sisters of Garukhan shrine", required: true, rewards: ["+10% Lightning Res"] },
				{ id: "act2-spires-kill-tor-gul", text: "Kill Tor Gul", required: true, boss: true },
			],
		},
		{
			id: "trial-of-sekhemas",
			name: "Trial of Sekhemas",
			level: "28",
			tags: ["waypoint"],
			notes: [{ type: "tip", text: "Select Lvl 28 Djinn Barya — do NOT pick default Lv22 Balbala" }],
			tasks: [
				{ id: "act2-trial-sekhemas-barya", text: "Enter trial with Lvl 28 Djinn Barya", required: true },
				{ id: "act2-trial-sekhemas-room-order", text: "Prefer Ritual > Chalice > Hourglass > Gauntlet rooms", optional: true },
				{ id: "act2-trial-sekhemas-ascend", text: "Complete trial → 1st Ascendancy", required: true, rewards: ["First Ascendancy"] },
			],
		},
		{
			id: "the-dreadnought",
			name: "The Dreadnought",
			level: "28-29",
			tags: ["boss-zone"],
			notes: [{ type: "tip", text: "~55k phys damage stuns before lightning fence phase" }],
			tasks: [
				{ id: "act2-dreadnought-kill-jamanra", text: "Kill Jamanra, the Risen King (Act Boss)", required: true, boss: true },
				{ id: "act2-dreadnought-return-caravan", text: "Return to Ardura Caravan" },
				{ id: "act2-dreadnought-exit-caravan", text: "Exit caravan (top left) → talk to Hooded One", note: "Wait for animation" },
				{ id: "act2-dreadnought-talk-asala", text: "Talk to Sekhema Asala → Travel to Sandswept Marsh" },
			],
		},
	],
};

export default act2;
