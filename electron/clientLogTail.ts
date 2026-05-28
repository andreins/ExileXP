import fs from "node:fs";
import { BrowserWindow } from "electron";

// Loosened — matches "You have entered X." anywhere on a line, not just at
// end-of-string (PoE2 0.5 lines sometimes have trailing whitespace, BOMs, or
// embedded control sequences that broke the previous `\.$` anchor).
const ZONE_RE = /You have entered ([^.\r\n]+?)\./;
const GEN_RE  = /Generating level \d+ area "([^"]+)"/;
// PoE2 also writes `[SCENE] Set Source [<Display Name>]` on every transition.
// This is the cleanest live signal: scene name is the in-game display name
// directly, with no internal-ID lookup needed. Values "(null)" and
// "(unknown)" are between-scenes / character-select markers — we hide on
// those rather than trying to switch the zone.
const SCENE_RE = /\[SCENE\] Set Source \[(.+?)\]/;
const SCENE_BLANK = new Set(["(null)", "(unknown)"]);

// PoE2 internal area IDs → display names.
// Sourced from poe2db.tw (campaign WorldAreas pages) — every entry below
// was extracted from poe2db's "Id: <id>" field on the matching area page.
// Display names match the zone.name strings in src/data/acts/*.ts exactly
// so the renderer's zoneLookup index hits cleanly.
//
// Side-zones the campaign-guide doesn't track on their own (Mud Burrow,
// Root Hollow, Mausoleum of the Praetor, Tomb of the Consort, ...) map
// to their PARENT campaign zone so the overlay stays put when the player
// ducks into a side area. The runtime learned map in the renderer
// overrides anything here.
const INTERNAL_TO_DISPLAY: Record<string, string> = {
	// ── Act 1 ────────────────────────────────────────────────────────────
	G1_town: "Clearfell Encampment",
	G1_1: "Riverbank",
	G1_2: "Clearfell",
	G1_3: "Clearfell",                  // Mud Burrow — side zone of Clearfell
	G1_4: "The Grelwood",
	G1_5: "The Red Vale",
	G1_6: "Grim Tangle",
	G1_7: "Cemetery of the Eternals",
	G1_8: "Cemetery of the Eternals",   // Mausoleum of the Praetor — sub-area
	G1_9: "Cemetery of the Eternals",   // Tomb of the Consort — sub-area
	G1_10: "The Grelwood",              // Root Hollow — Brambleghast side zone
	G1_11: "Hunting Grounds",
	G1_12: "Freythorn",
	G1_13_1: "Ogham Farmlands",
	G1_13_2: "Ogham Village",
	G1_14: "Manor Ramparts",
	G1_15: "Ogham Manor",
	// ── Act 2 ────────────────────────────────────────────────────────────
	G2_town: "The Ardura Caravan",
	G2_1: "Vastiri Outskirts",
	G2_2: "Traitor's Passage",
	G2_3: "The Halani Gates",
	G2_4_1: "Keth",
	G2_4_2: "The Lost City",
	G2_4_3: "Buried Shrines",
	G2_5_1: "Mastodon Badlands",
	G2_5_2: "The Bone Pits",
	G2_6: "Valley of the Titans",
	G2_7: "The Titan Grotto",
	G2_8: "Deshar",
	G2_9_1: "Path of Mourning",
	G2_9_2: "The Spires of Deshar",
	G2_10_1: "Mawdun Quarry",
	G2_10_2: "Mawdun Mine",
	G2_11: "The Dreadnought",            // The Dreadnought's Wake — preamble
	G2_12_1: "The Dreadnought",
	G2_12_2: "The Dreadnought",          // Dreadnought Vanguard (legacy 0.4 area)
	G2_13: "Trial of Sekhemas",
	// ── Act 3 ────────────────────────────────────────────────────────────
	G3_town: "Ziggurat Encampment",
	G3_1: "Sandswept Marsh",
	G3_2_1: "Infested Barrens",
	G3_2_2: "The Matlan Waterways",
	G3_3: "Jungle Ruins",
	G3_4: "The Venom Crypts",
	G3_5: "Chimeral Wetlands",
	G3_6_1: "Jiquani's Machinarium",
	G3_6_2: "Jiquani's Sanctum",
	G3_7: "Azak Bog",
	G3_8: "The Drowned City",
	G3_9: "The Molten Vault",
	G3_10_Airlock: "Trial of Chaos",
	G3_11: "Apex of Filth",
	G3_12: "Temple of Kopec",
	G3_14: "Utzaal",
	G3_16: "Aggorat",
	G3_17: "The Black Chambers",
	// ── Act 4 ────────────────────────────────────────────────────────────
	G4_town: "Kingsmarch",
	G4_1_1: "Isle of Kin",
	G4_1_2: "Volcanic Warrens",
	G4_2_1: "Kedge Bay",
	G4_2_2: "Journey's End",
	G4_3_1: "Whakapanu Island",
	G4_3_2: "Singing Caverns",
	G4_4_1: "Eye of Hinekora",
	G4_4_2: "Halls of the Dead",
	G4_4_3: "Trial of the Ancestors",
	G4_5_1: "Abandoned Prison",
	G4_5_2: "Solitary Confinement",
	G4_7: "Shrike Island",
	G4_8a: "Arastas",
	G4_10: "The Excavation",
	G4_11_1a: "Ngakanu",
};

type TailHooks = {
	onSceneCleared?: () => void;
	onZoneEntered?: () => void;
};

