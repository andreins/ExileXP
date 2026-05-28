import { useEffect, useRef, useState } from "react";
import type { ProfileId } from "../types/guide";
import { profiles } from "../data/profiles/index";

function formatAgo(at: number): string {
	const s = Math.max(0, Math.round((Date.now() - at) / 1000));
	if (s < 60) return `${s}s ago`;
	if (s < 3600) return `${Math.round(s / 60)}m ago`;
	return `${Math.round(s / 3600)}h ago`;
}

type CharacterRecord = { class: ProfileId; createdAt: number };

type Props = {
	profile: ProfileId;
	autodetect: "on" | "off";
	clientLogPath: string;
	defaultClientLogPath: string;
	lastDetectedZone: { name: string; at: number; unmapped?: boolean } | null;
	focusTracking: "on" | "off";
	learnedMap: Record<string, string>;
	characters: Record<string, CharacterRecord>;
	activeCharacter: string;
	onProfileChange: (p: ProfileId) => void;
	onCharacterChange: (name: string) => void;
	onDeleteCharacter: (name: string) => void;
	onAutodetectChange: (v: "on" | "off") => void;
	onClientLogPathChange: (p: string) => void;
	onFocusTrackingChange: (v: "on" | "off") => void;
	onDeleteLearned: (raw: string) => void;
	onClearAllLearned: () => void;
	onResetProfile: () => void;
	onResetAll: () => void;
};

