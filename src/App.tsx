import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type { ActId } from "./types/guide";
import { guide } from "./data/acts/index";
import OverlayHeader from "./components/OverlayHeader";
import ActTabs from "./components/ActTabs";
import ProgressStrip from "./components/ProgressStrip";
import ZoneCard from "./components/ZoneCard";
import ZoneNav from "./components/ZoneNav";

const STORAGE_VERSION = "2";

function migrateProgress(raw: Record<string, boolean>): Record<string, boolean> {
	const allTaskIds = new Set(guide.flatMap((act) => act.zones.flatMap((z) => z.tasks.map((t) => t.id))));
	const migrated: Record<string, boolean> = {};
	for (const [oldKey, value] of Object.entries(raw)) {
		if (allTaskIds.has(oldKey)) {
			migrated[oldKey] = value;
		} else {
			const match = [...allTaskIds].find((id) => id.endsWith(`-${oldKey}`));
			if (match) migrated[match] = value;
		}
	}
	return migrated;
}

function loadProgress(): Record<string, boolean> {
	try {
		const version = localStorage.getItem("poe2-overlay-version");
		const raw = localStorage.getItem("poe2-overlay-progress");
		if (!raw) return {};
		const parsed = JSON.parse(raw) as Record<string, boolean>;
		if (version === STORAGE_VERSION) return parsed;
		const migrated = migrateProgress(parsed);
		localStorage.setItem("poe2-overlay-progress", JSON.stringify(migrated));
		localStorage.setItem("poe2-overlay-version", STORAGE_VERSION);
		return migrated;
	} catch {
		return {};
	}
}

function App() {
	const [completed, setCompleted] = useState<Record<string, boolean>>(loadProgress);

	const [activeActId, setActiveActId] = useState<ActId>(() => {
		const saved = localStorage.getItem("poe2-overlay-active-act");
		const valid = guide.find((a) => a.id === saved);
		return valid ? valid.id : guide[0].id;
	});

	const [activeZoneByAct, setActiveZoneByAct] = useState<Record<string, number>>(() => {
		try {
			const raw = localStorage.getItem("poe2-overlay-active-zone-by-act");
			return raw ? (JSON.parse(raw) as Record<string, number>) : {};
		} catch {
			return {};
		}
	});

	const [clickThrough, setClickThrough] = useState(false);

	const activeAct = useMemo(() => guide.find((a) => a.id === activeActId) ?? guide[0], [activeActId]);
	const activeZoneIndex = activeZoneByAct[activeAct.id] ?? 0;
	const activeZone = activeAct.zones[activeZoneIndex];

	const isZoneDone = activeZone
		? activeZone.tasks.length > 0 && activeZone.tasks.every((t) => completed[t.id])
		: false;

	useEffect(() => {
		localStorage.setItem("poe2-overlay-progress", JSON.stringify(completed));
	}, [completed]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-active-act", activeActId);
	}, [activeActId]);

	useEffect(() => {
		localStorage.setItem("poe2-overlay-active-zone-by-act", JSON.stringify(activeZoneByAct));
	}, [activeZoneByAct]);

	useEffect(() => {
		return window.overlay?.onClickThroughChanged((value) => setClickThrough(value));
	}, []);

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

	return (
		<div className="app">
			<OverlayHeader clickThrough={clickThrough} onToggleClickThrough={toggleClickThrough} />
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
		</div>
	);
}

export default App;
