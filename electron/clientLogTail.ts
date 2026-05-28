import fs from "node:fs";
import { BrowserWindow } from "electron";

// Loosened — matches "You have entered X." anywhere on a line, not just at
// end-of-string (PoE2 0.5 lines sometimes have trailing whitespace, BOMs, or
// embedded control sequences that broke the previous `\.$` anchor).
const ZONE_RE = /You have entered ([^.\r\n]+?)\./;
const GEN_RE  = /Generating level \d+ area "([^"]+)"/;

// PoE2 internal area IDs → display names.
// PoE2 0.5's `Generating level X area "G1_2"` lines use internal IDs that
// don't match our zone-name lookup. The catch-up scan finds the `You have
// entered <DisplayName>.` line and that maps cleanly; live transitions
// sometimes write only the `Generating level` line, leaving the overlay
// stuck. This table is the fallback.
//
// Observed entries are marked. Best-guesses are flagged — extend or correct
// as more internal IDs surface in production logs.
const INTERNAL_TO_DISPLAY: Record<string, string> = {
	// Act 1 — observed: G1_town, G1_2
	G1_town: "Clearfell Encampment",
	G1_1: "Riverbank",
	G1_2: "Clearfell",
	G1_3: "The Grelwood",
	G1_4: "The Red Vale",
	G1_5: "Grim Tangle",
	G1_6: "Cemetery of the Eternals",
	G1_7: "Hunting Grounds",
	G1_8: "Freythorn",
	G1_9: "Ogham Farmlands",
	G1_10: "Ogham Village",
	G1_11: "Manor Ramparts",
	G1_12: "Ogham Manor",
	// Act 2
	G2_town: "The Ardura Caravan",
	// Act 3 — internal IDs use a G3_<part>_<sub> sub-numbering scheme.
	// Observed: G3_2_1 = Infested Barrens. Extend as more are seen.
	G3_town: "Ziggurat Encampment",
	G3_1: "Sandswept Marsh",
	G3_2: "Jungle Ruins",
	G3_2_1: "Infested Barrens",
	G3_3: "The Venom Crypts",
	G3_4: "Chimeral Wetlands",
	G3_5: "Jiquani's Machinarium",
	G3_6: "Jiquani's Sanctum",
	G3_7: "The Matlan Waterways",
	G3_8: "The Drowned City",
	G3_9: "Apex of Filth",
	G3_10: "The Molten Vault",
	G3_11: "Azak Bog",
	G3_12: "Temple of Kopec",
	G3_13: "Utzaal",
	G3_14: "Aggorat",
	G3_15: "The Black Chambers",
	// Act 4
	G4_town: "Kingsmarch",
};

function resolveZoneName(raw: string): string {
	return INTERNAL_TO_DISPLAY[raw] ?? raw;
}

export function createClientLogTail(getPath: () => string | null, win: BrowserWindow) {
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

		// Catch-up: scan the last ~64 KB of the log for the most recent zone
		// entry so the overlay snaps to the player's current zone even if
		// PoE2 was already running when we launched. Prefer a display-name
		// match (ZONE_RE) over an internal-ID match (GEN_RE) when both exist.
		const scanSize = Math.min(stat.size, 64 * 1024);
		if (scanSize > 0) {
			try {
				const startOffset = stat.size - scanSize;
				const fd = fs.openSync(p, "r");
				const buf = Buffer.alloc(scanSize);
				fs.readSync(fd, buf, 0, scanSize, startOffset);
				fs.closeSync(fd);
				const lines = buf.toString("utf8").split(/\r?\n/);
				let fallback: string | null = null;
				for (let i = lines.length - 1; i >= 0; i--) {
					const zm = lines[i].match(ZONE_RE);
					if (zm) {
						const zone = zm[1].trim();
						console.log("[clientLogTail] catch-up: emitting most-recent zone =", zone);
						win.webContents.send("overlay:zone-entered", zone);
						fallback = null;
						break;
					}
					if (!fallback) {
						const gm = lines[i].match(GEN_RE);
						if (gm) fallback = gm[1].trim();
					}
				}
				if (fallback) {
					const resolved = resolveZoneName(fallback);
					console.log("[clientLogTail] catch-up: emitting internal-id zone =", fallback, "→", resolved);
					win.webContents.send("overlay:zone-entered", resolved);
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
			for (const line of buf.toString("utf8").split(/\r?\n/)) {
				const zm = line.match(ZONE_RE);
				if (zm) {
					const zone = zm[1].trim();
					console.log("[clientLogTail] zone entered (display) =", zone);
					win.webContents.send("overlay:zone-entered", zone);
					continue;
				}
				const gm = line.match(GEN_RE);
				if (gm) {
					const raw = gm[1].trim();
					const resolved = resolveZoneName(raw);
					if (resolved !== raw) {
						console.log("[clientLogTail] zone entered (internal) =", raw, "→", resolved);
					} else {
						console.log("[clientLogTail] zone entered (unmapped internal) =", raw);
					}
					win.webContents.send("overlay:zone-entered", resolved);
				}
			}
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
