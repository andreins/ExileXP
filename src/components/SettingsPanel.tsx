import { useEffect, useRef, useState } from "react";
import type { ProfileId } from "../types/guide";
import { profiles } from "../data/profiles/index";

function formatAgo(at: number): string {
	const s = Math.max(0, Math.round((Date.now() - at) / 1000));
	if (s < 60) return `${s}s ago`;
	if (s < 3600) return `${Math.round(s / 60)}m ago`;
	return `${Math.round(s / 3600)}h ago`;
}

type Props = {
	profile: ProfileId;
	autodetect: "on" | "off";
	clientLogPath: string;
	defaultClientLogPath: string;
	currentZoneName: string | null;
	lastDetectedZone: { name: string; at: number } | null;
	onProfileChange: (p: ProfileId) => void;
	onAutodetectChange: (v: "on" | "off") => void;
	onClientLogPathChange: (p: string) => void;
	onCatchUp: () => void;
	onResetProfile: () => void;
	onResetAll: () => void;
};

export default function SettingsPanel({
	profile,
	autodetect,
	clientLogPath,
	defaultClientLogPath,
	currentZoneName,
	lastDetectedZone,
	onProfileChange,
	onAutodetectChange,
	onClientLogPathChange,
	onCatchUp,
	onResetProfile,
	onResetAll,
}: Props) {
	const [toast, setToast] = useState<string | null>(null);
	const [importText, setImportText] = useState("");
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

	function handleCatchUp() {
		const target = currentZoneName ? ` "${currentZoneName}"` : "";
		if (!confirm(`Mark every task in every zone BEFORE${target} as complete? This is the quick way to record existing progress when you start using the overlay mid-campaign.`)) return;
		onCatchUp();
		showToast("Caught up to current zone");
	}

	function handleResetProfile() {
		if (!confirm(`Reset all progress for the ${profile} profile?`)) return;
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

			{/* Profile */}
			<div className="settingsRow">
				<span className="settingsLabel">Profile</span>
				<div className="settingsSegmented">
					{profiles.map((p) => (
						<button
							key={p.id}
							className={`settingsSegBtn${profile === p.id ? " settingsSegBtn--active" : ""}`}
							onClick={() => onProfileChange(p.id)}
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
				{lastDetectedZone ? (
					<span className="settingsMuted">
						Last detected: <strong style={{ color: "var(--text-gold)" }}>{lastDetectedZone.name}</strong>
						{" — "}{formatAgo(lastDetectedZone.at)}
					</span>
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

			{/* Catch up to current zone */}
			<div className="settingsDivider" />
			<div className="settingsRow settingsRow--column">
				<button className="settingsActionBtn settingsActionBtn--full" onClick={handleCatchUp}>
					Mark all tasks done up to current zone
				</button>
				<span className="settingsMuted">
					{currentZoneName
						? `Marks every task before "${currentZoneName}" as complete. Useful when you start the overlay mid-campaign.`
						: "Marks every task before the active zone as complete."}
				</span>
			</div>

			{/* Reset */}
			<div className="settingsDivider" />
			<div className="settingsRow settingsRow--spaced">
				<button className="settingsDangerBtn" onClick={handleResetProfile}>
					Reset {profile} profile
				</button>
				<button className="settingsDangerBtn settingsDangerBtn--all" onClick={handleResetAll}>
					Reset everything
				</button>
			</div>

			{/* Credits */}
			<div className="settingsDivider" />
			<div className="settingsRow settingsRow--column">
				<span className="settingsLabel">Credits</span>
				<span className="settingsMuted">
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
				<span className="settingsMuted">
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
