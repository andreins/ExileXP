import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

	useEffect(() => {
		// Fetch the default path to show as placeholder in the settings panel
		window.overlay?.getDefaultClientLogPath().then((p) => {
			if (p) setDefaultClientLogPath(p);
		});
	}, []);

	// ── Autodetect zone subscription ──────────────────────────────────────
	useEffect(() => {
		if (autodetect !== "on") return;
		const unsub = window.overlay?.onZoneEntered((name) => {
			const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
			const hit = zoneIndex.get(normalize(name));
			if (!hit) return; // hideout, side area, town — silently ignore
			setActiveActId(hit.actId);
			setActiveZoneByAct((prev) => ({ ...prev, [hit.actId]: hit.zoneIndex }));
		});
		return unsub ?? undefined;
	}, [autodetect, zoneIndex]);

	// ── Height sync ───────────────────────────────────────────────────────
	useLayoutEffect(() => {
		const el = appRef.current;
		if (!el) return;
		const h = el.offsetHeight;
		if (h > 0) window.overlay?.setWindowHeight(h);
	});

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
		setCompleted((c) => {
			const next = { ...c };
			for (const task of activeZone.tasks) next[task.id] = !isZoneDone;
			return next;
		});
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
				clickThrough={clickThrough}
				onToggleClickThrough={toggleClickThrough}
				settingsOpen={settingsOpen}
				onOpenSettings={() => setSettingsOpen((o) => !o)}
			/>
			{settingsOpen && (
				<SettingsPanel
					profile={profile}
					autodetect={autodetect}
					clientLogPath={clientLogPath}
					defaultClientLogPath={defaultClientLogPath}
					onProfileChange={handleProfileChange}
					onAutodetectChange={setAutodetect}
					onClientLogPathChange={handleClientLogPathChange}
					onResetProfile={handleResetProfile}
					onResetAll={handleResetAll}
				/>
			)}
			<ActTabs acts={guide} activeActId={activeActId} onSelectAct={setActiveActId} />
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
				/>
			)}

			<GemsPanel act={activeActId} profile={profile} />
		</div>
	);
}

export default App;
