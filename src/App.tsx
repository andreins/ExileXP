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

const STORAGE_VERSION = "4";
const DEFAULT_CHARACTER_NAME = "Default";

// ── Storage helpers ────────────────────────────────────────────────────────
// v4: progress and zone-by-act keys are now namespaced by (profile, character)
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

// Migration: v2 used flat keys, v3 used :<profile> keys, v4 uses
// :<profile>:<character>. Roll forward in steps.
function runMigration() {
	try {
		const version = localStorage.getItem("poe2-overlay-version");
		if (version === STORAGE_VERSION) return;

		// v2 → v3: flat keys → :<profile> (only :standard since old data was
		// generic). Keep the v3 step in case anyone is still on v2 → we then
		// chain into v3 → v4 below.
		const legacyProgress = localStorage.getItem("poe2-overlay-progress");
		const standardKey3 = `poe2-overlay-progress:standard`;
		if (legacyProgress && !localStorage.getItem(standardKey3)) {
			localStorage.setItem(standardKey3, legacyProgress);
		}
		const legacyZone = localStorage.getItem("poe2-overlay-active-zone-by-act");
		const standardZoneKey3 = `poe2-overlay-active-zone-by-act:standard`;
		if (legacyZone && !localStorage.getItem(standardZoneKey3)) {
			localStorage.setItem(standardZoneKey3, legacyZone);
		}

		// v3 → v4: hoist any :<profile> keys onto a Default character slot.
		// If both :standard and :monk exist, each becomes its own character
		// named "Default Standard" / "Default Monk" so the user can rename
		// them in Settings.
		let chars = loadCharacters();
		const profiles: ProfileId[] = ["standard", "monk"];
		for (const p of profiles) {
			const oldProgressKey = `poe2-overlay-progress:${p}`;
			const oldZoneKey = `poe2-overlay-active-zone-by-act:${p}`;
			const oldProgress = localStorage.getItem(oldProgressKey);
			const oldZone = localStorage.getItem(oldZoneKey);
			if (oldProgress || oldZone) {
				// Pick a character name unique to this profile.
				const charName = Object.keys(chars).length === 0
					? DEFAULT_CHARACTER_NAME
					: `Default ${p[0].toUpperCase()}${p.slice(1)}`;
				if (!chars[charName]) {
					chars[charName] = { class: p, createdAt: Date.now() };
				}
				if (oldProgress) {
					localStorage.setItem(getProgressKey(p, charName), oldProgress);
				}
				if (oldZone) {
					localStorage.setItem(getZoneByActKey(p, charName), oldZone);
				}
			}
		}
		if (Object.keys(chars).length > 0) {
			localStorage.setItem("poe2-overlay-characters", JSON.stringify(chars));
			if (!localStorage.getItem("poe2-overlay-active-character")) {
				// Prefer the one matching the saved active profile.
				const savedProfile = (localStorage.getItem("poe2-overlay-profile") as ProfileId | null) ?? "standard";
				const match = Object.entries(chars).find(([, rec]) => rec.class === savedProfile)?.[0];
				localStorage.setItem("poe2-overlay-active-character", match ?? Object.keys(chars)[0]);
			}
		}

		localStorage.setItem("poe2-overlay-version", STORAGE_VERSION);
	} catch {
		// ignore — migration is best-effort
	}
}

