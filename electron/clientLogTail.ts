import fs from "node:fs";
import { BrowserWindow } from "electron";

// Loosened — matches "You have entered X." anywhere on a line, not just at
// end-of-string (PoE2 0.5 lines sometimes have trailing whitespace, BOMs, or
// embedded control sequences that broke the previous `\.$` anchor).
const ZONE_RE = /You have entered ([^.\r\n]+?)\./;
const GEN_RE  = /Generating level \d+ area "([^"]+)"/;

// PoE2 internal area IDs → display names.
// Only entries we have *verified* from real Client.txt observations are
// kept here. Speculative guesses were removed because a wrong mapping
// actively yanks the overlay to the wrong zone, which is worse than no
// switch. The renderer maintains a learned map (built from observed
// "unmapped" events paired with the user's manual zone clicks) that
// fills in everything else over time.
const INTERNAL_TO_DISPLAY: Record<string, string> = {
	// Act 1 — verified
	G1_town: "Clearfell Encampment",
	G1_2: "Clearfell",
	// Town IDs across acts — each act has one town with a uniquely
	// identifiable name, so these are reliable even without log evidence.
	G2_town: "The Ardura Caravan",
	G3_town: "Ziggurat Encampment",
	G4_town: "Kingsmarch",
	// Act 3 — verified
	G3_2_1: "Infested Barrens",
};

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

		function emit(line: string) {
			const zm = line.match(ZONE_RE);
			if (zm) {
				const zone = zm[1].trim();
				console.log("[clientLogTail] zone entered (display) =", zone);
				win.webContents.send("overlay:zone-entered", zone);
				return;
			}
			const gm = line.match(GEN_RE);
			if (gm) {
				const raw = gm[1].trim();
				const mapped = INTERNAL_TO_DISPLAY[raw];
				if (mapped) {
					console.log("[clientLogTail] zone entered (internal) =", raw, "→", mapped);
					win.webContents.send("overlay:zone-entered", mapped);
				} else {
					console.log("[clientLogTail] zone entered (unmapped internal) =", raw);
					// Renderer routes this through its learned-map; the user can
					// teach the app by manually clicking the right zone within
					// the learning window.
					win.webContents.send("overlay:zone-internal", raw);
				}
			}
		}

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
				let recentInternal: string | null = null;
				for (let i = lines.length - 1; i >= 0; i--) {
					const zm = lines[i].match(ZONE_RE);
					if (zm) {
						const zone = zm[1].trim();
						console.log("[clientLogTail] catch-up: emitting most-recent zone =", zone);
						win.webContents.send("overlay:zone-entered", zone);
						recentInternal = null;
						break;
					}
					if (!recentInternal) {
						const gm = lines[i].match(GEN_RE);
						if (gm) recentInternal = gm[1].trim();
					}
				}
				if (recentInternal) {
					const mapped = INTERNAL_TO_DISPLAY[recentInternal];
					if (mapped) {
						console.log("[clientLogTail] catch-up: emitting internal-id zone =", recentInternal, "→", mapped);
						win.webContents.send("overlay:zone-entered", mapped);
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
