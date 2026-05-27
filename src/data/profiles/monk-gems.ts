import type { ProfileGems } from "../../types/guide";

export const monkGems: ProfileGems = {
	act1: {
		requirements: { str: 20, dex: 0, int: 15 },
		skills: [
			{ slot: 1, name: "Wind Blast", level: 5, supports: [{ name: "Rage I" }, { name: "Brink I" }] },
			{ slot: 2, name: "Wing Blast", level: 5, supports: [{ name: "Impact Shockwave" }, { name: "Magnified Area I" }] },
			{ slot: 3, name: "Falling Thunder", level: 5, supports: [{ name: "Elemental Armament I" }, { name: "Perpetual Charge" }] },
			{ slot: 4, name: "Killing Palm", level: 5, supports: [] },
			{ slot: 5, name: "Pounce", level: 3, supports: [] },
			{ slot: 6, name: "Rend", level: 5, supports: [{ name: "Perpetual Charge" }] },
			{ slot: 7, name: "Frost Bomb", level: 2, supports: [] },
			{ slot: 8, name: "Entangle", level: 1, supports: [] },
			{ slot: 9, name: "Herald of Thunder", level: 4, supports: [] },
		],
		sections: [
			{ kind: "note", title: "Headline", body: "Use Quarterstaff Strike until you unlock {item:Wind Blast} for Rage / Stun Buildup!" },
			{
				kind: "order", title: "Skill Gem Order", body:
					"Your 1st Lv1 Uncut Skill Gem from {npc:Renly} after killing {boss:The Bloated Miller} → use on {item:Entangle}. Pick up your 2nd Lv1 Uncut Skill Gem from the Abandoned Stash in {loc:Clearfell} → use on {item:Killing Palm}.\n\nUse {item:Entangle} on packs to manage early clear speed — drop it once you get {item:Wing Blast}.\n\nLv2 Uncut Skill Gem from the {loc:The Red Vale} league mechanic → use on {item:Frost Bomb} (applies Elemental Exposure → lowers resistances → more {item:Falling Thunder} damage).\n\nLv3 Uncut Skill Gem from killing {boss:The Rust King} in {loc:The Red Vale} → use on {item:Wing Blast}.\n\nLv3 Uncut Skill Gem from the {loc:The Grim Tangle} league mechanic → use on {item:Pounce}.",
			},
			{
				kind: "mapping", title: "How to Play — Mapping", body:
					"Use {item:Entangle} on a pack to lock them, then clear with {item:Falling Thunder} and {item:Wing Blast}.\n\nWhen an enemy is low HP a Blue Orb appears — hit with {item:Killing Palm} to instantly kill and gain Power Charges (Normal/Magic = 1, Rare = 2, Unique = 3).\n\nUse {item:Wolf Form} from your Talisman to move around quickly — dodge roll while in Wolf Form to safely traverse zones much faster.",
			},
			{
				kind: "bossing", title: "How to Play — Bossing", body:
					"Build up Stun on the boss with Quarterstaff Strike / {item:Wind Blast} (also grants Rage stacks). Around 75% Stun bar (Primed), use {item:Wing Blast} — 15% Surpassing Chance to grant a Power Charge on Heavy Stun per Monster Power. Bosses have 20 Power → guaranteed 3 Power Charges on Heavy Stun.\n\nCarry Power Charges into boss fights like {boss:Beira of the Rotten Pack}. Cull pre-arena enemies with {item:Killing Palm}.\n\nBosses have massive Damage Reduction for the first 5 seconds of the fight — don't dump carried Power Charges during that window. Use it to build Rage, apply Shock, or apply Elemental Exposure.\n\nDrop {item:Frost Bomb} whenever it's off cooldown (Elemental Exposure → more {item:Falling Thunder} damage). Without Power Charges, use {item:Wind Blast} to build Rage / Stun.",
			},
		],
	},

	act2: {
		requirements: { str: 15, dex: 25, int: 30 },
		skills: [
			{ slot: 1, name: "Storm Wave", level: 7, supports: [{ name: "Rage I" }, { name: "Shock" }] },
			{ slot: 2, name: "Falling Thunder", level: 7, supports: [{ name: "Elemental Armament II" }, { name: "Perpetual Charge" }, { name: "Lightning Attunement" }] },
			{ slot: 3, name: "Siphoning Strike", level: 7, supports: [{ name: "Charge Profusion I" }, { name: "Rapid Attacks I" }] },
			{ slot: 4, name: "Pounce", level: 3, supports: [{ name: "Mark of Siphoning" }] },
			{ slot: 5, name: "Rend", level: 7, supports: [{ name: "Perpetual Charge" }, { name: "Prolonged Duration I" }] },
			{ slot: 6, name: "Killing Palm", level: 7, supports: [{ name: "Charge Profusion I" }, { name: "Thrill of the Kill" }] },
			// RENAMED: source screenshot shows "Tempest Bell" but per user, this is filler for Hollow Focus Technique
			{ slot: 7, name: "Tempest Bell", displayName: "Hollow Focus", level: 7, supports: [{ name: "Magnified Area I" }] },
			{ slot: 8, name: "Herald of Thunder", level: 6, supports: [{ name: "Magnified Area I" }] },
		],
		sections: [
			{
				kind: "order", title: "Skill Gem Order", body:
					"Drop Lv7 Uncut Skill Gems → use on {item:Siphoning Strike} for more Power Charge generation if needed.\n\n{item:Storm Wave} is popular in the campaign — included as a swap from {item:Wind Blast}. Great for Shocking bosses (combo with {item:Siphoning Strike} for Power Charges) and solid clear. Stick with your prior setup if preferred; included from here forward.",
			},
			{
				kind: "mapping", title: "How to Play — Mapping", body:
					"{item:Storm Wave} has great damage and synergizes with {item:Herald of Thunder}. Spam this until you want Power Charges from {item:Killing Palm} / {item:Siphoning Strike} → {item:Falling Thunder}.\n\n{item:Hollow Focus Technique} Bells spawn around you and help clear packs. Use {item:Killing Palm} on them to refill Power Charges for boss fights (on top of {item:Siphoning Strike}).\n\nUse {item:Wolf Form} from your Talisman to move quickly — dodge roll in Wolf Form to traverse zones much faster.",
			},
			{
				kind: "bossing", title: "How to Play — Bossing", body:
					"Carry Power Charges into boss fights for the {item:Rend} buff or {item:Falling Thunder}. Remember: bosses have massive Damage Reduction for the first 5 seconds — don't dump charges early.\n\nShock the boss with {item:Storm Wave} → {item:Siphoning Strike} consumes the Shock for 1 Power Charge. Combo: Shock → {item:Siphoning Strike} → {item:Falling Thunder} (95% Shock chance) → {item:Siphoning Strike} → {item:Falling Thunder} → repeat.\n\nWith charges from {item:Siphoning Strike}, use {item:Rend} (consumes 1 charge → 50% Damage gained as Lightning), then follow with {item:Falling Thunder} for massive damage. Typical two-shots on bosses in SSF speedrun gear.",
			},
			{
				kind: "priority", title: "Gem Level Up Priority", body:
					"1. {item:Falling Thunder} — main bossing & large-pack DPS.\n2. {item:Storm Wave} — more damage = more clear speed and higher Shock chance.\n3. {item:Siphoning Strike} — does surprisingly decent damage, scales with level.",
			},
		],
	},

	act3: {
		requirements: { str: 25, dex: 40, int: 35 },
		skills: [
			{ slot: 1, name: "Storm Wave", level: 9, supports: [{ name: "Rage I" }, { name: "Shock" }, { name: "Branching Fissures I" }] },
			{ slot: 2, name: "Falling Thunder", level: 9, supports: [{ name: "Elemental Armament II" }, { name: "Perpetual Charge" }, { name: "Lightning Attunement" }] },
			{ slot: 3, name: "Siphoning Strike", level: 9, supports: [{ name: "Charge Profusion I" }, { name: "Rapid Attacks I" }, { name: "Rage I" }] },
			{ slot: 4, name: "Pounce", level: 3, supports: [{ name: "Cooldown Recovery I" }, { name: "Mark of Siphoning" }] },
			{ slot: 5, name: "Killing Palm", level: 9, supports: [{ name: "Charge Profusion I" }, { name: "Thrill of the Kill" }] },
			{ slot: 6, name: "Hand of Chayula", level: 9, supports: [{ name: "Elemental Weakness" }, { name: "Heightened Curse" }] },
			// RENAMED — same as Act 2: filler for Hollow Focus
			{ slot: 7, name: "Tempest Bell", displayName: "Hollow Focus", level: 9, supports: [{ name: "Cooldown Recovery I" }, { name: "Magnified Area II" }] },
			{ slot: 8, name: "Wind Dancer", level: 10, supports: [{ name: "Magnified Area II" }, { name: "Maim" }] },
			{ slot: 9, name: "Herald of Thunder", level: 9, supports: [{ name: "Magnified Area I" }, { name: "Elemental Armament II" }] },
		],
		sections: [
			{
				kind: "mapping", title: "How to Play — Mapping", body:
					"{item:Storm Wave} has great damage and synergizes with {item:Herald of Thunder}. Spam until you want Power Charges from {item:Killing Palm} → {item:Falling Thunder}.\n\n{item:Hollow Focus Technique} Bells spawn around you and help clear packs. Use {item:Killing Palm} on them to refill Power Charges (on top of {item:Siphoning Strike}).\n\nUse {item:Wolf Form} from your Talisman — dodge roll in Wolf Form to traverse zones much faster.",
			},
			{
				kind: "bossing", title: "How to Play — Bossing", body:
					"Open with {item:Hand of Chayula} → applies {item:Elemental Weakness}. Shock with {item:Storm Wave} → {item:Siphoning Strike} consumes Shock for 1 Power Charge. Combo: Shock → {item:Siphoning Strike} → {item:Falling Thunder} (95% Shock) → {item:Siphoning Strike} → {item:Falling Thunder} → repeat. Reapply the curse when needed.",
			},
			{
				kind: "priority", title: "Gem Level Up Priority", body:
					"1. {item:Falling Thunder} — main bossing & large-pack DPS.\n2. {item:Storm Wave} — more damage = more clear speed and higher Shock chance.\n3. {item:Siphoning Strike} — surprisingly decent damage, scales with level.\n4. {item:Hand of Chayula} / {item:Elemental Weakness} — lowers target resistances significantly.",
			},
		],
	},

	act4: {
		requirements: { str: 30, dex: 60, int: 35 },
		title: "Whirling Assault Swap",
		skills: [
			{ slot: 1, name: "Whirling Assault", level: 13, supports: [{ name: "Rage II" }, { name: "Magnified Area II" }, { name: "Pursuit II" }, { name: "Heavy Swing" }] },
			// RENAMED — best-guess Hollow Focus based on support gems (Ancestral Call II + Pursuit II = mapping bell)
			{ slot: 2, name: "Tempest Bell", displayName: "Hollow Focus", level: 13, supports: [{ name: "Ancestral Call II" }, { name: "Cooldown Recovery II" }, { name: "Pursuit II" }] },
			// Real Tempest Bell — Heavy Swing = bossing
			{ slot: 3, name: "Tempest Bell", level: 13, supports: [{ name: "Cooldown Recovery II" }, { name: "Magnified Area II" }, { name: "Heavy Swing" }] },
			{ slot: 4, name: "Killing Palm", level: 13, supports: [{ name: "Charge Profusion I" }, { name: "Thrill of the Kill II" }, { name: "Blazing Critical" }] },
			{ slot: 5, name: "Charged Staff", level: 13, supports: [{ name: "Prolonged Duration II" }, { name: "Culling Strike I" }, { name: "Innervate" }] },
			{ slot: 6, name: "Staggering Palm", level: 13, supports: [{ name: "Retreat II" }, { name: "Multishot II" }, { name: "Longshot II" }] },
			{ slot: 7, name: "Hand of Chayula", level: 13, supports: [{ name: "Elemental Weakness" }, { name: "Heightened Curse" }] },
			{ slot: 8, name: "Herald of Thunder", level: 13, supports: [{ name: "Magnified Area II" }, { name: "Elemental Armament II" }] },
			{ slot: 9, name: "Wind Dancer", level: 13, supports: [{ name: "Magnified Area II" }, { name: "Maim" }, { name: "Blind I" }] },
		],
		sections: [
			{
				kind: "mapping", title: "How to Play — Mapping", body:
					"The new {item:Hollow Focus} Bells are Cullable and Primed for Heavy Stun → 24/7 uptime on {item:Charged Staff} and {item:Staggering Palm} projectiles → big clear & DPS boost. Use {item:Killing Palm} on the {item:Hollow Focus Technique} Bells for Power Charges. All hits against these Ghost Bells are guaranteed Crits → free {item:Blazing Critical} activations.\n\n{item:Whirling Assault} has massive AoE and solid damage — combine with {item:Tempest Bell} on Rares and bosses to melt them.",
			},
			{
				kind: "bossing", title: "How to Play — Bossing", body:
					"Build Power Charges from {item:Hollow Focus Technique} Bells with {item:Killing Palm} to fuel {item:Charged Staff}. Proc {item:Staggering Palm} off Ghost Bells for Extra Projectile. Do this leading up to the boss.\n\nOpen the fight with {item:Hand of Chayula} → {item:Elemental Weakness}. Start spinning with {item:Whirling Assault}, drop {item:Tempest Bell} once at 4 combo. Spam Bells + {item:Whirling Assault} to melt. Reapply the curse when needed.",
			},
			{
				kind: "priority", title: "Gem Level Up Priority", body:
					"1. {item:Whirling Assault}\n2. {item:Tempest Bell}\n3. {item:Staggering Palm}\n4. {item:Hand of Chayula} / {item:Elemental Weakness} — lowers target resistances significantly.\n5. {item:Charged Staff}",
			},
		],
	},
};
