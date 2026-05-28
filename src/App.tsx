import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import type { ActId, ProfileId } from "./types/guide";
import { getMergedGuide } from "./lib/profile";
import { buildIndex } from "./lib/zoneLookup";
import OverlayHeader from "./components/OverlayHeader";
import SettingsPanel from "./components/SettingsPanel";
import ActTabs from "./components/ActTabs";
import ProgressStrip from "./components/ProgressStrip";
import ZoneCard from "./components/ZoneCard";
import ZoneNav from "./components/ZoneNav";
import GemsPanel from "./components/GemsPanel";

const DEFAULT_CHARACTER_NAME = "Default";

// ── Storage helpers ────────────────────────────────────────────────────────
// Progress and zone-by-act keys are namespaced by (class profile, character)
// so two characters of the same class don't share a slot. Class profile drives
// content; character drives progress.

function getProgressKey(p: ProfileId, character: string) {
	return `poe2-overlay-progress:${p}:${character}`;
}

function getZoneByActKey(p: ProfileId, character: string) {
	return `poe2-overlay-active-zone-by-act:${p}:${character}`;
}

function loadProgress(profile: ProfileId, character: string): Record<string, boolean> {
	try {
		const raw = localStorage.getItem(getProgressKey(profile, character));
		return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
	} catch {
		return {};
	}
}

function loadZoneByAct(profile: ProfileId, character: string): Record<string, number> {
	try {
		const raw = localStorage.getItem(getZoneByActKey(profile, character));
		return raw ? (JSON.parse(raw) as Record<string, number>) : {};
	} catch {
		return {};
	}
}

type CharacterRecord = { class: ProfileId; createdAt: number };

function loadCharacters(): Record<string, CharacterRecord> {
	try {
		const raw = localStorage.getItem("poe2-overlay-characters");
		return raw ? (JSON.parse(raw) as Record<string, CharacterRecord>) : {};
	} catch {
		return {};
	}
}

// Find the first zone across the merged guide where not every task is
// completed. Returns null when everything is done. Used as the default
// position for fresh-install / brand-new-character / reset cases.
function findFirstUncompleted(
	guide: ReturnType<typeof getMergedGuide>,
	progress: Record<string, boolean>,
): { actId: ActId; zoneIndex: number } | null {
	for (const act of guide) {
		for (let i = 0; i < act.zones.length; i++) {
			const z = act.zones[i];
			if (z.tasks.length === 0) continue;
			const done = z.tasks.every((t) => progress[t.id]);
			if (!done) return { actId: act.id, zoneIndex: i };
		}
	}
	return null;
}

// ── App ────────────────────────────────────────────────────────────────────

