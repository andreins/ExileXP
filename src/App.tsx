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

const STORAGE_VERSION = "3";

// ── Storage helpers ────────────────────────────────────────────────────────

function getProgressKey(p: ProfileId) {
	return `poe2-overlay-progress:${p}`;
}

function getZoneByActKey(p: ProfileId) {
	return `poe2-overlay-active-zone-by-act:${p}`;
}

function loadProgressForProfile(profile: ProfileId): Record<string, boolean> {
	try {
		const raw = localStorage.getItem(getProgressKey(profile));
		return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
	} catch {
		return {};
	}
}

function loadZoneByActForProfile(profile: ProfileId): Record<string, number> {
	try {
		const raw = localStorage.getItem(getZoneByActKey(profile));
		return raw ? (JSON.parse(raw) as Record<string, number>) : {};
	} catch {
		return {};
	}
}

// v2 → v3 migration: copy old flat keys to :standard namespaced keys
function runMigration() {
	try {
		const version = localStorage.getItem("poe2-overlay-version");
		if (version === STORAGE_VERSION) return;

		// Copy legacy progress to :standard if the namespaced key is absent
		const legacyProgress = localStorage.getItem("poe2-overlay-progress");
		const standardProgressKey = getProgressKey("standard");
		if (legacyProgress && !localStorage.getItem(standardProgressKey)) {
			localStorage.setItem(standardProgressKey, legacyProgress);
		}

		// Copy legacy zone-by-act to :standard if absent
		const legacyZoneByAct = localStorage.getItem("poe2-overlay-active-zone-by-act");
		const standardZoneKey = getZoneByActKey("standard");
		if (legacyZoneByAct && !localStorage.getItem(standardZoneKey)) {
			localStorage.setItem(standardZoneKey, legacyZoneByAct);
		}

		localStorage.setItem("poe2-overlay-version", STORAGE_VERSION);
	} catch {
		// ignore
	}
}

// Run migration before any state initialization
runMigration();

// ── App ────────────────────────────────────────────────────────────────────

function App() {
	// ── Profile state ────────────────────────────────────────────────────
	const [profile, setProfile] = useState<ProfileId>(() => {
		const saved = localStorage.getItem("poe2-overlay-profile");
		return saved === "monk" ? "monk" : "standard";
	});

	// ── Guide (memoized per profile) ─────────────────────────────────────
	const guide = useMemo(() => getMergedGuide(profile), [profile]);

	// ── Progress (per-profile, loaded on mount/switch) ───────────────────
	const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
		loadProgressForProfile(profile)
	);

	// ── Active act ───────────────────────────────────────────────────────
	const [activeActId, setActiveActId] = useState<ActId>(() => {
		const saved = localStorage.getItem("poe2-overlay-active-act");
		const valid = guide.find((a) => a.id === saved);
		return valid ? valid.id : guide[0].id;
	});

	// ── Active zone by act (per-profile) ─────────────────────────────────
	const [activeZoneByAct, setActiveZoneByAct] = useState<Record<string, number>>(() =>
		loadZoneByActForProfile(profile)
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
		localStorage.setItem(getProgressKey(profile), JSON.stringify(completed));
	}, [completed, profile]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-active-act", activeActId);
	}, [activeActId]);

	useEffect(() => {
		localStorage.setItem(getZoneByActKey(profile), JSON.stringify(activeZoneByAct));
	}, [activeZoneByAct, profile]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-profile", profile);
	}, [profile]);

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
		const savedZoneRaw = localStorage.getItem(getZoneByActKey(profile));
		if (savedZoneRaw && savedZoneRaw !== "{}") return; // honor existing position

		const savedProgressRaw = localStorage.getItem(getProgressKey(profile));
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
	}, [profile, guide]);

	// ── Autodetect zone subscription ──────────────────────────────────────
	// `lastDetectedZone` is recorded for every Client.txt zone-entered event,
	// matched or not, so the Settings panel can show the user that the tail
	// is actually running (and what raw zone name PoE2 wrote, for debugging).
	const [lastDetectedZone, setLastDetectedZone] = useState<{ name: string; at: number } | null>(null);
	useEffect(() => {
		// We always record the last detected zone for diagnostics, but only
		// auto-switch the overlay when autodetect is on.
		const unsub = window.overlay?.onZoneEntered((name) => {
			setLastDetectedZone({ name, at: Date.now() });
			if (autodetect !== "on") return;
			const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
			const hit = zoneIndex.get(normalize(name));
			if (!hit) return; // hideout, side area, town — silently ignore
			setActiveActId(hit.actId);
			setActiveZoneByAct((prev) => ({ ...prev, [hit.actId]: hit.zoneIndex }));
		});
		return unsub ?? undefined;
	}, [autodetect, zoneIndex]);

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
		// Flush current progress is already handled by the persistence effect.
		// Load the new profile's progress and zone-by-act.
		setProfile(p);
		setCompleted(loadProgressForProfile(p));
		setActiveZoneByAct(loadZoneByActForProfile(p));
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
		localStorage.removeItem(getProgressKey(profile));
		localStorage.removeItem(getZoneByActKey(profile));
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
			{settingsOpen ? (
				<SettingsPanel
					profile={profile}
					autodetect={autodetect}
					clientLogPath={clientLogPath}
					defaultClientLogPath={defaultClientLogPath}
					lastDetectedZone={lastDetectedZone}
					focusTracking={focusTracking}
					onProfileChange={handleProfileChange}
					onAutodetectChange={setAutodetect}
					onClientLogPathChange={handleClientLogPathChange}
					onFocusTrackingChange={handleFocusTrackingChange}
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
