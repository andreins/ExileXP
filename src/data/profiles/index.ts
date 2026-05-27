import type { ProfileContent, ProfileGems, ProfileId } from "../../types/guide";
import { monkContent } from "./monk";
import { monkGems } from "./monk-gems";

export type ProfileEntry = {
	id: ProfileId;
	label: string;
	content: ProfileContent | null;
	gems?: ProfileGems; // NEW — per-act gem data for this profile
};

/**
 * Profile registry — add new class profiles here.
 * `content: null` means "use base acts/*.ts directly" (standard profile).
 */
export const profiles: ProfileEntry[] = [
	{ id: "standard", label: "Standard", content: null },
	{ id: "monk", label: "Monk", content: monkContent, gems: monkGems },
];

export const profileMap: Record<ProfileId, ProfileEntry> = Object.fromEntries(
	profiles.map((p) => [p.id, p])
) as Record<ProfileId, ProfileEntry>;
