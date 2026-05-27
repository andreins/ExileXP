import { useEffect, useRef, useState } from "react";
import type { ProfileId } from "../types/guide";
import { profiles } from "../data/profiles/index";

type Props = {
	profile: ProfileId;
	autodetect: "on" | "off";
	clientLogPath: string;
	defaultClientLogPath: string;
	onProfileChange: (p: ProfileId) => void;
	onAutodetectChange: (v: "on" | "off") => void;
	onClientLogPathChange: (p: string) => void;
	onResetProfile: () => void;
	onResetAll: () => void;
};

export default function SettingsPanel({
	profile,
	autodetect,
	clientLogPath,
	defaultClientLogPath,
	onProfileChange,
	onAutodetectChange,
	onClientLogPathChange,
	onResetProfile,
	onResetAll,
}: Props) {
	const [pathInput, setPathInput] = useState(clientLogPath);
	const [toast, setToast] = useState<string | null>(null);
	const [importText, setImportText] = useState("");
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setPathInput(clientLogPath);
	}, [clientLogPath]);

	function showToast(msg: string) {
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		setToast(msg);
		toastTimerRef.current = setTimeout(() => setToast(null), 2000);
	}

	function handlePathBlur() {
		onClientLogPathChange(pathInput);
	}

	function handlePathKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			(e.target as HTMLInputElement).blur();
		}
	}

	function handleResetPath() {
		setPathInput("");
		onClientLogPathChange("");
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
		if (!confirm(`Reset all progress for the ${profile} profile?`)) return;
		onResetProfile();
	}

	function handleResetAll() {
		if (!confirm("Reset EVERYTHING? All profiles, settings, and progress will be cleared.")) return;
		onResetAll();
	}

	const placeholder = defaultClientLogPath
		? defaultClientLogPath
		: "e.g. C:/Program Files (x86)/Steam/steamapps/common/Path of Exile 2/logs/Client.txt";

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
			<div className="settingsRow">
				<label className="settingsCheckLabel">
					<input
						type="checkbox"
						className="settingsCheckbox"
						checked={autodetect === "on"}
						onChange={(e) => onAutodetectChange(e.target.checked ? "on" : "off")}
					/>
					<span className="settingsLabel">Autodetect zone</span>
				</label>
			</div>

			{/* Client.txt path */}
			<div className="settingsRow settingsRow--column">
				<span className="settingsLabel">Client.txt path</span>
				<div className="settingsPathRow">
					<input
						type="text"
						className="settingsInput"
						value={pathInput}
						placeholder={placeholder}
						onChange={(e) => setPathInput(e.target.value)}
						onBlur={handlePathBlur}
						onKeyDown={handlePathKeyDown}
						spellCheck={false}
					/>
					{pathInput && (
						<button className="settingsLinkBtn" onClick={handleResetPath} title="Reset to default">
							Reset
						</button>
					)}
				</div>
				{defaultClientLogPath && !clientLogPath && (
					<span className="settingsMuted">Using default: {defaultClientLogPath}</span>
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
					Reset {profile} profile
				</button>
				<button className="settingsDangerBtn settingsDangerBtn--all" onClick={handleResetAll}>
					Reset everything
				</button>
			</div>
		</div>
	);
}
