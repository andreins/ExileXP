import type { ActId } from "../types/guide";

// Vendor-search regexes for each campaign act. Pasted (with surrounding
// quotes) into the PoE2 vendor search bar these filter the shop to only
// items worth a glance — Lacquered helmets early, life rolls, +N to skills,
// movement-speed boots, attribute helmets/gloves matching this act's
// required colours, mid-tier life flasks, resistance suffixes, etc.
//
// PoE2's vendor search treats unquoted input as a literal substring match;
// the surrounding double quotes are what flip it into regex mode. We store
// the strings already wrapped so the Copy button paste lands ready-to-use.
// Sources: mobalytics.gg/poe-2/guides/regex, poe2.re/vendor.
export const ACT_SHOP_REGEX: Partial<Record<ActId, string>> = {
	act1: `"i.+mov|^ad.*ph.*da|^\\d.*ph.*da|^\\+.*ills$|lacquered|studded|co.+res"`,
	act2: `"li.+res|^\\+.*ills$|i.+mov|nymph's|o-wisp's|sylph's|\\d [cfl].+da"`,
	act3: `"i.+mov|resi|^\\+.*ills$|\\d [cfl].+da|nymph's|sylph's|cherub's"`,
	act4: `"i.+mov|resi|^\\+.*ills$|\\d [cfl].+da|^\\d.*ph.*da|^ad.*ph.*da|nymph's|sylph's|cherub's"`,
};
