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
		if (!p || !fs.existsSync(p)) return;
		const stat = fs.statSync(p);
		watching = { path: p, offset: stat.size }; // start at tail; don't replay
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
				if (m) win.webContents.send("overlay:zone-entered", m[1].trim());
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
