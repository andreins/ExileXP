import type { ActGuide, ActId } from "../types/guide";

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export type ZoneHit = { actId: ActId; zoneIndex: number };

export function buildIndex(guide: ActGuide[]): Map<string, ZoneHit> {
	const index = new Map<string, ZoneHit>();
	for (const act of guide) {
		act.zones.forEach((zone, zoneIndex) => {
			const key = normalize(zone.name);
			if (key && !index.has(key)) {
				index.set(key, { actId: act.id, zoneIndex });
			}
		});
	}
	return index;
}
