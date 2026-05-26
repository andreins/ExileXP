import type { ActGuide } from "../../types/guide";

const interludes: ActGuide = {
	id: "interludes",
	label: "Interludes",
	title: "Between Acts",
	subtitle: "Complete all 3 for significant permanent rewards",
	zones: [
		// ── Interlude 1: Ogham, The Refuge ────────────────────────
		{
			id: "holten",
			name: "Holten",
			level: "52-53",
			tags: ["town"],
			tasks: [
				{ id: "interludes-holten-travel", text: "Travel to Holten via The Hooded One" },
				{ id: "interludes-holten-soul-ferryman", text: "Visit Soul of the Ferryman", optional: true, rewards: ["Greater Runes"] },
			],
		},
		{
			id: "wolvenhold",
			name: "Wolvenhold",
			level: "52-53",
			tags: ["boss-zone"],
			tasks: [
				{ id: "interludes-wolvenhold-progress", text: "Progress through Wolvenhold" },
				{ id: "interludes-wolvenhold-kill-oswin", text: "Defeat Oswin, the Dread Warden", required: true, boss: true, rewards: ["+2 Skill Points"] },
			],
		},
		// ── Interlude 2: Khari Bazaar ──────────────────────────────
		{
			id: "khari-crossing",
			name: "Khari Crossing",
			level: "54-55",
			tags: ["town"],
			tasks: [
				{ id: "interludes-khari-crossing-travel", text: "Travel to Khari Crossing via The Hooded One" },
			],
		},
		{
			id: "khari-bazaar",
			name: "Khari Bazaar",
			level: "54-55",
			tasks: [
				{ id: "interludes-khari-kill-akthi-anundr", text: "Slay Akthi & Anundr (Worm + Scorpion)", required: true, boss: true, rewards: ["+2 Skill Points", "+5% Max Life"] },
				{ id: "interludes-khari-talk-risu", text: "Speak to Risu" },
				{ id: "interludes-khari-skullmaw", text: "Enter Skullmaw Stairway, activate Molten One's Gift" },
			],
		},
		{
			id: "qimah",
			name: "Qimah",
			level: "54-55",
			notes: [{ type: "tip", text: "Boon is swappable at any time" }],
			tasks: [
				{ id: "interludes-qimah-orbala-pillar", text: "Use Orbala's Pillar — select 1 of 7 Boons", required: true, rewards: ["Permanent Boon (swappable)"] },
				{ id: "interludes-qimah-sel-khari", text: "Enter Sel Khari Sanctuary, place Baryas on pedestals", required: true, rewards: ["Rare ring / amulet / jewel"] },
			],
		},
		// ── Interlude 3: Mount Kriar, The Glade ───────────────────
		{
			id: "mount-kriar",
			name: "Mount Kriar",
			level: "55-58",
			tasks: [
				{ id: "interludes-mount-kriar-travel", text: "Travel via The Hooded One" },
				{ id: "interludes-mount-kriar-ancient-monument", text: "Find Ancient Monument in Ashen Forest", optional: true, rewards: ["Skill Gem"] },
				{ id: "interludes-mount-kriar-beacons", text: "Energize 6 Ancient Beacons (Fate of the Vaal storyline)", required: true },
			],
		},
		{
			id: "kriar-village",
			name: "Kriar Village",
			level: "55-58",
			tasks: [
				{ id: "interludes-kriar-village-kill-lythara", text: "Slay Lythara, the Wayward Spear", required: true, boss: true },
			],
		},
		{
			id: "howling-caves",
			name: "Howling Caves",
			level: "55-58",
			tasks: [
				{ id: "interludes-howling-caves-kill-yeti", text: "Defeat The Abominable Yeti", required: true, boss: true },
			],
		},
		{
			id: "kriar-peaks",
			name: "Kriar Peaks",
			level: "55-58",
			notes: [{ type: "tip", text: "Elder Maddox is at 10–11 o'clock position" }],
			tasks: [
				{ id: "interludes-kriar-peaks-elder-maddox", text: "Locate Elder Maddox", required: true },
				{ id: "interludes-kriar-peaks-doryani-contingency", text: "Doryani's Contingency (far right)", optional: true },
				{ id: "interludes-kriar-peaks-complete", text: "Complete Interlude 3", required: true, rewards: ["+4 Skill Points", "+40 Spirit", "Free Unique Item", "Spirit Gem Lv14"] },
			],
		},
		// ── Final reward ───────────────────────────────────────────
		{
			id: "interludes-completion",
			name: "All Interludes Complete",
			notes: [{ type: "info", text: "Talk to The Hooded One after finishing all 3 interludes" }],
			tasks: [
				{ id: "interludes-completion-talk-hooded-one", text: "Talk to The Hooded One", required: true, rewards: ["+2 Skill Points"] },
				{ id: "interludes-completion-endgame", text: "Maps / endgame unlocks at level 58-60" },
			],
		},
	],
};

export default interludes;
