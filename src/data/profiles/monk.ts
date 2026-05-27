import type { ProfileContent } from "../../types/guide";

/**
 * Monk profile — v2 standalone ruleset.
 * Each entry REPLACES base content for that zone entirely.
 * Zones not listed here fall back to standard (acts/*.ts) content at render time.
 *
 * Per-zone curation documented in v2 plan §2.
 * Source guide: user-supplied paragraph guide (Appendix A of plan).
 */
export const monkContent: ProfileContent = {

	// ── Act 1, L1-5 ─────────────────────────────────────────────────────────

	// clearfell — Replace
	"clearfell": {
		notes: [
			{ type: "info", text: "League drop: {item:Orb of Transmutation} — use on weapon or Ring/Amulet." },
		],
		tasks: [
			{ id: "monk-clearfell-campsite-gem", text: "Open {item:Abandoned Stash} at the {loc:Mysterious Campsite} for the Lv1 Uncut Skill Gem" },
			{ id: "monk-clearfell-beira-buff", text: "Find {boss:Beira of the Rotten Pack} for the permanent +10% Cold Resistance", rewards: [{ text: "+10% Cold Res", kind: "perm" }] },
			{ id: "monk-clearfell-mud-burrow-optional", text: "Skip {loc:Mud Burrow} unless you need the Tier 1 Uncut Support Gem", optional: true },
			{ id: "act1-clearfell-enter-grelwood", text: "Enter {loc:The Grelwood}" },
		],
	},

	// the-grelwood — Replace + port find-una
	"the-grelwood": {
		notes: [
			{ type: "info", text: "League drop: {item:Orb of Transmutation} — use on weapon or Ring/Amulet." },
		],
		tasks: [
			{ id: "act1-the-grelwood-find-una", text: "Find/talk {npc:Una}, take Waypoint" },
			{ id: "monk-grelwood-waypoints", text: "Collect Waypoints for {loc:The Red Vale}, {loc:Grim Tangle}, and the Giant Tree to progress the Campaign Quest" },
			{
				id: "monk-grelwood-areagne",
				text: "Find the Witch Hut — kill {boss:Areagne, the Forgotten Witch} for Tier 1 Uncut Support Gem + flasks",
				optional: true,
				rewards: [{ text: "Support Gem T1", kind: "gem" }, { text: "Medium Flask", kind: "default" }],
				notesAfter: [{ type: "tip", text: "Areagne is the hardest early fight — frost bomb chills her, makes it manageable" }],
			},
			{ id: "monk-grelwood-brambleghast-optional", text: "Skip {loc:Brambleghast} unless you need the Lv2 Uncut Skill Gem", optional: true },
		],
	},

	// the-red-vale — Replace + port rust-king tip + return-town
	"the-red-vale": {
		notes: [
			{ type: "info", text: "Great EXP zone — aim for L4–5 before leaving. Reset if no {item:Long Quarterstaff} upgrade drops." },
		],
		tasks: [
			{ id: "monk-red-vale-refined-arms", text: "Click every {item:Refined Arms} — looking for {item:Long Quarterstaff} or other tier upgrade" },
			{ id: "monk-red-vale-weapon-craft", text: "Spend {item:Transmute} and {item:Augmentation Orb} on best weapon found here" },
			{
				id: "monk-red-vale-obelisks",
				text: "Find all 3 {loc:Obelisks of Rust} to fight {boss:The Rust King}",
				rewards: [{ text: "Runed Skull Cap", kind: "default" }],
				notesAfter: [{ type: "tip", text: "Kite mobs under his feet for AoE damage uptime" }],
			},
			{ id: "monk-red-vale-league-frost-bomb", text: "Use the league Lv2 Uncut Skill Gem for {item:Frost Bomb}", rewards: [{ text: "Skill Gem Lv2", kind: "gem" }] },
			{ id: "act1-the-red-vale-return-town", text: "TP back to town" },
		],
	},

	// grim-tangle — Replace + port enter-cemetery nav
	"grim-tangle": {
		notes: [
			{ type: "info", text: "Move quickly — next zone is great for EXP. League drop: Lv3 Uncut Skill Gem → use for {item:Wing Blast}." },
		],
		tasks: [
			{ id: "monk-grim-tangle-rush-exit", text: "Move to exit ASAP — kill only what is necessary" },
			{ id: "monk-grim-tangle-rotten-druid", text: "Fight {boss:Ervig, the Rotten Druid} for extra Tier 1 Support Gem if you come across him", optional: true, rewards: [{ text: "Support Gem T1", kind: "gem" }] },
			{ id: "monk-grim-tangle-wing-blast", text: "Use league Lv3 Uncut Skill Gem for {item:Wing Blast}", rewards: [{ text: "Skill Gem Lv3", kind: "gem" }] },
			{ id: "act1-grim-tangle-enter-cemetery", text: "Enter {loc:Cemetery of the Eternals}" },
		],
	},

	// ── Act 1, L6-10 ────────────────────────────────────────────────────────

	// cemetery-of-the-eternals — Replace + port heavily
	"cemetery-of-the-eternals": {
		notes: [
			{ type: "tip", text: "Routing: Do Draven first (Asinia scales to zone level → better drops). Or: Tomb of the Consort first — lower area level (easier off-league start)." },
			{ type: "info", text: "Good EXP zone. League drop: {item:Regal Orb} — use on a {item:Gothic Quarterstaff}." },
		],
		tasks: [
			{ id: "act1-cemetery-talk-lachlann", text: "Talk to {npc:Lachlann the Lost}" },
			{ id: "act1-cemetery-sarcophagus", text: "Sarcophagus near checkpoint — hope for an {item:Iron Ring}", optional: true, rewards: [{ text: "Ring", kind: "optional" }] },
			{
				id: "act1-cemetery-kill-draven",
				text: "{loc:Mausoleum of the Praetor} → {boss:Draven} → Key Piece, TP back",
				required: true,
				boss: true,
				rewards: [{ text: "Key Piece", kind: "default" }],
				notesAfter: [{ type: "tip", text: "Doing Draven first keeps Asinia at higher level → better drops" }],
			},
			{ id: "monk-cemetery-league-regal", text: "Complete the League Mechanic for {item:Regal Orb} — slam it on a {item:Gothic Quarterstaff}", rewards: [{ text: "Regal Orb", kind: "craft" }] },
			{
				id: "act1-cemetery-kill-asinia",
				text: "{loc:Tomb of the Consort} → {boss:Asinia} → Key Piece, TP back",
				required: true,
				boss: true,
				rewards: [{ text: "Key Piece", kind: "default" }],
			},
			{
				id: "act1-cemetery-kill-lachlann",
				text: "Open {item:Memorial Gate} → kill {boss:Lachlann}, loot Ring",
				required: true,
				boss: true,
				rewards: [{ text: "Ring", kind: "optional" }],
			},
			{
				id: "act1-cemetery-enter-hunting-grounds",
				text: "Exit to {loc:Hunting Grounds} — take {item:Waypoint}",
				notesAfter: [{ type: "tip", label: "Revival", text: "{npc:The Hooded One} revives upon return — Identify is now available" }],
			},
			{ id: "act1-cemetery-return-town", text: "TP to town — talk to {npc:Finn}, {npc:Una}, {npc:The Hooded One}" },
		],
	},

	// hunting-grounds — Replace + port 0.5 patch + boss warning
	"hunting-grounds": {
		notes: [
			{ type: "patch", text: "0.5 Pathing: trail of locusts leads to Freythorn entrance. Crowbells leave blood trails that lead to boss. Signpost on road indicates way to Ogham Village." },
			{ type: "info", text: "League drop: {item:Exalted Orb} — definitely complete this." },
		],
		tasks: [
			{ id: "act1-hunting-grounds-talk-delwyn", text: "Talk to {npc:Delwyn}" },
			{ id: "monk-hunting-grounds-dryadic-ritual", text: "Find the {loc:Dryadic Ritual} for Tier 1 Support Gem", rewards: [{ text: "Support Gem T1", kind: "gem" }] },
			{
				id: "act1-hunting-grounds-kill-crowbell",
				text: "Kill {boss:The Crowbell}",
				required: true,
				boss: true,
				rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				notesAfter: [{ type: "warning", text: "Watch slam attacks — can one-shot. Boss flees at low HP, kite carefully" }],
			},
			{ id: "monk-hunting-grounds-ritual-altar", text: "Complete the optional {loc:Ritual Altar} in the middle for Lv4 Uncut Skill Gem", optional: true, rewards: [{ text: "Skill Gem Lv4", kind: "gem" }] },
			{ id: "monk-hunting-grounds-league-exalt", text: "Complete League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
		],
	},

	// freythorn — Replace + port smoke-tendrils tip + phase-2 warning
	"freythorn": {
		notes: [
			{ type: "tip", text: "Big altar's smoke tendrils point to the small altars — follow them" },
			{ type: "info", text: "League drop: Tier 1 Support Gem." },
		],
		tasks: [
			{ id: "monk-freythorn-ritual-circles", text: "Find and complete all 3 normal {loc:Ritual Circles} before activating the giant Altar" },
			{
				id: "monk-freythorn-king-in-mist",
				text: "Kill {boss:The King in the Mist} for Lv4 Uncut Spirit Gem + permanent +30 Spirit",
				rewards: [{ text: "+30 Spirit", kind: "perm" }, { text: "Spirit Gem Lv4", kind: "gem" }],
				notesAfter: [{ type: "warning", text: "Phase 2: dodge totem summons + curses (stand still vs keep moving differ)" }],
			},
			{ id: "monk-freythorn-herald-thunder", text: "Use the +30 Spirit for {item:Herald of Thunder}", rewards: [{ text: "Herald of Thunder", kind: "default" }] },
		],
	},

	// ogham-farmlands — Replace + port deliver-lute tip
	"ogham-farmlands": {
		notes: [
			{ type: "info", text: "League drop: Lv4 Uncut Skill Gem." },
		],
		tasks: [
			{
				id: "act1-ogham-farmlands-unas-lute",
				text: "{item:Una's Lute Box} in house near checkpoint → {item:Una's Lute}",
				required: true,
				rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				notesAfter: [{ type: "tip", text: "Deliver to {npc:Una} in town for the reward" }],
			},
			{ id: "act1-ogham-farmlands-rare-dogs", text: "Rare dogs in crop circle", optional: true, rewards: [{ text: "Skill Gem Lv4", kind: "gem" }] },
			{ id: "monk-farmlands-league-gem", text: "Complete League Mechanic for Lv4 Uncut Skill Gem", rewards: [{ text: "Skill Gem Lv4", kind: "gem" }] },
			{ id: "act1-ogham-farmlands-enter-village", text: "Enter {loc:Ogham Village}" },
		],
	},

	// ── Act 1, L11-13 ───────────────────────────────────────────────────────

	// ogham-village — Replace + port salvage bench + base tasks
	"ogham-village": {
		notes: [
			{ type: "info", text: "Monk target: be L11 before leaving. League drop: {item:Artificer's Orb} — complete it. Equip Gothic Quarterstaff at L11 and slam with all Exalts, Runes, and Whetstones." },
		],
		tasks: [
			{
				id: "act1-ogham-village-salvage-bench",
				text: "{item:Smithing Tools} in house (1st character only)",
				note: "First character only",
				rewards: [{ text: "Salvage Bench", kind: "craft" }],
			},
			{
				id: "act1-ogham-village-blacksmiths-chest",
				text: "{item:Blacksmith's Chest} same house",
				optional: true,
				rewards: [{ text: "Blank Rune", kind: "craft" }, { text: "Artificer's Orb", kind: "craft" }],
			},
			{ id: "act1-ogham-village-kill-executioner", text: "Kill {boss:The Executioner}", required: true, boss: true },
			{ id: "act1-ogham-village-lever-leitis", text: "Upstairs → lever → talk to {npc:Leitis}" },
			{ id: "monk-village-equip-quarterstaff", text: "Equip {item:Gothic Quarterstaff} at L11 — slam with all Exalts, Runes, and {item:Blacksmith's Whetstones}" },
			{ id: "monk-village-league-artificer", text: "Complete League Mechanic for {item:Artificer's Orb}", rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
		],
	},

	// manor-ramparts — Replace + port flask/chest gear-check tip
	"manor-ramparts": {
		notes: [
			{ type: "info", text: "Good EXP zone — take a good bit here. League drop: Lv5 Uncut Skill Gem." },
		],
		tasks: [
			{
				id: "act1-manor-ramparts-hanging-man",
				text: "{item:Rope} on hanging man near checkpoint",
				optional: true,
				rewards: [{ text: "Support Gem", kind: "gem" }],
				notesAfter: [{ type: "tip", text: "Confirm Lvl 10 flask + Lvl 11 chest piece before entering Manor — much safer" }],
			},
			{ id: "monk-ramparts-take-exp", text: "Take a good bit of EXP here — great zone for it" },
			{ id: "monk-ramparts-league-gem", text: "Complete League Mechanic for Lv5 Uncut Skill Gem", rewards: [{ text: "Skill Gem Lv5", kind: "gem" }] },
			{ id: "act1-manor-ramparts-enter-manor", text: "Enter {loc:Ogham Manor}" },
		],
	},

	// ogham-manor — Replace + port boss tips + post-fight nav
	"ogham-manor": {
		notes: [
			{ type: "info", text: "League drop: {item:Orb of Alchemy}." },
		],
		tasks: [
			{
				id: "act1-ogham-manor-kill-candlemass",
				text: "Kill {boss:Candlemass} (1st floor)",
				required: true,
				boss: true,
				rewards: [{ text: "+20 Max Life", kind: "perm" }],
				notesAfter: [{ type: "tip", text: "Usually after first walkway, sometimes earlier — drops Essence + double-res belt" }],
			},
			{
				id: "act1-ogham-manor-kill-geonor",
				text: "Downstairs → kill {boss:Geonor} (Act Boss)",
				required: true,
				boss: true,
				notesAfter: [{ type: "warning", text: "Phase 2: dodge roll under his sword. Frost bomb at start of Phase 2 chills him" }],
			},
			{ id: "act1-ogham-manor-return-town", text: "TP back to town, talk to all NPCs" },
			{
				id: "act1-ogham-manor-follow-beast",
				text: "Talk to {npc:The Hooded One} → \"Follow the Beast's Trail\"",
				required: true,
				notesAfter: [{ type: "success", text: "Act I Complete — proceed to Act II" }],
			},
		],
	},

	// ── Act 2, L14-20 ───────────────────────────────────────────────────────

	// vastiri-outskirts — Replace + port hooded-one talk + tp-start
	"vastiri-outskirts": {
		notes: [
			{ type: "info", text: "League drop: {item:Exalted Orb} — complete it. NPC camp with 2 NPCs fending off Hyenas gives solid Gold." },
		],
		tasks: [
			{ id: "act2-vastiri-outskirts-talk-hooded-one", text: "Talk to {npc:The Hooded One}", required: true },
			{ id: "monk-vastiri-npc-camp", text: "Find the camp with 2 NPCs fighting Hyenas — loot the corpse for Gold", optional: true },
			{ id: "monk-vastiri-league-exalt", text: "Complete League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
			{ id: "act2-vastiri-outskirts-kill-rathbreaker", text: "Kill {boss:Rathbreaker}", required: true, boss: true },
			{ id: "act2-vastiri-outskirts-tp-start", text: "TP back to start of zone" },
			{ id: "monk-vastiri-zarka-gem", text: "Talk to {npc:Zarka} after killing Rathbreaker for Lv6 Uncut Skill Gem", rewards: [{ text: "Skill Gem Lv6", kind: "gem" }] },
			{ id: "act2-vastiri-outskirts-enter-ardura", text: "Enter {loc:The Ardura Caravan}" },
		],
	},

	// ardura-caravan — Inherit (no monk entry)

	// mawdun-quarry — Replace + port war-cache
	"mawdun-quarry": {
		notes: [
			{ type: "info", text: "Monsters here have higher chance at {item:Armorer's Scrap} and {item:Blacksmith's Whetstones} — stock up. League drop: Lv5 Uncut Spirit Gem (don't hunt it down)." },
		],
		tasks: [
			{ id: "act2-mawdun-quarry-war-cache", text: "{item:Faridun War Cache} near checkpoint", optional: true, rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
			{ id: "monk-quarry-stock-scraps", text: "Kill large packs — stock up on {item:Armorer's Scrap} and {item:Blacksmith's Whetstones}" },
			{ id: "monk-quarry-league-spirit-gem", text: "Take the Lv5 Uncut Spirit Gem from League Mechanic if you come across it", optional: true, rewards: [{ text: "Spirit Gem Lv5", kind: "gem" }] },
			{ id: "act2-mawdun-quarry-enter-mine", text: "Enter {loc:Mawdun Mine} (follow checkpoints)" },
		],
	},

	// mawdun-mine — Replace + port talk-risu + tp-town
	"mawdun-mine": {
		notes: [
			{ type: "info", text: "League drop: Tier 2 Support Gem — pick up for {item:Brink I} on {item:Wind Blast}." },
		],
		tasks: [
			{ id: "act2-mawdun-mine-kill-rudja", text: "Kill {boss:Rudja}", required: true, boss: true },
			{ id: "act2-mawdun-mine-talk-risu", text: "Talk to {npc:Risu} in cage", note: "Freeing Risu enables route shortcut" },
			{ id: "monk-mine-skip-packs", text: "Skip most packs unless low on XP or there's a pack of Magic Monsters" },
			{ id: "monk-mine-league-t2-support", text: "Complete League Mechanic for Tier 2 Support Gem — use for {item:Brink I} on {item:Wind Blast}", rewards: [{ text: "Support Gem T2", kind: "gem" }] },
			{ id: "act2-mawdun-mine-tp-town", text: "TP back to town" },
		],
	},

	// traitors-passage — Replace + port 0.5 patch note + balbala-skip
	"traitors-passage": {
		notes: [
			{ type: "patch", text: "0.5 Pathing: Interact with the {item:Ancient Seal} door to open a shortcut — follow torches through to {loc:Halani Gates} faster." },
			{ type: "info", text: "EXP is hard to maintain early Act 2 — take what you can. League drop: {item:Artificer's Orb}." },
		],
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
			{ id: "monk-traitors-bell-chest", text: "Find the Gold Bell Chest for Lv6 Uncut Skill Gem if needed", optional: true, rewards: [{ text: "Skill Gem Lv6", kind: "gem" }] },
			{ id: "monk-traitors-league-artificer", text: "Take {item:Artificer's Orb} from League Mechanic if found", optional: true, rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
			{ id: "act2-traitors-passage-enter-halani", text: "Enter {loc:The Halani Gates}" },
		],
	},

	// the-halani-gates — Replace + port summon-asala + kill-jamanra + checkpoint
	"the-halani-gates": {
		notes: [
			{ type: "info", text: "League drop: {item:Exalted Orb}. Ascendancy option: complete Trial of Sekhemas right after this zone for early 'I am the Thunder…' buff. Most players wait until after Spires of Deshar." },
		],
		tasks: [
			{
				id: "act2-halani-gates-summon-asala",
				text: "Summon {npc:Asala} to open gates",
				required: true,
				notesAfter: [{ type: "tip", text: "{npc:Asala} can lag behind — wait near the gate if she doesn't trigger it." }],
			},
			{ id: "act2-halani-gates-kill-jamanra", text: "Kill {boss:Jamanra} (first encounter)", required: true, boss: true },
			{ id: "act2-halani-gates-checkpoint", text: "Stairs up, search checkpoint area" },
			{ id: "monk-halani-league-exalt", text: "Complete League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
			{ id: "monk-halani-ascendancy-optional", text: "Optionally attempt Ascendancy Trial of Sekhemas after this zone for early 'I am the Thunder…' buff", optional: true, rewards: [{ text: "Minor DMG buff (early)", kind: "optional" }] },
		],
	},

	// mastodon-badlands — Replace + port 0.5 pathing + run-before-keth warning + bone-pits note
	"mastodon-badlands": {
		notes: [
			{ type: "warning", text: "Run BEFORE Keth for proper level scaling" },
			{ type: "patch", text: "0.5 Pathing: Follow ground cracks on the floor — they lead to {loc:Lightless Caverns} and the entrance to {loc:The Bone Pits}." },
			{ type: "info", text: "Complete Abyss encounters in any Act 2 zone for bonus EXP. League drop: {item:Regal Orb}." },
		],
		tasks: [
			{ id: "act2-mastodon-badlands-effigy", text: "Effigy near checkpoint", optional: true, rewards: [{ text: "Support Gem Lv2", kind: "gem" }] },
			{ id: "monk-badlands-shrine-of-bones", text: "Find the Shrine of Bones for Tier 2 Support Gem if needed", optional: true, rewards: [{ text: "Support Gem T2", kind: "gem" }] },
			{ id: "monk-badlands-abyss-exp", text: "Complete any Abyss encounters found for bonus EXP" },
			{
				id: "act2-mastodon-badlands-enter-bone-pits",
				text: "Enter {loc:The Bone Pits}",
				notesAfter: [{ type: "tip", text: "Complete Mastodon before {loc:Keth} — {boss:Kabala} only drops the Lv7 gem if Mastodon is cleared first." }],
			},
			{ id: "monk-badlands-league-regal", text: "Complete League Mechanic for {item:Regal Orb} if found", optional: true, rewards: [{ text: "Regal Orb", kind: "craft" }] },
		],
	},

	// ── Act 2, L21-24 ───────────────────────────────────────────────────────

	// the-bone-pits — Replace + port goliath-relic tip
	"the-bone-pits": {
		notes: [
			{ type: "info", text: "Kill Hyena packs for {item:Sun Clan Relic} (needed for permanent buff in Valley of Titans). League drop: {item:Exalted Orb} — hunt it down." },
		],
		tasks: [
			{
				id: "act2-bone-pits-sun-clan-relic",
				text: "Kill hyenas until {item:Sun Clan Relic} drops",
				required: true,
				rewards: [{ text: "Sun Clan Relic", kind: "default" }],
				notesAfter: [{ type: "tip", text: "Tall Goliath hyenas have a higher drop chance for the {item:Sun Clan Relic}." }],
			},
			{ id: "monk-bone-pits-abyss", text: "Complete the Abyss if found for bonus EXP", optional: true },
			{ id: "act2-bone-pits-kill-iktab-ekbab", text: "Kill {boss:Iktab & Ekbab}", required: true, boss: true, rewards: [{ text: "Mastodon Tusks", kind: "default" }] },
			{ id: "monk-bone-pits-league-exalt", text: "Hunt down League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
		],
	},

	// keth — Replace + port kabala-relic + kill-kabala with rewards + enter-lost-city
	"keth": {
		notes: [
			{ type: "info", text: "League drop: {item:Gemcutter's Prism} — hunt it down. Kill snake monsters for {item:Kabala Clan Relic}." },
		],
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
			{ id: "monk-keth-abandoned-shrine", text: "Find the {loc:Abandoned Shrine} with Golden Chest for a Magic Amulet if you don't have one yet", optional: true, rewards: [{ text: "Magic Amulet", kind: "optional" }] },
			{ id: "monk-keth-league-gcp", text: "Hunt down League Mechanic for {item:Gemcutter's Prism}", rewards: [{ text: "Gemcutter's Prism", kind: "craft" }] },
			{ id: "act2-keth-enter-lost-city", text: "Enter {loc:The Lost City}" },
		],
	},

	// the-lost-city — Replace + port ninth-treasure + golden-tomb + nav
	"the-lost-city": {
		notes: [
			{ type: "info", text: "Take good EXP here. League drop: {item:Orb of Alchemy}." },
		],
		tasks: [
			{ id: "act2-lost-city-ninth-treasure", text: "Kill {boss:Ninth Treasure of Keth}", optional: true, boss: true },
			{ id: "act2-lost-city-golden-tomb", text: "{loc:Golden Tomb}", optional: true, rewards: [{ text: "Spirit Gem Lv7", kind: "gem" }] },
			{ id: "monk-lost-city-league-alchemy", text: "Take {item:Orb of Alchemy} from League Mechanic if found", optional: true, rewards: [{ text: "Orb of Alchemy", kind: "craft" }] },
			{ id: "act2-lost-city-enter-buried-shrines", text: "Enter {loc:Buried Shrines}" },
		],
	},

	// buried-shrines — Replace (monk content is more detailed) + add nav-out
	"buried-shrines": {
		notes: [
			{ type: "info", text: "#1 Priority: League Mechanic gives {item:Lesser Jeweler's Orb} — use on {item:Falling Thunder}." },
		],
		tasks: [
			{ id: "monk-buried-shrines-league-jeweler", text: "PRIORITY: Complete League Mechanic for {item:Lesser Jeweler's Orb} — use on {item:Falling Thunder}", rewards: [{ text: "Lesser Jeweler's Orb", kind: "craft" }] },
			{ id: "monk-buried-shrines-topaz-ring", text: "Take the {item:Topaz Ring} from the Elemental Offering for Lightning Resistance (useful for Jamanra fight)", optional: true, rewards: [{ text: "Topaz Ring", kind: "optional" }] },
			{ id: "act2-buried-shrines-sarcophagus", text: "Guarded sarcophagus", optional: true, rewards: [{ text: "Support Gem", kind: "gem" }, { text: "Lesser Jeweller's Orb", kind: "craft" }] },
			{ id: "act2-buried-shrines-enter-heart", text: "Enter {loc:The Heart of Keth}" },
		],
	},

	// heart-of-keth — Inherit (no monk entry)

	// valley-of-the-titans — Replace + port both base tasks
	"valley-of-the-titans": {
		notes: [
			{ type: "info", text: "League drop: Unique — hunt it down. Hug outer walls to find the 3 Ancient Seals." },
		],
		tasks: [
			{ id: "act2-valley-ancient-seals", text: "Find 3 {item:Ancient Seals} (perimeter)", required: true },
			{
				id: "act2-valley-place-relics",
				text: "Find {item:Medallion} near WP, place both relics",
				required: true,
				rewards: [{ text: "+30% Charm Charges", kind: "perm" }, { text: "+15% Mana Recovery (alt)", kind: "optional" }],
				notesAfter: [{ type: "tip", text: "Check all side paths — league mechanic at Valley of the Titans gives strong currency rewards." }],
			},
			{ id: "monk-valley-abyss", text: "Complete the Abyss near the Relic Shrine for EXP", optional: true },
			{ id: "monk-valley-league-unique", text: "Hunt down League Mechanic for Unique item", rewards: [{ text: "Unique", kind: "default" }] },
			{ id: "act2-valley-enter-grotto", text: "Enter {loc:The Titan Grotto}" },
		],
	},

	// the-titan-grotto — Replace + port kill-zalmarath
	"the-titan-grotto": {
		notes: [
			{ type: "info", text: "Get {item:Siphoning Strike} before this fight — Boss has high Stun Threshold. League drop: {item:Chance Shard} (skip unless needed)." },
		],
		tasks: [
			{ id: "monk-titan-grotto-siphoning-strike", text: "Equip {item:Siphoning Strike} before the Boss — essential for Power Charge generation against {boss:Zalmarath, the Colossus}' Stun Threshold" },
			{ id: "monk-titan-grotto-titans-sword", text: "Find the {item:Titan's Sword} for a random Rune when interacted with", optional: true, rewards: [{ text: "Random Rune", kind: "craft" }] },
			{ id: "act2-titan-grotto-kill-zalmarath", text: "Kill {boss:Zalmarath, the Colossus}", required: true, boss: true, rewards: [{ text: "Flame Ruby", kind: "default" }] },
			{ id: "monk-titan-grotto-league-skip", text: "Skip League Mechanic ({item:Chance Shard}) unless you need the EXP", optional: true },
		],
	},

	// ── Act 2, L25-29 ───────────────────────────────────────────────────────

	// deshar — Replace + port heavily
	// [verify in 0.5]: base uses "Fallen Dekhara" for the 2-passive-point quest; monk guide says "Final Letter".
	// Base wording is preferred (curated for 0.5). Both are included as base task + monk note.
	"deshar": {
		notes: [
			{ type: "info", text: "League drop: Lesser Rune (skip unless needing EXP)." },
		],
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
			{ id: "monk-deshar-watchful-twins", text: "Find {boss:The Watchful Twins} for a {item:Djinn Barya} to run Ascendancy Trial (alt route)", optional: true, rewards: [{ text: "Djinn Barya", kind: "craft" }] },
			{ id: "act2-deshar-enter-path", text: "Enter {loc:Path of Mourning}" },
		],
	},

	// path-of-mourning — Replace + port enter-spires nav
	"path-of-mourning": {
		notes: [
			{ type: "info", text: "Move to exit quickly — poor EXP. No League Mechanic reward in this zone." },
		],
		tasks: [
			{ id: "monk-path-mourning-rush", text: "Rush to exit — there is very little to do and EXP is poor" },
			{ id: "act2-path-of-mourning-shifting-vases", text: "Shifting Vases encounter", optional: true, rewards: [{ text: "4 Rares", kind: "optional" }, { text: "Support Gem Lv2", kind: "gem" }] },
			{ id: "act2-path-of-mourning-enter-spires", text: "Enter {loc:The Spires of Deshar}" },
		],
	},

	// spires-of-deshar — Replace + port lightning-res warning + kill-tor-gul
	"spires-of-deshar": {
		notes: [
			{ type: "warning", text: "Cap lightning resistance before Tor Gul — one of the hardest fights in Act II" },
			{ type: "info", text: "League drop: {item:Gemcutter's Prism} — find it. Good EXP zone." },
		],
		tasks: [
			{ id: "act2-spires-sisters-shrine", text: "Interact with {item:Sisters of Garukhan} shrine", required: true, rewards: [{ text: "+10% Lightning Res", kind: "perm" }] },
			{ id: "monk-spires-exp", text: "Take a good bit of EXP before fighting {boss:Tor Gul, the Defiler}" },
			{ id: "monk-spires-league-gcp", text: "Find League Mechanic for {item:Gemcutter's Prism}", rewards: [{ text: "Gemcutter's Prism", kind: "craft" }] },
			{ id: "act2-spires-kill-tor-gul", text: "Kill {boss:Tor Gul}", required: true, boss: true },
		],
	},

	// trial-of-sekhemas — Inherit (no monk entry)

	// the-dreadnought — Replace + port 0.5 change + boss tips + post-fight sequence
	"the-dreadnought": {
		notes: [
			{ type: "tip", text: "~55k phys damage stuns before lightning fence phase" },
			{ type: "patch", text: "0.5 Change: The second Dreadnought area has been removed — fight proceeds directly to {boss:Jamanra} after boarding." },
			{ type: "info", text: "Great zone to catch up on EXP. No League Mechanic reward." },
		],
		tasks: [
			{ id: "monk-dreadnought-exp-catchup", text: "Take large amounts of EXP throughout — great catch-up zone, few Checkpoints" },
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

	// ── Act 3, L30-34 ───────────────────────────────────────────────────────

	// sandswept-marsh — Replace + port 0.5 note + hooded-one + ring-poi
	"sandswept-marsh": {
		notes: [
			{ type: "patch", text: "0.5 rearranged Act 3's area order — zone transitions below reflect the updated 0.5 layout" },
			{ type: "info", text: "League drop: Tier 3 Support Gem → use for {item:Branching Fissures I}." },
		],
		tasks: [
			{ id: "act3-sandswept-marsh-talk-hooded-one", text: "Talk to {npc:The Hooded One}", required: true },
			{ id: "monk-sandswept-rootdredge", text: "Kill {boss:Rootdredge} if found for Lv9 Uncut Skill Gem", optional: true, rewards: [{ text: "Skill Gem Lv9", kind: "gem" }] },
			{ id: "act3-sandswept-marsh-basket", text: "{item:Basket} at Orok Campsite", optional: true, rewards: [{ text: "Lesser Jeweller's Orb", kind: "craft" }] },
			{ id: "act3-sandswept-marsh-hanging-corpse", text: "Hanging tree corpse", optional: true, rewards: [{ text: "Magic Ring", kind: "optional" }] },
			{ id: "act3-sandswept-marsh-ring-poi", text: "Lvl 33 Ring point of interest", optional: true, rewards: [{ text: "High-tier flat damage roll", kind: "optional" }] },
			{ id: "monk-sandswept-league-t3-support", text: "Complete League Mechanic for Tier 3 Support Gem → use for {item:Branching Fissures I}", rewards: [{ text: "Support Gem T3", kind: "gem" }] },
			{ id: "act3-sandswept-marsh-enter-ziggurat", text: "Enter {loc:Ziggurat Encampment}", required: true },
		],
	},

	// ziggurat-encampment — Inherit (no monk entry)

	// jungle-ruins — Replace + port 0.5 + silverfist tip + field-vendor + find-wp
	"jungle-ruins": {
		notes: [
			{ type: "patch", text: "0.5 Pathing: explorer camps now point you toward the next area, and the destination is revealed on your minimap" },
			{ type: "info", text: "League drop: {item:Orb of Alchemy}. Multiple optional objectives — do them efficiently before heading to Venom Crypts." },
		],
		tasks: [
			{
				id: "act3-jungle-ruins-kill-silverfist",
				text: "Kill {boss:Mighty Silverfist}",
				required: true,
				boss: true,
				rewards: [{ text: "+2 Skill Points", kind: "perm" }],
				notesAfter: [{ type: "warning", text: "Dodge slam SIDEWAYS (not backwards) — wave travels in attack direction" }],
			},
			{ id: "act3-jungle-ruins-jungle-grave", text: "Jungle Grave → {npc:Servi} gives Rare Belt", required: true, rewards: [{ text: "Rare Belt (choice)", kind: "optional" }] },
			{ id: "monk-jungle-ruins-troubled-camp", text: "Check the Troubled Camp vendor for items — one chest gives a Rare Item", optional: true, rewards: [{ text: "Rare Item", kind: "default" }] },
			{ id: "act3-jungle-ruins-field-vendor", text: "Field vendor", optional: true, rewards: [{ text: "Guaranteed Rare Gloves", kind: "default" }] },
			{ id: "act3-jungle-ruins-find-wp", text: "Find Waypoint near {loc:Venom Crypts}" },
			{ id: "monk-jungle-ruins-league-alchemy", text: "Complete League Mechanic for {item:Orb of Alchemy} if found", optional: true, rewards: [{ text: "Orb of Alchemy", kind: "craft" }] },
			{ id: "act3-jungle-ruins-enter-barrens", text: "Enter {loc:Infested Barrens}", required: true },
		],
	},

	// infested-barrens — Replace + port heavy
	"infested-barrens": {
		notes: [
			{ type: "info", text: "League drop: {item:Exalted Orb} — complete it. Looking for entrance to The Azak Bog." },
		],
		tasks: [
			{ id: "act3-infested-barrens-find-alva", text: "Find/talk {npc:Alva}, take WP near her" },
			{ id: "act3-infested-barrens-field-vendor", text: "Field vendor", optional: true, rewards: [{ text: "Guaranteed Rare Boots", kind: "default" }] },
			{ id: "act3-infested-barrens-chimeral-wp", text: "Enter {loc:Chimeral Wetlands} → take WP → return" },
			{ id: "act3-infested-barrens-azak-wp", text: "Enter {loc:Azak Bog} → take WP → return" },
			{ id: "monk-infested-troubled-camp", text: "Check the second Troubled Camp vendor — one chest gives a Rare Item", optional: true, rewards: [{ text: "Rare Item", kind: "default" }] },
			{ id: "monk-infested-league-exalt", text: "Complete League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
			{ id: "act3-infested-barrens-tp-venom-crypts", text: "TP to {loc:Venom Crypts} (via Jungle Ruins WP)" },
		],
	},

	// venom-crypts — Replace + port sarcophagus + loot-venom (using base wording) + tp-town
	"venom-crypts": {
		notes: [
			{ type: "info", text: "Pick up permanent buff from Corpse-snake Venom — take Stun Threshold option (recommended for Monk). League drop: Magic Ring." },
		],
		tasks: [
			{ id: "act3-venom-crypts-sarcophagus", text: "Sarcophagus event", optional: true, rewards: [{ text: "Guaranteed Lv3 Support", kind: "gem" }] },
			{ id: "act3-venom-crypts-loot-venom", text: "Find corpse, loot {item:Corpse-snake Venom}", required: true },
			{ id: "monk-venom-crypts-stun-threshold", text: "Choose 25% increased Stun Threshold from the venom buff (recommended for Monk)", rewards: [{ text: "+25% Stun Threshold", kind: "perm" }] },
			{ id: "monk-venom-crypts-abyss", text: "Complete Abyss encounter if found for EXP", optional: true },
			{ id: "monk-venom-crypts-league-ring", text: "Take League Mechanic Magic Ring if found", optional: true, rewards: [{ text: "Magic Ring", kind: "optional" }] },
			{ id: "act3-venom-crypts-tp-town", text: "TP back to town" },
		],
	},

	// ziggurat-encampment-2 — Inherit (no monk entry)
	// Servi buff recommendation is added to azak-bog notes instead (per plan §2)

	// chimeral-wetlands — Replace + port heavy
	"chimeral-wetlands": {
		notes: [
			{ type: "info", text: "League drop: Lv9 Uncut Skill Gem. Collect {item:Chimeral Inscribed Ultimatum} for Temple of Chaos Ascendancy Trial." },
		],
		tasks: [
			{ id: "act3-chimeral-field-vendor", text: "Field vendor", optional: true, rewards: [{ text: "Guaranteed Rare Helm", kind: "default" }] },
			{ id: "act3-chimeral-toxic-bloom", text: "Toxic Bloom point of interest", optional: true, rewards: [{ text: "Amulet", kind: "optional" }] },
			{ id: "act3-chimeral-league-mech", text: "League mech", optional: true, rewards: [{ text: "Skill Gem Lv9", kind: "gem" }] },
			{ id: "act3-chimeral-enter-temple", text: "Enter {loc:Temple of Chaos} → take WP → return", rewards: [{ text: "2nd Ascendancy (run later)", kind: "perm" }] },
			{
				id: "act3-chimeral-kill-xyclucian",
				text: "Kill {boss:Xyclucian, the Chimera} → loot {item:Inscribed Ultimatum}",
				required: true,
				boss: true,
				rewards: [{ text: "Inscribed Ultimatum", kind: "default" }],
			},
			{ id: "monk-chimeral-temple-of-chaos", text: "Run or skip {loc:Temple of Chaos} Ascendancy Trial — your choice", optional: true, rewards: [{ text: "2nd Ascendancy", kind: "perm" }] },
			{ id: "act3-chimeral-enter-machinarium", text: "Enter {loc:Jiquani's Machinarium} behind boss" },
		],
	},

	// trial-of-chaos — Inherit (no monk entry)

	// jiquanis-machinarium — Replace + port U-shape tip + alva + cores + blackjaw + enter-sanctum
	"jiquanis-machinarium": {
		notes: [
			{ type: "tip", text: "Layout = squared U-shape, generators at opposite tips" },
			{ type: "info", text: "League drop: {item:Artificer's Orb}. Head left or right for Small Soul Core to unlock the door maze." },
		],
		tasks: [
			{ id: "act3-machinarium-summon-alva", text: "Summon/talk {npc:Alva}" },
			{ id: "act3-machinarium-small-soul-core", text: "Loot {item:Small Soul Core} → use on Stone Altar next to {npc:Alva}" },
			{ id: "act3-machinarium-three-cores", text: "Loot 3 {item:Small Soul Cores} to open doors" },
			{
				id: "act3-machinarium-kill-blackjaw",
				text: "Open door → kill {boss:Blackjaw} → use {item:Flame Core}",
				required: true,
				boss: true,
				rewards: [{ text: "+10% Fire Res", kind: "perm" }],
			},
			{ id: "monk-machinarium-league-artificer", text: "Complete League Mechanic for {item:Artificer's Orb}", rewards: [{ text: "Artificer's Orb", kind: "craft" }] },
			{ id: "act3-machinarium-enter-sanctum", text: "Open another door → enter {loc:Jiquani's Sanctum}" },
		],
	},

	// jiquanis-sanctum — Replace + port talk-alva + medium-cores (base wording) + nav
	// [verify in 0.5]: base says "Medium Soul Cores" go into generators; monk guide says "Large Soul Cores". Using base wording.
	"jiquanis-sanctum": {
		notes: [
			{ type: "info", text: "League drop: {item:Exalted Orb}. Note: generators take Medium Soul Cores — Large Soul Core spawns at start after killing Zicoatly." },
		],
		tasks: [
			{ id: "act3-sanctum-talk-alva", text: "Summon/talk {npc:Alva}" },
			{ id: "act3-sanctum-medium-cores", text: "Loot 2 {item:Medium Soul Cores}, place in Generators" },
			{ id: "act3-sanctum-large-core", text: "Back to start → click {item:Large Soul Core} → kill {boss:Zicoatly} → loot core" },
			{ id: "act3-sanctum-kill-zicoatly", text: "Kill {boss:Zicoatly}", required: true, boss: true },
			{ id: "monk-sanctum-league-exalt", text: "Find League Mechanic for {item:Exalted Orb} if found", optional: true, rewards: [{ text: "Exalted Orb", kind: "craft" }] },
			{ id: "act3-sanctum-tp-barrens", text: "TP to {loc:Infested Barrens}" },
		],
	},

	// infested-barrens-2 — Inherit (no monk entry)

	// matlan-waterways — Replace — CRITICAL: fix outdated "pull levers" content
	"matlan-waterways": {
		notes: [
			{ type: "patch", text: "0.5 QoL: Levers became walk-over pressure pads, final canal section ships pre-drained — old portal-skip no longer needed" },
			{ type: "info", text: "League drop: Lv10 Uncut Spirit Gem." },
		],
		tasks: [
			{ id: "act3-matlan-hut", text: "Hut → kill rare", optional: true, rewards: [{ text: "Random loot", kind: "optional" }] },
			{ id: "act3-matlan-pressure-pads", text: "Walk over {item:pressure pads} (6–8 per layout — auto-activate on contact)", required: true },
			{ id: "monk-matlan-league-spirit-gem", text: "Find League Mechanic for Lv10 Uncut Spirit Gem", optional: true, rewards: [{ text: "Spirit Gem Lv10", kind: "gem" }] },
			{ id: "act3-matlan-tp-town", text: "Proceed to end of zone → TP back to town" },
		],
	},

	// the-drowned-city — Replace + port nav tasks
	"the-drowned-city": {
		notes: [
			{ type: "info", text: "League drop: Tier 3 Support Gem. Find entrances to The Molten Vault and Apex of Filth." },
		],
		tasks: [
			{ id: "act3-drowned-city-apex-wp", text: "Find {loc:Apex of Filth} → take WP → return" },
			{ id: "act3-drowned-city-molten-vault-wp", text: "Find {loc:The Molten Vault} → take WP → return" },
			{ id: "monk-drowned-city-league-t3-support", text: "Find League Mechanic for Tier 3 Support Gem", optional: true, rewards: [{ text: "Support Gem T3", kind: "gem" }] },
			{ id: "act3-drowned-city-tp-azak-bog", text: "TP to {loc:Azak Bog}" },
		],
	},

	// azak-bog — Replace + port heavily + add Servi-charm-monk note
	"azak-bog": {
		notes: [
			{ type: "tip", text: "Boss arena always top-right; reset and farm magic packs around fire shrine for XP" },
			{ type: "tip", text: "Recommended Servi buff pick for Monk (from earlier Venom Crypts visit): +25% Stun Threshold." },
			{ type: "info", text: "Key zone — Ignagduk drops +30 Spirit + Lv10 Spirit Gem. Use Flameskin Ritual for efficient EXP respawns. League drop: Rune (skip unless nearby)." },
		],
		tasks: [
			{ id: "act3-azak-bog-talk-servi", text: "Summon/talk {npc:Servi}" },
			{ id: "act3-azak-bog-flameskin-rituals", text: "Flameskin rituals", optional: true, rewards: [{ text: "Fire Res + Rarity buff", kind: "optional" }] },
			{
				id: "act3-azak-bog-kill-ignagduk",
				text: "Kill {boss:Ignagduk, the Bog Witch} → use {item:Gemrot Skull}",
				required: true,
				boss: true,
				rewards: [{ text: "+30 Spirit", kind: "perm" }],
			},
			{ id: "monk-azak-spirit-skill", text: "Use extra Spirit for {item:Lingering Illusion} (Power Charges) or {item:Wind Dancer} (swarm protection)" },
			{ id: "act3-azak-bog-frozen-charm", text: "Talk {npc:Servi} in town for {item:Frozen Charm}", required: true },
			{ id: "act3-azak-bog-tp-molten-vault", text: "TP to {loc:Molten Vault} (1st char) or town" },
		],
	},

	// molten-vault — Replace + port kill-mektul + return-hammer + tp-town
	"molten-vault": {
		notes: [
			{ type: "info", text: "League drop: random Unique — kill for it. Kill {boss:Mektul, the Forgemaster} for the {item:Hammer of Kamasa} quest item." },
		],
		tasks: [
			{
				id: "act3-molten-vault-kill-mektul",
				text: "(1st char) Kill {boss:Mektul, the Forgemaster}",
				required: true,
				boss: true,
				rewards: [{ text: "Reforging Bench", kind: "craft" }],
				notesAfter: [{ type: "tip", text: "Return {item:Hammer of Kamasa} to {npc:Oswald} in town to unlock the bench. Skip on alt characters." }],
			},
			{ id: "act3-molten-vault-return-hammer", text: "Return {item:Hammer of Kamasa} to {npc:Oswald} in town" },
			{ id: "monk-molten-vault-league-unique", text: "Find League Mechanic for a random Unique", rewards: [{ text: "Unique", kind: "default" }] },
			{ id: "act3-molten-vault-tp-town", text: "TP back to town" },
		],
	},

	// apex-of-filth — Replace + port mushrooms (correctly as optional Superior Flasks) + queen tip
	"apex-of-filth": {
		notes: [
			{ type: "tip", text: "Pass through bottleneck-with-checkpoint, then check the back corners" },
			{ type: "info", text: "League drop: {item:Vaal Orb}." },
		],
		tasks: [
			{ id: "act3-apex-mushrooms", text: "Find 3 Mushrooms → use Cauldron", optional: true, rewards: [{ text: "Superior Flasks", kind: "optional" }] },
			{
				id: "act3-apex-kill-queen-of-filth",
				text: "Kill {boss:Queen of Filth} → loot {item:Temple Door Idol}",
				required: true,
				boss: true,
				rewards: [{ text: "Temple Door Idol", kind: "default" }],
				notesAfter: [{ type: "warning", text: "Stay close to her — moving away triggers ultimate rolling slam" }],
			},
			{ id: "monk-apex-league-vaal", text: "Complete League Mechanic for {item:Vaal Orb} if found", optional: true, rewards: [{ text: "Vaal Orb", kind: "craft" }] },
			{ id: "act3-apex-tp-town", text: "TP back to town" },
		],
	},

	// ── Act 3, L39-42 ───────────────────────────────────────────────────────

	// temple-of-kopec — Replace + port triangle-floor tip + Alva + nav
	"temple-of-kopec": {
		notes: [
			{ type: "tip", text: "Each floor is a triangle — far corner has 50% chance of being correct. Always check it first." },
			{ type: "info", text: "League drop: Lv11 Uncut Spirit Gem. Avoid the giant sun in the middle of the zone." },
		],
		tasks: [
			{ id: "monk-temple-kopec-avoid-sun", text: "Avoid the giant sun in the middle of the zone — it deals massive damage" },
			{ id: "act3-temple-kopec-kill-ketzuli", text: "Kill {boss:Ketzuli, High Priest of the Sun} (upstairs)", required: true, boss: true },
			{ id: "act3-temple-kopec-talk-alva", text: "Talk {npc:Alva}, wait for lore" },
			{ id: "monk-temple-kopec-league-spirit-gem", text: "Find League Mechanic for Lv11 Uncut Spirit Gem", optional: true, rewards: [{ text: "Spirit Gem Lv11", kind: "gem" }] },
			{ id: "act3-temple-kopec-tp-utzaal", text: "Take the Gateway → downstairs → enter {loc:Utzaal}" },
		],
	},

	// utzaal — Replace + port heavily (Fate of the Vaal critical)
	"utzaal": {
		notes: [
			{ type: "tip", text: "Same layout as Drowned City. Follow the paved road — it leads to Viper" },
			{ type: "info", text: "League drop: random Jewel. Kill Vaal Goliaths (canister on shoulder) for {item:Sacrificial Heart} quest item." },
		],
		tasks: [
			{ id: "act3-utzaal-follow-road", text: "Follow paved road" },
			{ id: "act3-utzaal-farm-heart", text: "Farm {item:Sacrificial Heart} from {boss:Vaal Goliaths} (canister on shoulder)", optional: true, notesAfter: [{ type: "tip", text: "Can also drop in Aggorat — only specific monster type drops it" }] },
			{
				id: "act3-utzaal-ancient-beacons",
				text: "Find & energise 6 {item:Ancient Beacons} across {loc:Utzaal} & {loc:Aggorat} → loot {item:Energised Crystals}",
				required: true,
				notesAfter: [{ type: "new", label: "0.5 New Core", text: "{item:Fate of the Vaal} is now core campaign content — this is your first encounter. It continues in the Interludes and becomes a full endgame storyline." }],
			},
			{ id: "act3-utzaal-open-portal", text: "Open portal to {loc:Vaal Ruins}" },
			{
				id: "act3-utzaal-kill-viper-napuatzi",
				text: "Kill {boss:Viper Napuatzi}",
				required: true,
				boss: true,
				notesAfter: [{ type: "warning", text: "Highly mobile + evasive — bait first attack cycle from consistent position to predict her" }],
			},
			{ id: "monk-utzaal-league-jewel", text: "Complete League Mechanic for a random Jewel", rewards: [{ text: "Jewel", kind: "default" }] },
			{ id: "act3-utzaal-enter-aggorat", text: "Enter {loc:Aggorat}" },
		],
	},

	// aggorat — Replace + port heavy
	// [verify in 0.5]: base has "Crag Tooth → Vaal Orb" for league mech; monk guide says "Lv11 Skill Gem".
	// Both included as base task (Vaal Orb) with monk's Skill Gem note as alternative in the same task reward.
	"aggorat": {
		notes: [
			{ type: "tip", text: "Town crier chanting tells you the right direction. Edge of pyramid = boss." },
			{ type: "info", text: "League drop: Vaal Orb or Lv11 Skill Gem (verify in 0.5)." },
		],
		tasks: [
			{ id: "act3-aggorat-sacrificial-altar", text: "Find {item:Sacrificial Altar} (top right of map)", required: true },
			{
				id: "act3-aggorat-place-heart",
				text: "Place {item:Sacrificial Heart} → stab with Dagger",
				required: true,
				rewards: [{ text: "+2 Skill Points", kind: "perm" }],
			},
			{ id: "act3-aggorat-crag-tooth", text: "League mech (Crag Tooth)", optional: true, rewards: [{ text: "Vaal Orb", kind: "craft" }] },
			{ id: "act3-aggorat-enter-black-chambers", text: "Enter {loc:The Black Chambers} (top left of map)" },
		],
	},

	// black-chambers — Replace + port Doryani phase-2 + post-fight sequence
	"black-chambers": {
		notes: [
			{ type: "info", text: "League drop: {item:Vaal Orb}. Head to the opposite end for {boss:Doryani, Royal Thaumaturge} — then proceed through the portal back to Town." },
		],
		tasks: [
			{
				id: "act3-black-chambers-kill-doryani",
				text: "Kill {boss:Doryani, the Blood Alchemist} (Act Boss)",
				required: true,
				boss: true,
				notesAfter: [{ type: "warning", text: "Phase 2 (Doryani's Triumph): rage → fortifying buff before engaging" }],
			},
			{ id: "act3-black-chambers-wait-loot", text: "Wait for loot (~30 seconds)" },
			{ id: "monk-black-chambers-league-vaal", text: "Complete League Mechanic for {item:Vaal Orb}", optional: true, rewards: [{ text: "Vaal Orb", kind: "craft" }] },
			{ id: "act3-black-chambers-tp-town", text: "TP back to town" },
			{ id: "act3-black-chambers-talk-doryani", text: "Talk to {npc:Doryani} in Ziggurat Encampment" },
			{
				id: "act3-black-chambers-talk-sequence",
				text: "Talk to {npc:Doryani} again → {npc:Alva} → {npc:Hooded One} → {npc:Alva}",
				notesAfter: [{ type: "success", text: "Act III Complete — proceed to Act IV (Karui Archipelago)" }],
			},
		],
	},

	// ── Act 4, L42-45 ───────────────────────────────────────────────────────

	// kingsmarch — Inherit (no monk entry)
	// All other Act 4 zones not listed below: Inherit

	// isle-of-kin — Replace + port mimok + flayed-sailor + blind-beast + enter-warrens
	"isle-of-kin": {
		notes: [
			{ type: "info", text: "League drop: {item:Gemcutter's Prism} — complete it. Multiple optional objectives." },
		],
		tasks: [
			{ id: "act4-isle-of-kin-flayed-sailor", text: "{item:Flayed Sailor} near shore", optional: true, rewards: [{ text: "Torn Map 3/4", kind: "optional" }] },
			{ id: "act4-isle-of-kin-beast-pen", text: "Beast Pen", optional: true, rewards: [{ text: "Skill Gem + Support Gem", kind: "gem" }] },
			{ id: "act4-isle-of-kin-kill-mimok", text: "Kill {boss:Mimok the Enslaved}", required: true, boss: true, rewards: [{ text: "Tier 4 Support Gem", kind: "gem" }] },
			{ id: "act4-isle-of-kin-blind-beast", text: "Primal Arena: {boss:Blind Beast}", optional: true, boss: true, rewards: [{ text: "Greater Blank Rune", kind: "craft" }] },
			{ id: "monk-isle-league-gcp", text: "Complete League Mechanic for {item:Gemcutter's Prism}", rewards: [{ text: "Gemcutter's Prism", kind: "craft" }] },
			{ id: "act4-isle-of-kin-enter-warrens", text: "Enter {loc:Volcanic Warrens}" },
		],
	},

	// kedge-bay — Replace + port Dead Man's Chest
	"kedge-bay": {
		notes: [
			{ type: "info", text: "League drop: {item:Exalted Orb} — complete it. Not much in this zone — move quickly and take EXP when needed." },
		],
		tasks: [
			{
				id: "act4-kedge-bay-dead-mans-chest",
				text: "{item:Dead Man's Chest} / {item:Smuggler's Stash}",
				optional: true,
				rewards: [{ text: "Torn Map 1/4", kind: "optional" }],
			},
			{ id: "monk-kedge-bay-league-exalt", text: "Complete League Mechanic for {item:Exalted Orb}", rewards: [{ text: "Exalted Orb", kind: "craft" }] },
			{ id: "monk-kedge-bay-move-fast", text: "Move quickly to the next zone — limited objectives here" },
			{ id: "act4-kedge-bay-enter-journeys-end", text: "Enter {loc:Journey's End}" },
		],
	},

	// journeys-end — Replace + port heavy
	// [verify in 0.5]: base spells it "Captain Harlin"; monk guide says "Captain Hartlin".
	// Prefer base wording "Harlin" per plan instructions. Note: talk-freya uses base "Freya Hartlin" for the NPC name.
	"journeys-end": {
		notes: [
			{ type: "info", text: "League drop: {item:Orb of Alchemy}. Talk to {npc:Freya} and {npc:Tujen} first — then kill {boss:Captain Harlin} for Verisium." },
		],
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
			{ id: "monk-journeys-end-league-alchemy", text: "Complete League Mechanic for {item:Orb of Alchemy}", rewards: [{ text: "Orb of Alchemy", kind: "craft" }] },
			{ id: "act4-journeys-end-tujen-reward", text: "Talk to {npc:Tujen} in town for reward" },
		],
	},

	// volcanic-warrens — Replace + port magma-twins kill-order + krutog + matiki + tp
	"volcanic-warrens": {
		notes: [
			{ type: "info", text: "League drop: Tier 4 Support Gem. Find the Volcanic Nest Secret Area." },
		],
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
			{ id: "monk-volcanic-league-t4-support", text: "Find League Mechanic for Tier 4 Support Gem", rewards: [{ text: "Support Gem T4", kind: "gem" }] },
			{ id: "act4-volcanic-warrens-tp-kingsmarch", text: "TP to {loc:Kingsmarch}" },
		],
	},
};
