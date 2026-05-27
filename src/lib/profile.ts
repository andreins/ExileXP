import type { ActGuide, ProfileId, ZoneGuide, ZoneOverride } from "../types/guide";
import { guide as baseGuide } from "../data/acts/index";
import { profileMap } from "../data/profiles/index";

function mergeZone(base: ZoneGuide, override: ZoneOverride | undefined): ZoneGuide {
	if (!override) return base;
	return {
		...base,
		tasks: override.tasks ?? base.tasks,
		notes: override.notes ?? base.notes,
	};
}

function mergeAct(act: ActGuide, profileId: ProfileId): ActGuide {
	const profileEntry = profileMap[profileId];
	const content = profileEntry?.content ?? null;
	if (!content) return act; // standard profile — use base as-is
	return {
		...act,
		zones: act.zones.map((z) => mergeZone(z, content[z.id])),
	};
}

// Memoize per profile
const cache = new Map<ProfileId, ActGuide[]>();

export function getMergedGuide(profileId: ProfileId): ActGuide[] {
	if (cache.has(profileId)) return cache.get(profileId)!;
	const merged = baseGuide.map((act) => mergeAct(act, profileId));
	cache.set(profileId, merged);
	return merged;
}
