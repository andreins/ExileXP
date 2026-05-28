import type { ActGuide, ActId } from "../types/guide";

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export type ZoneHit = { actId: ActId; zoneIndex: number };

// Returns every (act, zoneIndex) pair whose zone name normalises to the
// same key. Some campaigns have a town zone that's entered twice (e.g.,
// Act 3 Ziggurat Encampment as the initial town AND again as a return
// visit; Infested Barrens similarly), so a single zone name can resolve
// to multiple positions. Disambiguation lives in App.tsx.
export function buildIndex(guide: ActGuide[]): Map<string, ZoneHit[]> {
	const index = new Map<string, ZoneHit[]>();
	for (const act of guide) {
		act.zones.forEach((zone, zoneIndex) => {
			const key = normalize(zone.name);
			if (!key) return;
			const existing = index.get(key);
			if (existing) existing.push({ actId: act.id, zoneIndex });
			else index.set(key, [{ actId: act.id, zoneIndex }]);
		});
	}
	return index;
}
