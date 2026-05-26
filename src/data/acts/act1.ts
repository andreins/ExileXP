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
			tasks: [
				{ id: "act1-riverbank-talk-wounded-man", text: "Talk to Wounded Man, equip starter weapon" },
				{ id: "act1-riverbank-loot-chests", text: "Loot Large Chests, equip items + skills" },
				{ id: "act1-riverbank-kill-bloated-miller", text: "Kill The Bloated Miller", required: true, boss: true },
				{ id: "act1-riverbank-enter-clearfell", text: "Enter Clearfell Encampment behind boss" },
			],
		},
		{
			id: "clearfell-encampment",
			name: "Clearfell Encampment",
			level: "2",
			tags: ["town"],
			tasks: [
				{ id: "act1-clearfell-encampment-talk-renly", text: "Talk to Renly", rewards: ["Skill Gem Lv1"] },
				{ id: "act1-clearfell-encampment-talk-farrow", text: "Talk to Farrow", note: "Unlocks Verisium Runeforging" },
				{ id: "act1-clearfell-encampment-enter-clearfell", text: "Enter Clearfell" },
			],
		},
		{
			id: "clearfell",
			name: "Clearfell",
			level: "2-3",
			tasks: [
				{ id: "act1-clearfell-kill-beira", text: "Kill Beira of the Rotten Pack (north)", required: true, boss: true, rewards: ["+10% Cold Res"] },
				{ id: "act1-clearfell-mud-burrow", text: "Mud Burrow", optional: true, rewards: ["Skill Gem Lv2"] },
				{ id: "act1-clearfell-abandoned-stash", text: "Abandoned Stash", optional: true, rewards: ["Skill Gem Lv1"] },
				{ id: "act1-clearfell-enter-grelwood", text: "Proceed to The Grelwood" },
			],
		},
		{
			id: "the-grelwood",
			name: "The Grelwood",
			level: "3-5",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-the-grelwood-find-una", text: "Find Una, take Waypoint" },
				{ id: "act1-the-grelwood-enter-grim-tangle", text: "Enter Grim Tangle → return" },
				{ id: "act1-the-grelwood-enter-red-vale", text: "Enter The Red Vale → return" },
				{ id: "act1-the-grelwood-kill-gerung", text: "Kill Gerung, the Brambleghast", optional: true, boss: true, rewards: ["Skill Gem Lv1"] },
				{ id: "act1-the-grelwood-hut-cauldron", text: "Hut with Cauldron", optional: true, rewards: ["Areagne Support Gem"] },
			],
		},
		{
			id: "the-red-vale",
			name: "The Red Vale",
			level: "5-6",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-the-red-vale-find-obelisks", text: "Find 3 Obelisks of Rust, loot Runed Girdle from each", required: true },
				{ id: "act1-the-red-vale-kill-rust-king", text: "Kill The Rust King at last obelisk", required: true, boss: true },
				{ id: "act1-the-red-vale-return-town", text: "Return to town" },
			],
		},
		{
			id: "grim-tangle",
			name: "Grim Tangle",
			level: "6",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-grim-tangle-kill-rotten-druid", text: "Kill The Rotten Druid", optional: true, boss: true, rewards: ["Support Gem"] },
				{ id: "act1-grim-tangle-enter-cemetery", text: "Proceed to Cemetery of the Eternals" },
			],
		},
		{
			id: "cemetery-of-the-eternals",
			name: "Cemetery of the Eternals",
			level: "6-9",
			notes: [{ type: "tip", text: "Do Draven first — Clearfell hint" }],
			tasks: [
				{ id: "act1-cemetery-talk-lachlann", text: "Talk to Lachlann the Lost" },
				{ id: "act1-cemetery-sarcophagus", text: "Sarcophagus near checkpoint", optional: true, rewards: ["Ring"] },
				{ id: "act1-cemetery-kill-draven", text: "Kill Draven in Mausoleum of the Praetor", required: true, boss: true, rewards: ["Key Piece"] },
				{ id: "act1-cemetery-forgotten-riches", text: "Forgotten Riches hidden cache", optional: true, rewards: ["Support Gem", "Gold"] },
				{ id: "act1-cemetery-kill-asinia", text: "Kill Asinia in Tomb of the Consort", required: true, boss: true, rewards: ["Key Piece"] },
				{ id: "act1-cemetery-kill-lachlann", text: "Open Memorial Gate, kill Lachlann", required: true, boss: true, rewards: ["Ring"] },
				{ id: "act1-cemetery-enter-hunting-grounds", text: "Proceed to Hunting Grounds" },
			],
		},
		{
			id: "hunting-grounds",
			name: "Hunting Grounds",
			level: "10",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-hunting-grounds-talk-delwyn", text: "Talk to Delwyn" },
				{ id: "act1-hunting-grounds-kill-crowbell", text: "Kill The Crowbell", required: true, boss: true, rewards: ["+2 Skill Points"] },
				{ id: "act1-hunting-grounds-enter-freythorn", text: "Enter Freythorn → return" },
				{ id: "act1-hunting-grounds-enter-farmlands", text: "Enter Ogham Farmlands → return" },
				{ id: "act1-hunting-grounds-ritual", text: "Small ritual event", optional: true, rewards: ["Support Gem"] },
			],
		},
		{
			id: "freythorn",
			name: "Freythorn",
			level: "11-12",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-freythorn-activate-altars", text: "Activate 3 small Ritual Altars", required: true },
				{ id: "act1-freythorn-kill-king-in-mists", text: "Kill The King in the Mists at big altar", required: true, boss: true, rewards: ["+30 Spirit"] },
				{ id: "act1-freythorn-enter-farmlands", text: "Proceed to Ogham Farmlands" },
			],
		},
		{
			id: "ogham-farmlands",
			name: "Ogham Farmlands",
			level: "12",
			tags: ["waypoint"],
			tasks: [
				{ id: "act1-ogham-farmlands-unas-lute", text: "Retrieve Una's Lute from house near checkpoint", required: true, rewards: ["+2 Skill Points"] },
				{ id: "act1-ogham-farmlands-rare-dogs", text: "Rare dogs in crop circle", optional: true, rewards: ["Skill Gem Lv4"] },
				{ id: "act1-ogham-farmlands-enter-village", text: "Proceed to Ogham Village" },
			],
		},
		{
			id: "ogham-village",
			name: "Ogham Village",
			level: "12-13",
			tasks: [
				{ id: "act1-ogham-village-salvage-bench", text: "Smithing Tools (Salvage Bench)", note: "First character only", rewards: ["Salvage Bench"] },
				{ id: "act1-ogham-village-blacksmiths-chest", text: "Blacksmith's Chest", optional: true, rewards: ["Blank Rune", "Artificer's Orb"] },
				{ id: "act1-ogham-village-kill-executioner", text: "Kill The Executioner", required: true, boss: true },
				{ id: "act1-ogham-village-lever-leitis", text: "Activate lever upstairs, talk to Leitis" },
				{ id: "act1-ogham-village-enter-ramparts", text: "Proceed to Manor Ramparts" },
			],
		},
		{
			id: "manor-ramparts",
			name: "Manor Ramparts",
			level: "13",
			tasks: [
				{ id: "act1-manor-ramparts-hanging-man", text: "Rope on hanging man near checkpoint", optional: true, rewards: ["Support Gem"] },
				{ id: "act1-manor-ramparts-enter-manor", text: "Proceed to Ogham Manor" },
			],
		},
		{
			id: "ogham-manor",
			name: "Ogham Manor",
			level: "13-14",
			tags: ["boss-zone"],
			tasks: [
				{ id: "act1-ogham-manor-kill-candlemass", text: "Kill Candlemass", required: true, boss: true, rewards: ["+20 Max Life"] },
				{ id: "act1-ogham-manor-kill-geonor", text: "Kill Geonor (Act Boss)", required: true, boss: true },
				{ id: "act1-ogham-manor-return-town", text: "Return to town, talk to all NPCs" },
			],
		},
	],
};

export default act1;