// Run migration before any state initialization
runMigration();

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
		return saved === "monk" ? "monk" : "standard";
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

	// ── Client log path ───────────────────────────────────────────────────
	const [clientLogPath, setClientLogPath] = useState<string>(() => {
		return localStorage.getItem("poe2-overlay-client-log-path") ?? "";
	});

	const [defaultClientLogPath, setDefaultClientLogPath] = useState<string>("");

	// ── Settings panel ────────────────────────────────────────────────────
	const [settingsOpen, setSettingsOpen] = useState(false);

	// ── Gems panel (always starts closed on profile/act swap, no persistence) ──
	const [gemsOpen, setGemsOpen] = useState<boolean>(false);
	useEffect(() => {
		setGemsOpen(false);
	}, [profile, activeActId]);
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

	// ── First-uncompleted-zone default ────────────────────────────────────
	// On mount and on profile switch: if this profile has no saved active-zone
	// state, jump to the first zone that still has unchecked tasks across all
	// acts. After the user navigates, their last position is persisted normally.
	useEffect(() => {
		const savedZoneRaw = localStorage.getItem(getZoneByActKey(profile, activeCharacter));
		if (savedZoneRaw && savedZoneRaw !== "{}") return; // honor existing position

		const savedProgressRaw = localStorage.getItem(getProgressKey(profile, activeCharacter));
		const progress: Record<string, boolean> = savedProgressRaw
			? (JSON.parse(savedProgressRaw) as Record<string, boolean>)
			: {};

		for (const act of guide) {
			for (let i = 0; i < act.zones.length; i++) {
				const z = act.zones[i];
				if (z.tasks.length === 0) continue;
				const done = z.tasks.every((t) => progress[t.id]);
				if (!done) {
					setActiveActId(act.id);
					setActiveZoneByAct((prev) => ({ ...prev, [act.id]: i }));
					return;
				}
			}
		}
		// All zones complete — leave defaults alone.
	}, [profile, activeCharacter, guide]);

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
	// so the banner doesn't linger forever after a missed teach.
	useEffect(() => {
		if (!pendingUnmapped) return;
		const remaining = pendingUnmapped.at + LEARN_WINDOW_MS - Date.now();
		if (remaining <= 0) {
			setPendingUnmapped(null);
			return;
		}
		const id = setTimeout(() => setPendingUnmapped(null), remaining);
		return () => clearTimeout(id);
	}, [pendingUnmapped]);

	const switchToZoneByName = (name: string) => {
		const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
		const hit = zoneIndex.get(normalize(name));
		if (!hit) return false; // hideout, side area, etc. — silently ignore
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
		setCharacters((cs) => {
			if (!cs[activeCharacter]) {
				return { ...cs, [activeCharacter]: { class: p, createdAt: Date.now() } };
			}
			if (cs[activeCharacter].class === p) return cs;
			return { ...cs, [activeCharacter]: { ...cs[activeCharacter], class: p } };
		});
		setCompleted(loadProgress(p, activeCharacter));
		setActiveZoneByAct(loadZoneByAct(p, activeCharacter));
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
		setCompleted(loadProgress(targetClass, trimmed));
		setActiveZoneByAct(loadZoneByAct(targetClass, trimmed));
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
					onClientLogPathChange={handleClientLogPathChange}
					onFocusTrackingChange={handleFocusTrackingChange}
					onDeleteLearned={deleteLearned}
					onClearAllLearned={clearAllLearned}
					onResetProfile={handleResetProfile}
					onResetAll={handleResetAll}
				/>
			) : (
				<>
			<ActTabs acts={guide} activeActId={activeActId} onSelectAct={setActiveActId} />

			{!gemsOpen && (
				<>
					<ProgressStrip zones={activeAct.zones} activeZoneIndex={activeZoneIndex} completed={completed} onZoneSelect={setZoneIndex} />

					<main className="guideMain">
						{activeZone ? (
							<ZoneCard zone={activeZone} completed={completed} onToggleTask={toggleTask} />
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
							onPrev={() => setZoneIndex(activeZoneIndex - 1)}
							onNext={() => setZoneIndex(activeZoneIndex + 1)}
							onMarkDone={markZoneDone}
							onCatchUp={catchUpToHere}
							currentZoneName={activeZone.name}
						/>
					)}
				</>
			)}

			<GemsPanel act={activeActId} profile={profile} open={gemsOpen} onToggle={toggleGems} />
				</>
			)}
		</div>
	);
}

export default App;
