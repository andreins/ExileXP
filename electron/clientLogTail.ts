import fs from "node:fs";
import { BrowserWindow } from "electron";

const ZONE_RE = /You have entered ([^.]+?)\.$/;
const GEN_RE  = /Generating level \d+ area "([^"]+)"/;

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

		// Catch-up: scan the last ~64 KB of the log for the most recent
		// "You have entered X." line so the overlay snaps to the player's
		// current zone even if PoE2 was already running when we launched.
		const scanSize = Math.min(stat.size, 64 * 1024);
		if (scanSize > 0) {
			try {
				const startOffset = stat.size - scanSize;
				const fd = fs.openSync(p, "r");
				const buf = Buffer.alloc(scanSize);
				fs.readSync(fd, buf, 0, scanSize, startOffset);
				fs.closeSync(fd);
				const lines = buf.toString("utf8").split(/\r?\n/);
				for (let i = lines.length - 1; i >= 0; i--) {
					const m = lines[i].match(ZONE_RE);
					if (m) {
						const zone = m[1].trim();
						console.log("[clientLogTail] catch-up: emitting most-recent zone =", zone);
						win.webContents.send("overlay:zone-entered", zone);
						break;
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
			for (const line of buf.toString("utf8").split(/\r?\n/)) {
				const m = line.match(ZONE_RE) ?? line.match(GEN_RE);
				if (m) {
					const zone = m[1].trim();
					console.log("[clientLogTail] zone entered =", zone);
					win.webContents.send("overlay:zone-entered", zone);
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
