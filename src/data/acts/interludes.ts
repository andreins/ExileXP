import type { ActGuide } from "../../types/guide";

const interludes: ActGuide = {
	id: "interludes",
	label: "Interludes",
	title: "Between Acts",
	subtitle: "Complete all 3 for significant permanent rewards",
	zones: [
		// ── Interlude 5.1: Ogham, The Refuge ────────────────────────
		{
			id: "holten",
			name: "Holten",
			level: "52-53",
			tags: ["town"],
			tasks: [
				{ id: "interludes-holten-travel", text: "Travel to {loc:Holten} (docks town) — talk to {npc:The Hooded One}" },
				{ id: "interludes-holten-soul-ferryman", text: "Visit {npc:Soul of the Ferryman} (docks)", optional: true, rewards: [{ text: "Greater Runes ~2000g", kind: "optional" }] },
			],
		},
		{
			id: "wolvenhold",
			name: "Wolvenhold",
			level: "52-53",
			tags: ["boss-zone"],
			tasks: [
				{ id: "interludes-wolvenhold-progress", text: "Progress through {loc:Wolvenhold}" },
				{
					id: "interludes-wolvenhold-kill-oswin",
					text: "Defeat {boss:Oswin, the Dread Warden}",
					required: true,
					boss: true,
					rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				},
			],
		},
		// ── Interlude 5.2: Khari Bazaar ──────────────────────────────
		{
			id: "khari-crossing",
			name: "Khari Crossing",
			level: "54-55",
			tags: ["town"],
			tasks: [
				{ id: "interludes-khari-crossing-travel", text: "Travel to {loc:Khari Crossing} via {npc:The Hooded One}" },
			],
		},
		{
			id: "khari-bazaar",
			name: "Khari Bazaar",
			level: "54-55",
			tasks: [
				{
					id: "interludes-khari-kill-akthi-anundr",
					text: "Slay {boss:Akthi & Anundr} (Worm + Scorpion)",
					required: true,
					boss: true,
					rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				},
				{ id: "interludes-khari-talk-risu", text: "Talk to {npc:Risu} after the fight" },
				{
					id: "interludes-khari-torbek",
					text: "Visit {npc:Torbek} in {loc:Khari Crossing}",
					optional: true,
					rewards: [{ text: "Discount rare caster weapons", kind: "optional" }],
				},
				{ id: "interludes-khari-skullmaw", text: "Enter {loc:Skullmaw Stairway} via Khari Crossing" },
				{
					id: "interludes-khari-molten-gift",
					text: "Activate {item:Molten One's Gift} — find seals, reset instance if bugged",
					required: true,
					rewards: [{ text: "+5% Maximum Life", kind: "perm" }],
				},
			],
		},
		{
			id: "qimah",
			name: "Qimah",
			level: "54-55",
			notes: [{ type: "tip", text: "Orbala's Boon is swappable at any time — return to the pillar" }],
			tasks: [
				{
					id: "interludes-qimah-orbala-pillar",
					text: "Use {item:Orbala's Pillar} — select 1 of 7 Boons",
					required: true,
					rewards: [{ text: "Permanent Boon (swappable)", kind: "perm" }],
				},
				{
					id: "interludes-qimah-reservoir",
					text: "{loc:Qimah Reservoir} Sacred Wells",
					optional: true,
					rewards: [{ text: "Currency (Exalt/Alchemy via Vials)", kind: "optional" }],
				},
				{
					id: "interludes-qimah-sel-khari",
					text: "Enter {loc:Sel Khari Sanctuary}, place {item:Baryas of Rageen & Yoon} on pedestals",
					required: true,
					rewards: [{ text: "Rare Ring / Amulet / Jewel", kind: "optional" }],
				},
			],
		},
		// ── Interlude 5.3: Mount Kriar, The Glade ───────────────────
		{
			id: "mount-kriar",
			name: "Mount Kriar",
			level: "55-58",
			tasks: [
				{ id: "interludes-mount-kriar-travel", text: "Travel to {loc:Mount Kriar} via {npc:The Hooded One}" },
				{
					id: "interludes-mount-kriar-ancient-monument",
					text: "Find {item:Ancient Monument} in {loc:Ashen Forest}",
					optional: true,
					rewards: [{ text: "Skill Gem Lv14", kind: "gem" }],
				},
				{
					id: "interludes-mount-kriar-beacons",
					text: "Find & energise the second set of 6 {item:Ancient Beacons} (Fate of the Vaal)",
					required: true,
					notesAfter: [{ type: "new", label: "0.5 New Core", text: "Second beacon set continues the Act 3 sequence. Opens a portal to advance the Fate of the Vaal storyline. Full detail in the endgame guide." }],
				},
			],
		},
		{
			id: "kriar-village",
			name: "Kriar Village",
			level: "55-58",
			tasks: [
				{
					id: "interludes-kriar-village-kill-lythara",
					text: "Slay {boss:Lythara, the Wayward Spear}",
					required: true,
					boss: true,
					rewards: [{ text: "+40 Spirit", kind: "perm" }, { text: "Spirit Gem Lv14", kind: "gem" }],
				},
			],
		},
		{
			id: "howling-caves",
			name: "Howling Caves",
			level: "55-58",
			tasks: [
				{ id: "interludes-howling-caves-travel", text: "Travel to {loc:Glacial Tarn} → enter {loc:Howling Caves}" },
				{
					id: "interludes-howling-caves-kill-yeti",
					text: "Defeat {boss:The Abominable Yeti}",
					required: true,
					boss: true,
					rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				},
			],
		},
		{
			id: "kriar-peaks",
			name: "Kriar Peaks",
			level: "55-58",
			notes: [{ type: "tip", text: "Elder Maddox is at 10–11 o'clock position. Doryani's Contingency is far right." }],
			tasks: [
				{
					id: "interludes-kriar-peaks-elder-maddox",
					text: "Locate {npc:Elder Maddox} (10–11 o'clock)",
					required: true,
					rewards: [{ text: "Free Unique Item", kind: "perm" }],
				},
				{
					id: "interludes-kriar-peaks-doryani-contingency",
					text: "{loc:Doryani's Contingency} (far right)",
					optional: true,
					rewards: [{ text: "Titan Rock Catafract (unique chest)", kind: "optional" }],
				},
				{
					id: "interludes-kriar-peaks-complete",
					text: "Complete Interlude 5.3",
					required: true,
					rewards: [{ text: "+4 Skill Points total", kind: "perm" }, { text: "+5% Max Life", kind: "perm" }, { text: "+40 Spirit", kind: "perm" }, { text: "Free Unique", kind: "perm" }],
				},
			],
		},
		// ── Final reward ─────────────────────────────────────────────
		{
			id: "interludes-completion",
			name: "All Interludes Complete",
			notes: [{ type: "info", text: "Talk to The Hooded One after finishing all 3 interludes" }],
			tasks: [
				{
					id: "interludes-completion-talk-hooded-one",
					text: "Talk to {npc:The Hooded One}",
					required: true,
					rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				},
				{
					id: "interludes-completion-endgame",
					text: "Endgame Atlas / Maps unlock at Lvl 58–60",
					rewards: [{ text: "Endgame begins", kind: "perm" }],
				},
			],
		},
	],
};

export default interludes;