export default function SettingsPanel({
	profile,
	autodetect,
	clientLogPath,
	defaultClientLogPath,
	lastDetectedZone,
	focusTracking,
	learnedMap,
	characters,
	activeCharacter,
	onProfileChange,
	onCharacterChange,
	onDeleteCharacter,
	onAutodetectChange,
	onClientLogPathChange,
	onFocusTrackingChange,
	onDeleteLearned,
	onClearAllLearned,
	onResetProfile,
	onResetAll,
}: Props) {
	const [toast, setToast] = useState<string | null>(null);
	const [importText, setImportText] = useState("");
	const [newCharName, setNewCharName] = useState("");
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function handleAddCharacter() {
		const name = newCharName.trim();
		if (!name) return;
		if (characters[name]) {
			showToast(`Character "${name}" already exists`);
			return;
		}
		onCharacterChange(name);
		setNewCharName("");
		showToast(`Switched to "${name}"`);
	}

	function handleSelectCharacter(name: string) {
		if (name === activeCharacter) return;
		onCharacterChange(name);
	}

	function handleDeleteCharacterClick(name: string) {
		if (!confirm(`Delete character "${name}" and wipe its progress? This can't be undone.`)) return;
		onDeleteCharacter(name);
		showToast(`Deleted "${name}"`);
	}

	// Force re-render every 5s so the "X ago" timestamp updates while the
	// settings panel is open.
	const [, setTick] = useState(0);
	useEffect(() => {
		if (!lastDetectedZone) return;
		const id = setInterval(() => setTick((n) => n + 1), 5000);
		return () => clearInterval(id);
	}, [lastDetectedZone]);

	function showToast(msg: string) {
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		setToast(msg);
		toastTimerRef.current = setTimeout(() => setToast(null), 2000);
	}

	async function handleBrowse() {
		const result = await window.overlay?.pickClientLogPath();
		if (result === null || result === undefined) return; // cancelled
		if (result === "not-found") {
			showToast("Client.txt not found in that folder");
			return;
		}
		onClientLogPathChange(result);
		showToast("Client.txt path updated");
	}

	function handleResetPath() {
		onClientLogPathChange("");
		showToast(defaultClientLogPath ? "Reverted to auto-detected path" : "Cleared override");
	}

	function buildExportPayload() {
		const progress: Record<string, Record<string, boolean>> = {};
		const zoneByAct: Record<string, Record<string, number>> = {};
		for (const { id: profileId } of profiles) {
			const raw = localStorage.getItem(`poe2-overlay-progress:${profileId}`);
			progress[profileId] = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
			const rawZone = localStorage.getItem(`poe2-overlay-active-zone-by-act:${profileId}`);
			zoneByAct[profileId] = rawZone ? (JSON.parse(rawZone) as Record<string, number>) : {};
		}
		return {
			app: "exilexp",
			version: 3,
			exportedAt: new Date().toISOString(),
			profile,
			progress,
			activeZoneByAct: zoneByAct,
			activeActId: localStorage.getItem("poe2-overlay-active-act") ?? "act1",
			settings: {
				autodetect,
				clientLogPath: clientLogPath || null,
			},
		};
	}

	async function handleExport() {
		const payload = buildExportPayload();
		const encoded = btoa(JSON.stringify(payload));
		try {
			await navigator.clipboard.writeText(encoded);
			showToast("Copied to clipboard!");
		} catch {
			showToast("Copy failed — use Ctrl+C from the text below");
		}
	}

	function handleImport() {
		const trimmed = importText.trim();
		if (!trimmed) return;
		try {
			const payload = JSON.parse(atob(trimmed)) as {
				app?: string;
				version?: number;
				progress?: Record<string, Record<string, boolean>>;
				activeZoneByAct?: Record<string, Record<string, number>>;
				activeActId?: string;
				profile?: string;
				settings?: { autodetect?: string; clientLogPath?: string | null };
			};
			if (payload.app !== "exilexp") {
				showToast("Invalid export — not an ExileXP backup");
				return;
			}
			if (typeof payload.version !== "number" || payload.version < 3) {
				showToast("Unsupported version — only v3+ supported");
				return;
			}
			if (!confirm("Import progress? This will overwrite current data and reload.")) return;

			// Write all keys
			if (payload.progress) {
				for (const [profileId, data] of Object.entries(payload.progress)) {
					localStorage.setItem(`poe2-overlay-progress:${profileId}`, JSON.stringify(data));
				}
			}
			if (payload.activeZoneByAct) {
				for (const [profileId, data] of Object.entries(payload.activeZoneByAct)) {
					localStorage.setItem(`poe2-overlay-active-zone-by-act:${profileId}`, JSON.stringify(data));
				}
			}
			if (payload.activeActId) {
				localStorage.setItem("poe2-overlay-active-act", payload.activeActId);
			}
			if (payload.profile) {
				localStorage.setItem("poe2-overlay-profile", payload.profile);
			}
			if (payload.settings) {
				if (payload.settings.autodetect) {
					localStorage.setItem("poe2-overlay-autodetect", payload.settings.autodetect);
				}
				if (payload.settings.clientLogPath != null) {
					localStorage.setItem("poe2-overlay-client-log-path", payload.settings.clientLogPath);
				}
			}
			location.reload();
		} catch {
			showToast("Failed to parse import — is it a valid ExileXP export?");
		}
	}

	function handleResetProfile() {
		if (!confirm(`Reset progress for "${activeCharacter}" (${profile})? Other characters are not affected.`)) return;
		onResetProfile();
	}

	function handleResetAll() {
		if (!confirm("Reset EVERYTHING? All profiles, settings, and progress will be cleared.")) return;
		onResetAll();
	}

	const effectivePath = clientLogPath || defaultClientLogPath || null;
	const isAutoDetected = !clientLogPath && !!defaultClientLogPath;
	// Display only the PoE2 folder — strip the trailing /logs/Client.txt that we use internally.
	const displayFolder = effectivePath
		? effectivePath.replace(/[/\\]logs[/\\]Client\.txt$/i, "")
		: null;

	return (
		<div className="settingsPanel">
			{toast && <div className="settingsToast">{toast}</div>}

			{/* Character */}
			<div className="settingsRow settingsRow--column">
				<span className="settingsLabel">Character</span>
				<div className="settingsPathRow">
					<select
						className="settingsInput"
						value={activeCharacter}
						onChange={(e) => handleSelectCharacter(e.target.value)}
					>
						{Object.keys(characters).length === 0 && (
							<option value={activeCharacter}>{activeCharacter}</option>
						)}
						{Object.entries(characters)
							.sort(([a], [b]) => a.localeCompare(b))
							.map(([name, rec]) => (
								<option key={name} value={name}>
									{name} [{rec.class}]
								</option>
							))}
					</select>
					{characters[activeCharacter] && Object.keys(characters).length > 1 && (
						<button
							className="settingsLinkBtn"
							onClick={(e) => { e.currentTarget.blur(); handleDeleteCharacterClick(activeCharacter); }}
							title={`Delete ${activeCharacter}`}
						>
							Delete
						</button>
					)}
				</div>
				<div className="settingsPathRow">
					<input
						type="text"
						className="settingsInput"
						placeholder="New character name…"
						value={newCharName}
						onChange={(e) => setNewCharName(e.target.value)}
						onKeyDown={(e) => { if (e.key === "Enter") handleAddCharacter(); }}
						maxLength={48}
					/>
					<button
						className="settingsActionBtn"
						onClick={(e) => { e.currentTarget.blur(); handleAddCharacter(); }}
						disabled={!newCharName.trim()}
					>
						Add
					</button>
				</div>
				<span className="settingsMuted">
					Each character has its own progress slot. The class profile below applies to the active character.
				</span>
			</div>

			{/* Profile */}
			<div className="settingsRow">
				<span className="settingsLabel">Class profile</span>
				<div className="settingsSegmented">
					{profiles.map((p) => (
						<button
							key={p.id}
							className={`settingsSegBtn${profile === p.id ? " settingsSegBtn--active" : ""}`}
							onClick={(e) => { e.currentTarget.blur(); onProfileChange(p.id); }}
						>
							{p.label}
						</button>
					))}
				</div>
			</div>

			{/* Autodetect */}
			<div className="settingsRow settingsRow--column">
				<label className="settingsCheckLabel">
					<input
						type="checkbox"
						className="settingsCheckbox"
						checked={autodetect === "on"}
						onChange={(e) => onAutodetectChange(e.target.checked ? "on" : "off")}
					/>
					<span className="settingsLabel">Autodetect zone</span>
				</label>
				<label className="settingsCheckLabel">
					<input
						type="checkbox"
						className="settingsCheckbox"
						checked={focusTracking === "on"}
						onChange={(e) => onFocusTrackingChange(e.target.checked ? "on" : "off")}
					/>
					<span className="settingsLabel">Only show overlay when Path of Exile 2 is focused</span>
				</label>
				{lastDetectedZone ? (
					lastDetectedZone.unmapped ? (
						<span className="settingsMuted">
							Detected unknown area ID:{" "}
							<strong style={{ color: "var(--text-gold)" }}>{lastDetectedZone.name}</strong>
							{" — "}{formatAgo(lastDetectedZone.at)}.<br />
							Close Settings and click the correct zone within 60 s to teach the overlay this mapping.
						</span>
					) : (
						<span className="settingsMuted">
							Last detected: <strong style={{ color: "var(--text-gold)" }}>{lastDetectedZone.name}</strong>
							{" — "}{formatAgo(lastDetectedZone.at)}
						</span>
					)
				) : (
					<span className="settingsMuted">
						No zone detected yet. Enter or re-enter a zone in PoE2 to verify the tail is working.
					</span>
				)}
			</div>

			{/* Path of Exile 2 folder */}
			<div className="settingsRow settingsRow--column">
				<span className="settingsLabel">Path of Exile 2 folder</span>
				<div className="settingsPathRow">
					<button className="settingsActionBtn" onClick={handleBrowse} title="Pick your Path of Exile 2 install folder — Client.txt is located automatically">
						Browse…
					</button>
					{clientLogPath && (
						<button className="settingsLinkBtn" onClick={handleResetPath} title="Revert to auto-detected">
							Reset
						</button>
					)}
				</div>
				{displayFolder ? (
					<span className="settingsMuted" title={effectivePath ?? undefined}>
						{isAutoDetected ? "Auto-detected: " : "Manual: "}{displayFolder}
					</span>
				) : (
					<span className="settingsMuted">Not detected — click Browse and pick your Path of Exile 2 install folder.</span>
				)}
			</div>

			{/* Export */}
			<div className="settingsDivider" />
			<div className="settingsRow">
				<span className="settingsLabel">Export progress</span>
				<button className="settingsActionBtn" onClick={handleExport}>
					Copy to clipboard
				</button>
			</div>

			{/* Import */}
			<div className="settingsRow settingsRow--column">
				<span className="settingsLabel">Import progress</span>
				<textarea
					className="settingsTextarea"
					placeholder="Paste export string here…"
					value={importText}
					onChange={(e) => setImportText(e.target.value)}
					rows={3}
					spellCheck={false}
				/>
				<button
					className="settingsActionBtn settingsActionBtn--full"
					onClick={handleImport}
					disabled={!importText.trim()}
				>
					Import
				</button>
			</div>

			{/* Reset */}
			<div className="settingsDivider" />
			<div className="settingsRow settingsRow--spaced">
				<button className="settingsDangerBtn" onClick={handleResetProfile}>
					Reset "{activeCharacter}"
				</button>
				<button className="settingsDangerBtn settingsDangerBtn--all" onClick={handleResetAll}>
					Reset everything
				</button>
			</div>

			{/* Learned zone mappings */}
			{Object.keys(learnedMap).length > 0 && (
				<>
					<div className="settingsDivider" />
					<div className="settingsRow settingsRow--column">
						<div className="settingsRow settingsRow--spaced" style={{ alignItems: "center" }}>
							<span className="settingsLabel">Learned zone mappings ({Object.keys(learnedMap).length})</span>
							<button
								className="settingsLinkBtn"
								onClick={(e) => { e.currentTarget.blur(); if (confirm("Clear all runtime-learned zone mappings? Static built-in mappings are not affected.")) onClearAllLearned(); }}
								title="Wipe every runtime-learned mapping"
							>
								Clear all
							</button>
						</div>
						<div className="learnedList">
							{Object.entries(learnedMap)
								.sort(([a], [b]) => a.localeCompare(b))
								.map(([raw, name]) => (
									<div className="learnedRow" key={raw}>
										<code className="learnedRow__raw">{raw}</code>
										<span className="learnedRow__arrow">→</span>
										<span className="learnedRow__name">{name}</span>
										<button
											className="learnedRow__delete"
											onClick={(e) => { e.currentTarget.blur(); onDeleteLearned(raw); }}
											title={`Forget ${raw} → ${name}`}
										>
											✕
										</button>
									</div>
								))}
						</div>
						<span className="settingsMuted">
							Built-in mappings always win — these only fire for IDs not in the shipped table.
							If a mapping is wrong, delete it and walk into the zone again to re-teach.
						</span>
					</div>
				</>
			)}

			{/* Credits */}
			<div className="settingsDivider" />
			<div className="settingsRow settingsRow--column settingsCredits">
				<span className="settingsLabel">Credits</span>
				<span className="settingsCredits__line">
					Monk leveling guide by{" "}
					<a
						className="settingsLink"
						href="https://www.youtube.com/@FGKorbyn21"
						target="_blank"
						rel="noopener noreferrer"
					>
						@FGKorbyn21
					</a>
					.
				</span>
				<span className="settingsCredits__line">
					Base leveling guide derived from{" "}
					<a
						className="settingsLink"
						href="https://domistae.github.io/poe2-leveling/"
						target="_blank"
						rel="noopener noreferrer"
					>
						domistae's poe2-leveling
					</a>
					.
				</span>
			</div>
		</div>
	);
}