export function createClientLogTail(
	getPath: () => string | null,
	win: BrowserWindow,
	hooks: TailHooks = {},
) {
	let watching: { path: string; offset: number } | null = null;

	function stop() {
		if (watching) fs.unwatchFile(watching.path);
		watching = null;
	}

	function start() {
		const p = getPath();
		if (!p || !fs.existsSync(p)) {
			console.log("[clientLogTail] no path or file does not exist:", p);
			return;
		}
		const stat = fs.statSync(p);
		console.log("[clientLogTail] watching", p, "size=" + stat.size);

		function emit(line: string) {
			// SCENE — primary live signal. Fires on every zone transition and
			// also when the player is in a between-scenes state.
			const sm = line.match(SCENE_RE);
			if (sm) {
				const scene = sm[1].trim();
				if (SCENE_BLANK.has(scene)) {
					console.log("[clientLogTail] scene cleared =", scene);
					win.webContents.send("overlay:scene-cleared", scene);
					hooks.onSceneCleared?.();
				} else {
					console.log("[clientLogTail] scene =", scene);
					win.webContents.send("overlay:zone-entered", scene);
					hooks.onZoneEntered?.();
				}
				return;
			}
			// "You have entered X." — fallback / catch-up signal.
			const zm = line.match(ZONE_RE);
			if (zm) {
				const zone = zm[1].trim();
				console.log("[clientLogTail] zone entered (display) =", zone);
				win.webContents.send("overlay:zone-entered", zone);
				hooks.onZoneEntered?.();
				return;
			}
			// "Generating level X area Y" — internal IDs, last resort.
			const gm = line.match(GEN_RE);
			if (gm) {
				const raw = gm[1].trim();
				const mapped = INTERNAL_TO_DISPLAY[raw];
				if (mapped) {
					console.log("[clientLogTail] zone entered (internal) =", raw, "→", mapped);
					win.webContents.send("overlay:zone-entered", mapped);
					hooks.onZoneEntered?.();
				} else {
					console.log("[clientLogTail] zone entered (unmapped internal) =", raw);
					win.webContents.send("overlay:zone-internal", raw);
				}
			}
		}

		// Catch-up: scan the last ~64 KB of the log for the most recent state
		// signal. Critically, if the *most recent* SCENE is "(null)" or
		// "(unknown)" — meaning the player logged out / is at character
		// select — we emit scene-cleared and let the overlay stay hidden.
		// Previously we skipped blank scenes and walked further back to a
		// real zone, which made the overlay show during char-select on
		// every launch.
		const scanSize = Math.min(stat.size, 64 * 1024);
		if (scanSize > 0) {
			try {
				const startOffset = stat.size - scanSize;
				const fd = fs.openSync(p, "r");
				const buf = Buffer.alloc(scanSize);
				fs.readSync(fd, buf, 0, scanSize, startOffset);
				fs.closeSync(fd);
				const lines = buf.toString("utf8").split(/\r?\n/);
				let acted = false;
				let recentInternal: string | null = null;
				// Walk in reverse. First definitive signal wins — including
				// a blank SCENE, which now means "stay hidden".
				for (let i = lines.length - 1; i >= 0; i--) {
					const sm = lines[i].match(SCENE_RE);
					if (sm) {
						const scene = sm[1].trim();
						if (SCENE_BLANK.has(scene)) {
							console.log("[clientLogTail] catch-up: most-recent SCENE is blank →", scene);
							win.webContents.send("overlay:scene-cleared", scene);
							hooks.onSceneCleared?.();
						} else {
							console.log("[clientLogTail] catch-up: emitting most-recent scene =", scene);
							win.webContents.send("overlay:zone-entered", scene);
							hooks.onZoneEntered?.();
						}
						acted = true;
						break;
					}
					const zm = lines[i].match(ZONE_RE);
					if (zm) {
						const zone = zm[1].trim();
						console.log("[clientLogTail] catch-up: emitting most-recent zone =", zone);
						win.webContents.send("overlay:zone-entered", zone);
						hooks.onZoneEntered?.();
						acted = true;
						break;
					}
					if (!recentInternal) {
						const gm = lines[i].match(GEN_RE);
						if (gm) recentInternal = gm[1].trim();
					}
				}
				if (!acted && recentInternal) {
					const mapped = INTERNAL_TO_DISPLAY[recentInternal];
					if (mapped) {
						console.log("[clientLogTail] catch-up: emitting internal-id zone =", recentInternal, "→", mapped);
						win.webContents.send("overlay:zone-entered", mapped);
						hooks.onZoneEntered?.();
					} else {
						console.log("[clientLogTail] catch-up: unmapped internal =", recentInternal);
						win.webContents.send("overlay:zone-internal", recentInternal);
					}
				}
			} catch (e) {
				console.warn("[clientLogTail] catch-up scan failed:", e);
			}
		}

		watching = { path: p, offset: stat.size };
		fs.watchFile(p, { interval: 1000 }, (curr) => {
			if (!watching) return;
			if (curr.size < watching.offset) watching.offset = 0; // rotation
			const len = curr.size - watching.offset;
			if (len <= 0) return;
			const fd = fs.openSync(watching.path, "r");
			const buf = Buffer.alloc(len);
			fs.readSync(fd, buf, 0, len, watching.offset);
			fs.closeSync(fd);
			watching.offset = curr.size;
			for (const line of buf.toString("utf8").split(/\r?\n/)) emit(line);
		});
	}

	return {
		start,
		stop,
		restart() {
			stop();
			start();
		},
	};
}