function App() {
	// ── Characters (per-character progress slots) ────────────────────────
	const [characters, setCharacters] = useState<Record<string, CharacterRecord>>(() => loadCharacters());
	const [activeCharacter, setActiveCharacter] = useState<string>(() => {
		const saved = localStorage.getItem("poe2-overlay-active-character");
		if (saved) return saved;
		const chars = loadCharacters();
		const first = Object.keys(chars)[0];
		return first ?? DEFAULT_CHARACTER_NAME;
	});

	// ── Profile state ────────────────────────────────────────────────────
	// Profile is derived from the active character's assigned class. If the
	// character hasn't been registered yet (fresh install), fall back to the
	// last manually-saved profile or "standard".
	const [profile, setProfile] = useState<ProfileId>(() => {
		const chars = loadCharacters();
		if (chars[activeCharacter]) return chars[activeCharacter].class;
		const saved = localStorage.getItem("poe2-overlay-profile");
		// Default to Monk for first-time users — that's what the project's
		// curated content actually covers. Honour an explicit "standard"
		// save so existing setups don't flip on upgrade.
		return saved === "standard" ? "standard" : "monk";
	});

	// ── Guide (memoized per profile) ─────────────────────────────────────
	const guide = useMemo(() => getMergedGuide(profile), [profile]);

	// ── Progress (per-character, loaded on mount and on character switch) ─
	const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
		loadProgress(profile, activeCharacter)
	);

	// ── Active act ───────────────────────────────────────────────────────
	const [activeActId, setActiveActId] = useState<ActId>(() => {
		const saved = localStorage.getItem("poe2-overlay-active-act");
		const valid = guide.find((a) => a.id === saved);
		return valid ? valid.id : guide[0].id;
	});

	// ── Active zone by act (per-character) ───────────────────────────────
	const [activeZoneByAct, setActiveZoneByAct] = useState<Record<string, number>>(() =>
		loadZoneByAct(profile, activeCharacter)
	);

	// ── Autodetect ───────────────────────────────────────────────────────
	const [focusTracking, setFocusTracking] = useState<"on" | "off">(() => {
		const saved = localStorage.getItem("poe2-overlay-focus-track");
		return saved === "off" ? "off" : "on"; // default on
	});

	const [autodetect, setAutodetect] = useState<"on" | "off">(() => {
		const saved = localStorage.getItem("poe2-overlay-autodetect");
		return saved === "off" ? "off" : "on";
	});

	const [autocompleteOnLeave, setAutocompleteOnLeave] = useState<"on" | "off">(() => {
		const saved = localStorage.getItem("poe2-overlay-autocomplete-on-leave");
		return saved === "off" ? "off" : "on"; // default on
	});

	// ── Client log path ───────────────────────────────────────────────────
	const [clientLogPath, setClientLogPath] = useState<string>(() => {
		return localStorage.getItem("poe2-overlay-client-log-path") ?? "";
	});

	const [defaultClientLogPath, setDefaultClientLogPath] = useState<string>("");

	// ── Settings panel ────────────────────────────────────────────────────
	const [settingsOpen, setSettingsOpen] = useState(false);

	// ── Gems panel (always starts closed on profile/act swap, no persistence) ──
	// Reset is driven by the act/profile-change handlers below, not by a
	// useEffect — synchronous setState inside an effect on dep change is the
	// "Avoid resetting state in an Effect" anti-pattern per React docs.
	const [gemsOpen, setGemsOpen] = useState<boolean>(false);
	const toggleGems = () => setGemsOpen((prev) => !prev);

	// ── Click-through ─────────────────────────────────────────────────────
	const [clickThrough, setClickThrough] = useState(false);

	const appRef = useRef<HTMLDivElement>(null);

	// ── Derived state ─────────────────────────────────────────────────────
	const activeAct = useMemo(() => guide.find((a) => a.id === activeActId) ?? guide[0], [activeActId, guide]);
	const activeZoneIndex = activeZoneByAct[activeAct.id] ?? 0;
	const activeZone = activeAct.zones[activeZoneIndex];

	const isZoneDone = activeZone
		? activeZone.tasks.length > 0 && activeZone.tasks.every((t) => completed[t.id])
		: false;

	// True when at least one task in any zone STRICTLY BEFORE the active
	// zone is still unchecked — the only case where the "Catch up" button
	// has anything to do. Hidden otherwise so it doesn't bait clicks on a
	// fresh character (everything before is already empty) or after a full
	// catch-up.
	const canCatchUp = useMemo(() => {
		for (const act of guide) {
			if (act.id === activeActId) {
				for (let i = 0; i < activeZoneIndex; i++) {
					for (const task of act.zones[i].tasks) {
						if (!completed[task.id]) return true;
					}
				}
				return false;
			}
			for (const zone of act.zones) {
				for (const task of zone.tasks) {
					if (!completed[task.id]) return true;
				}
			}
		}
		return false;
	}, [guide, activeActId, activeZoneIndex, completed]);

	// ── Zone lookup index for autodetect ──────────────────────────────────
	const zoneIndex = useMemo(() => buildIndex(guide), [guide]);

	// ── Persistence effects ───────────────────────────────────────────────
	useEffect(() => {
		localStorage.setItem(getProgressKey(profile, activeCharacter), JSON.stringify(completed));
	}, [completed, profile, activeCharacter]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-active-act", activeActId);
	}, [activeActId]);

	useEffect(() => {
		localStorage.setItem(getZoneByActKey(profile, activeCharacter), JSON.stringify(activeZoneByAct));
	}, [activeZoneByAct, profile, activeCharacter]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-profile", profile);
	}, [profile]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-active-character", activeCharacter);
	}, [activeCharacter]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-characters", JSON.stringify(characters));
	}, [characters]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-autodetect", autodetect);
	}, [autodetect]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-autocomplete-on-leave", autocompleteOnLeave);
	}, [autocompleteOnLeave]);

	useEffect(() => {
		if (clientLogPath) {
			localStorage.setItem("poe2-overlay-client-log-path", clientLogPath);
		} else {
			localStorage.removeItem("poe2-overlay-client-log-path");
		}
	}, [clientLogPath]);

	// ── Electron event subscriptions ──────────────────────────────────────
	useEffect(() => {
		return window.overlay?.onClickThroughChanged((value) => setClickThrough(value));
	}, []);

	// When click-through is ON, the window normally ignores all mouse events so the
	// user can't click anything in the overlay — including the click-through button
	// itself. Watch forwarded mousemove events; when the cursor is over an element
	// flagged with [data-always-interactive], ask main to temporarily process mouse
	// events so that element stays clickable.
	useEffect(() => {
		if (!clickThrough) return;
		let lastInteractive = false;
		const onMove = (e: MouseEvent) => {
			const target = document.elementFromPoint(e.clientX, e.clientY);
			const interactive = target?.closest("[data-always-interactive]") != null;
			if (interactive !== lastInteractive) {
				lastInteractive = interactive;
				window.overlay?.setMouseInteractive(interactive);
			}
		};
		document.addEventListener("mousemove", onMove);
		return () => {
			document.removeEventListener("mousemove", onMove);
			// Reset to honour the user's click-through preference on cleanup.
			window.overlay?.setMouseInteractive(false);
		};
	}, [clickThrough]);

	useEffect(() => {
		// Fetch the default path to show as placeholder in the settings panel
		window.overlay?.getDefaultClientLogPath().then((p) => {
			if (p) setDefaultClientLogPath(p);
		});
	}, []);

	// ── Autocomplete on zone leave ────────────────────────────────────────
	// We want autocomplete to fire ONLY when the game tells us the player
	// physically entered a new zone (autodetect), not when they click
	// Next/Prev/ProgressStrip themselves. So instead of a generic effect on
	// (activeActId, activeZoneIndex), we mark the current zone done inside
	// the autodetect handler right before switching to the new zone.
	//
	// `currentZoneRef` mirrors (activeActId, activeZoneIndex) so the autodetect
	// callback (subscribed long-lived) always reads the freshest current zone
	// without re-subscribing on every state change.
	const currentZoneRef = useRef<{ actId: ActId; zoneIndex: number }>({
		actId: activeActId,
		zoneIndex: activeZoneIndex,
	});
	useEffect(() => {
		currentZoneRef.current = { actId: activeActId, zoneIndex: activeZoneIndex };
	}, [activeActId, activeZoneIndex]);

	// Mirror autocompleteOnLeave into a ref so the autodetect callback reads
	// the current toggle value without forcing the subscription to refresh
	// (and dropping events) every time the setting changes.
	const autocompleteOnLeaveRef = useRef(autocompleteOnLeave);
	useEffect(() => {
		autocompleteOnLeaveRef.current = autocompleteOnLeave;
	}, [autocompleteOnLeave]);

	// Long-lived autodetect subscription reads `guide` and `completed` via
	// these refs so we don't need to re-subscribe (and risk dropping a
	// Client.txt event) every time progress changes.
	const guideRef = useRef(guide);
	const completedRef = useRef(completed);
	useEffect(() => {
		guideRef.current = guide;
	}, [guide]);
	useEffect(() => {
		completedRef.current = completed;
	}, [completed]);

	// Bulk-mark every task in the given zone as complete. Called only from
	// autodetect transitions; manual nav (Next/Prev/strip clicks) never
	// triggers this.
	const autocompleteZone = (actId: ActId, zoneIndex: number) => {
		const act = guide.find((a) => a.id === actId);
		if (!act) return;
		const zone = act.zones[zoneIndex];
		if (!zone || zone.tasks.length === 0) return;
		setCompleted((c) => {
			const next = { ...c };
			for (const task of zone.tasks) next[task.id] = true;
			return next;
		});
	};

	// One-shot initial-position default: if the user's first session has no
	// saved zone-by-act, jump to the first uncompleted zone. Runs ONCE per
	// mount (ref-gated) so React Compiler doesn't flag it as a reactive
	// setState-in-effect anti-pattern; subsequent profile/character changes
	// are handled inside their respective handlers.
	const didInitialPositionRef = useRef(false);
	useEffect(() => {
		if (didInitialPositionRef.current) return;
		didInitialPositionRef.current = true;
		if (Object.keys(activeZoneByAct).length > 0) return;
		const target = findFirstUncompleted(guide, completed);
		if (!target) return;
		setActiveActId(target.actId);
		setActiveZoneByAct({ [target.actId]: target.zoneIndex });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	// ── Autodetect zone subscription ──────────────────────────────────────
	// `lastDetectedZone` is recorded for every Client.txt zone-entered event,
	// matched or not, so the Settings panel can show the user that the tail
	// is actually running (and what raw zone name PoE2 wrote, for debugging).
	const [lastDetectedZone, setLastDetectedZone] = useState<{ name: string; at: number; unmapped?: boolean } | null>(null);

	// Persisted "learned" mapping from PoE2 internal area IDs (G3_10_Airlock,
	// etc.) → display names the user taught us by manually clicking the right
	// zone after the unmapped event fired. Used as a fallback for IDs not in
	// the static INTERNAL_TO_DISPLAY table (electron/clientLogTail.ts).
	const LEARNED_KEY = "poe2-overlay-learned-zone-ids";
	const [learnedMap, setLearnedMap] = useState<Record<string, string>>(() => {
		try {
			const raw = localStorage.getItem(LEARNED_KEY);
			return raw ? (JSON.parse(raw) as Record<string, string>) : {};
		} catch {
			return {};
		}
	});
	useEffect(() => {
		try {
			localStorage.setItem(LEARNED_KEY, JSON.stringify(learnedMap));
		} catch {
			/* ignore */
		}
	}, [learnedMap]);
	const deleteLearned = (raw: string) => {
		setLearnedMap((m) => {
			const next = { ...m };
			delete next[raw];
			return next;
		});
	};
	const clearAllLearned = () => setLearnedMap({});

	// Pending unmapped internal ID. While set (≤ 60 s old), the next manual
	// zone click teaches the app what this ID maps to. Kept in state (not a
	// ref) so the UI can surface a "teach me" banner over the main view.
	const [pendingUnmapped, setPendingUnmapped] = useState<{ raw: string; at: number } | null>(null);
	const LEARN_WINDOW_MS = 60_000;

	// Auto-clear the pending unmapped state once the learning window expires
	// so the banner doesn't linger forever after a missed teach. setTimeout
	// is async so even with `remaining=0` we don't trigger the
	// "synchronous setState in effect" cascade-render warning.
	useEffect(() => {
		if (!pendingUnmapped) return;
		const remaining = Math.max(0, pendingUnmapped.at + LEARN_WINDOW_MS - Date.now());
		const id = setTimeout(() => setPendingUnmapped(null), remaining);
		return () => clearTimeout(id);
	}, [pendingUnmapped]);

	// Switch zone in response to an *autodetect* event. Before switching,
	// autocomplete the zone we were on (if the user has the setting enabled
	// and the new zone is actually different from the current one). Manual
	// nav (Next/Prev/strip/tab) doesn't go through this path.
	//
	// Some zone names appear in the campaign twice (Ziggurat Encampment and
	// Infested Barrens in Act 3 — initial + return visit). The lookup
	// returns all candidates and we pick the right one: prefer a same-act
	// candidate that's at or ahead of the player's current position, and
	// among those, prefer the FIRST one whose tasks aren't already all
	// done. That way the second-visit zone gets picked up automatically
	// once the first-visit zone is complete.
	const switchToZoneByName = (name: string) => {
		const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
		const candidates = zoneIndex.get(normalize(name));
		if (!candidates || candidates.length === 0) return false;

		const current = currentZoneRef.current;
		let hit = candidates[0];
		if (candidates.length > 1) {
			const currentGuide = guideRef.current;
			const currentCompleted = completedRef.current;
			const zoneIsDone = (actId: ActId, idx: number) => {
				const act = currentGuide.find((a) => a.id === actId);
				const z = act?.zones[idx];
				if (!z || z.tasks.length === 0) return false;
				return z.tasks.every((t) => currentCompleted[t.id]);
			};

			const sameAct = candidates.filter((c) => c.actId === current.actId);
			const pool = sameAct.length > 0 ? sameAct : candidates;
			// Prefer same-act candidates at or after the current zone index.
			const ahead = pool.filter((c) => c.zoneIndex >= current.zoneIndex);
			const search = ahead.length > 0 ? ahead : pool;
			// Among those, take the first one not yet fully complete; if
			// all are done, fall back to the closest one ahead.
			hit = search.find((c) => !zoneIsDone(c.actId, c.zoneIndex)) ?? search[0];
		}

		const isActualChange = current.actId !== hit.actId || current.zoneIndex !== hit.zoneIndex;
		if (isActualChange && autocompleteOnLeaveRef.current === "on") {
			autocompleteZone(current.actId, current.zoneIndex);
		}

		setActiveActId(hit.actId);
		setActiveZoneByAct((prev) => ({ ...prev, [hit.actId]: hit.zoneIndex }));
		return true;
	};

	useEffect(() => {
		// Resolved display names — straight to the index lookup.
		const unsubEntered = window.overlay?.onZoneEntered((name) => {
			setLastDetectedZone({ name, at: Date.now() });
			setPendingUnmapped(null);
			if (autodetect !== "on") return;
			switchToZoneByName(name);
		});
		// Unmapped internal IDs — try the learned map first; otherwise hold
		// onto the raw ID so the next manual zone click can teach us.
		const unsubInternal = window.overlay?.onZoneInternal((raw) => {
			const learned = learnedMap[raw];
			if (learned) {
				setLastDetectedZone({ name: learned, at: Date.now() });
				setPendingUnmapped(null);
				if (autodetect !== "on") return;
				switchToZoneByName(learned);
				return;
			}
			setLastDetectedZone({ name: raw, at: Date.now(), unmapped: true });
			setPendingUnmapped({ raw, at: Date.now() });
		});
		return () => {
			unsubEntered?.();
			unsubInternal?.();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autodetect, zoneIndex, learnedMap]);

	// ── Height sync ───────────────────────────────────────────────────────
	// ResizeObserver re-measures whenever any descendant changes size — including
	// state changes inside child components (e.g. expanding gem notes inside
	// GemsPanel) that would not otherwise trigger an App re-render.
	useEffect(() => {
		const el = appRef.current;
		if (!el) return;
		const push = () => {
			const h = el.offsetHeight;
			if (h > 0) window.overlay?.setWindowHeight(h);
		};
		push(); // initial sync
		const observer = new ResizeObserver(push);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// ── Handlers ──────────────────────────────────────────────────────────
	const toggleTask = (id: string) => {
		setCompleted((c) => ({ ...c, [id]: !c[id] }));
	};

	const setZoneIndex = (index: number) => {
		if (!activeAct.zones.length) return;
		const next = Math.max(0, Math.min(index, activeAct.zones.length - 1));
		setActiveZoneByAct((c) => ({ ...c, [activeAct.id]: next }));

		// Learning: if the tail recently emitted an unmapped internal ID,
		// associate it with the zone the user just clicked.
		if (pendingUnmapped && Date.now() - pendingUnmapped.at <= LEARN_WINDOW_MS) {
			const zone = activeAct.zones[next];
			if (zone) {
				setLearnedMap((m) => ({ ...m, [pendingUnmapped.raw]: zone.name }));
				console.log(`[learn] ${pendingUnmapped.raw} → ${zone.name}`);
			}
			setPendingUnmapped(null);
		}
	};

	const markZoneDone = () => {
		if (!activeZone) return;
		const wasDone = isZoneDone;
		setCompleted((c) => {
			const next = { ...c };
			for (const task of activeZone.tasks) next[task.id] = !wasDone;
			return next;
		});
		// Auto-advance when completing (not when un-completing) and the game isn't telling us
		// where to be. With autodetect ON, the player's actual zone is authoritative.
		if (!wasDone && autodetect !== "on") {
			const nextIdx = activeZoneIndex + 1;
			if (nextIdx < activeAct.zones.length) {
				setActiveZoneByAct((c) => ({ ...c, [activeAct.id]: nextIdx }));
			}
		}
	};

	const toggleClickThrough = async () => {
		const result = await window.overlay?.setClickThrough(!clickThrough);
		setClickThrough(Boolean(result));
	};

	const handleProfileChange = (p: ProfileId) => {
		// Switching class profile also re-classes the active character: the
		// character keeps its name and progress slot but the leveling content
		// changes. Persisted via the `characters` effect.
		setProfile(p);
		setGemsOpen(false);
		setCharacters((cs) => {
			if (!cs[activeCharacter]) {
				return { ...cs, [activeCharacter]: { class: p, createdAt: Date.now() } };
			}
			if (cs[activeCharacter].class === p) return cs;
			return { ...cs, [activeCharacter]: { ...cs[activeCharacter], class: p } };
		});
		const nextCompleted = loadProgress(p, activeCharacter);
		const nextZones = loadZoneByAct(p, activeCharacter);
		setCompleted(nextCompleted);
		setActiveZoneByAct(nextZones);
		// If the new (profile, character) combo has no saved position, jump
		// to the first uncompleted zone across the new merged guide.
		if (Object.keys(nextZones).length === 0) {
			const target = findFirstUncompleted(getMergedGuide(p), nextCompleted);
			if (target) {
				setActiveActId(target.actId);
				setActiveZoneByAct({ [target.actId]: target.zoneIndex });
			}
		}
	};

	const handleCharacterChange = (name: string) => {
		if (!name || name === activeCharacter) return;
		const trimmed = name.trim();
		if (!trimmed) return;
		// Auto-register the character against the current class profile if
		// it's brand new. Otherwise use its stored class.
		setCharacters((cs) => {
			if (cs[trimmed]) return cs;
			return { ...cs, [trimmed]: { class: profile, createdAt: Date.now() } };
		});
		const targetClass = characters[trimmed]?.class ?? profile;
		setProfile(targetClass);
		setActiveCharacter(trimmed);
		setGemsOpen(false);
		const nextCompleted = loadProgress(targetClass, trimmed);
		const nextZones = loadZoneByAct(targetClass, trimmed);
		setCompleted(nextCompleted);
		setActiveZoneByAct(nextZones);
		// Jump to first uncompleted zone for new / freshly-reset characters.
		if (Object.keys(nextZones).length === 0) {
			const target = findFirstUncompleted(getMergedGuide(targetClass), nextCompleted);
			if (target) {
				setActiveActId(target.actId);
				setActiveZoneByAct({ [target.actId]: target.zoneIndex });
			}
		}
	};

	const handleDeleteCharacter = (name: string) => {
		if (!characters[name]) return;
		// Wipe stored progress for the character across both class slots
		// (in case it was re-classed at some point).
		for (const p of ["standard", "monk"] as ProfileId[]) {
			localStorage.removeItem(getProgressKey(p, name));
			localStorage.removeItem(getZoneByActKey(p, name));
		}
		setCharacters((cs) => {
			const next = { ...cs };
			delete next[name];
			return next;
		});
		// If we deleted the active character, fall back to another known
		// character or the default slot.
		if (activeCharacter === name) {
			const remaining = Object.keys(characters).filter((c) => c !== name);
			const fallback = remaining[0] ?? DEFAULT_CHARACTER_NAME;
			setActiveCharacter(fallback);
			const fallbackClass = characters[fallback]?.class ?? profile;
			setProfile(fallbackClass);
			setCompleted(loadProgress(fallbackClass, fallback));
			setActiveZoneByAct(loadZoneByAct(fallbackClass, fallback));
		}
	};

	const handleClientLogPathChange = async (p: string) => {
		setClientLogPath(p);
		await window.overlay?.setClientLogPath(p || null);
	};

	const handleFocusTrackingChange = (next: "on" | "off") => {
		setFocusTracking(next);
		localStorage.setItem("poe2-overlay-focus-track", next);
		window.overlay?.setFocusTracking(next === "on");
	};

	// Push initial focus-tracking state to main on mount.
	useEffect(() => {
		window.overlay?.setFocusTracking(focusTracking === "on");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Bulk-mark every task in every zone BEFORE the current zone as completed.
	// Lets a user who's already mid-campaign record their existing progress in
	// one click instead of ticking each zone manually.
	const catchUpToHere = () => {
		setCompleted((c) => {
			const next = { ...c };
			for (const act of guide) {
				if (act.id === activeActId) {
					// Same act: mark zones strictly before the active zone index.
					for (let i = 0; i < activeZoneIndex; i++) {
						for (const task of act.zones[i].tasks) next[task.id] = true;
					}
					break;
				}
				// Prior acts: mark every task in every zone.
				for (const zone of act.zones) {
					for (const task of zone.tasks) next[task.id] = true;
				}
			}
			return next;
		});
	};

	const handleResetProfile = () => {
		// "Reset profile" now wipes the ACTIVE CHARACTER'S progress only —
		// other characters on the same class profile are untouched.
		localStorage.removeItem(getProgressKey(profile, activeCharacter));
		localStorage.removeItem(getZoneByActKey(profile, activeCharacter));
		setCompleted({});
		setActiveZoneByAct({});
	};

	const handleResetAll = () => {
		const keys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("poe2-overlay-")) keys.push(key);
		}
		keys.forEach((k) => localStorage.removeItem(k));
		location.reload();
	};

	return (
		<div className="app" ref={appRef}>
			<OverlayHeader
				profile={profile}
				clickThrough={clickThrough}
				onToggleClickThrough={toggleClickThrough}
				settingsOpen={settingsOpen}
				onOpenSettings={() => setSettingsOpen((o) => !o)}
				onCloseApp={() => window.overlay?.closeApp()}
			/>
			{pendingUnmapped && (
				<div className="learnBanner" data-always-interactive="true">
					<div className="learnBanner__body">
						<div className="learnBanner__title">
							New area ID: <strong>{pendingUnmapped.raw}</strong>
						</div>
						<div className="learnBanner__hint">
							Click the matching zone in the strip below to teach the overlay. {settingsOpen && <em>(Close Settings first.)</em>}
						</div>
					</div>
					<button
						className="learnBanner__close"
						onClick={(e) => { e.currentTarget.blur(); setPendingUnmapped(null); }}
						title="Dismiss"
					>
						✕
					</button>
				</div>
			)}
			{settingsOpen ? (
				<SettingsPanel
					profile={profile}
					autodetect={autodetect}
					autocompleteOnLeave={autocompleteOnLeave}
					clientLogPath={clientLogPath}
					defaultClientLogPath={defaultClientLogPath}
					lastDetectedZone={lastDetectedZone}
					focusTracking={focusTracking}
					learnedMap={learnedMap}
					characters={characters}
					activeCharacter={activeCharacter}
					onProfileChange={handleProfileChange}
					onCharacterChange={handleCharacterChange}
					onDeleteCharacter={handleDeleteCharacter}
					onAutodetectChange={setAutodetect}
					onAutocompleteOnLeaveChange={setAutocompleteOnLeave}
					onClientLogPathChange={handleClientLogPathChange}
					onFocusTrackingChange={handleFocusTrackingChange}
					onDeleteLearned={deleteLearned}
					onClearAllLearned={clearAllLearned}
					onResetProfile={handleResetProfile}
					onResetAll={handleResetAll}
				/>
			) : (
				<>
			<ActTabs acts={guide} activeActId={activeActId} onSelectAct={(id) => { setActiveActId(id); setGemsOpen(false); }} />

			{!gemsOpen && (
				<>
					<ProgressStrip zones={activeAct.zones} activeZoneIndex={activeZoneIndex} completed={completed} onZoneSelect={setZoneIndex} />

					<main className="guideMain">
						{activeZone ? (
							<ZoneCard zone={activeZone} completed={completed} onToggleTask={toggleTask} autocompleteOnLeave={autocompleteOnLeave} />
						) : (
							<div className="emptyState">
								<div className="emptyTitle">{activeAct.label}</div>
								<div className="emptyText">No zones added yet.</div>
							</div>
						)}
					</main>

					{activeZone && (
						<ZoneNav
							activeIndex={activeZoneIndex}
							totalZones={activeAct.zones.length}
							isZoneDone={isZoneDone}
							canCatchUp={canCatchUp}
							onPrev={() => setZoneIndex(activeZoneIndex - 1)}
							onNext={() => setZoneIndex(activeZoneIndex + 1)}
							onMarkDone={markZoneDone}
							onCatchUp={catchUpToHere}
							currentZoneName={activeZone.name}
						/>
					)}
				</>
			)}

			<GemsPanel key={`${profile}:${activeActId}`} act={activeActId} profile={profile} open={gemsOpen} onToggle={toggleGems} />
				</>
			)}
		</div>
	);
}

export default App;
