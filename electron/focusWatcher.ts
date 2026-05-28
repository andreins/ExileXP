import { spawn, type ChildProcess } from "node:child_process";
import { BrowserWindow } from "electron";

// Process names (case-insensitive substring match) that count as the "game"
// for visibility purposes. Add to this list if PoE2 ships under a different
// binary name in future patches.
const POE_NAMES = ["pathofexile2", "pathofexilesteam", "pathofexile"];

// We also keep the overlay visible whenever its own window is foreground
// (so the user can interact with Settings without it vanishing).
const SELF_NAMES = ["exilexp", "electron"];

// Inline PowerShell that prints the foreground window's process name once
// per tick on stdout. Lives as a long-running child so we don't pay the
// PowerShell-startup cost on every poll.
const PS_SCRIPT = `
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class WT {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
}
"@
while ($true) {
    $procId = [uint32]0
    $h = [WT]::GetForegroundWindow()
    [WT]::GetWindowThreadProcessId($h, [ref]$procId) | Out-Null
    try {
        $p = Get-Process -Id $procId -ErrorAction Stop
        Write-Output $p.ProcessName
    } catch {
        Write-Output "_"
    }
    [Console]::Out.Flush()
    Start-Sleep -Milliseconds 750
}
`;

export function createFocusWatcher(
	getWindow: () => BrowserWindow | null,
	isUserHidden: () => boolean = () => false,
) {
	let child: ChildProcess | null = null;
	let enabled = false;
	let lineBuffer = "";

	function handleProcessName(raw: string) {
		const win = getWindow();
		if (!win || !enabled) return;
		// Respect a manual Ctrl+Shift+H hide — never re-show until the user
		// presses the shortcut again to clear the pin.
		if (isUserHidden()) {
			if (win.isVisible()) win.hide();
			return;
		}
		const name = raw.trim().toLowerCase();
		if (!name) return;

		const isPoE = POE_NAMES.some((n) => name.includes(n));
		const isSelf = SELF_NAMES.some((n) => name.includes(n));
		const shouldShow = isPoE || isSelf;

		if (shouldShow) {
			if (!win.isVisible()) win.showInactive(); // showInactive keeps PoE focused
		} else {
			if (win.isVisible()) win.hide();
		}
	}

	function start() {
		if (process.platform !== "win32") return;
		if (child) return;
		try {
			child = spawn(
				"powershell.exe",
				["-NoProfile", "-NonInteractive", "-Command", PS_SCRIPT],
				{ windowsHide: true }
			);
		} catch (e) {
			console.warn("[focusWatcher] failed to spawn PowerShell:", e);
			child = null;
			return;
		}
		child.stdout?.on("data", (chunk: Buffer) => {
			lineBuffer += chunk.toString("utf8");
			const lines = lineBuffer.split(/\r?\n/);
			lineBuffer = lines.pop() ?? "";
			for (const line of lines) handleProcessName(line);
		});
		child.on("exit", () => {
			child = null;
		});
	}

	function stop() {
		if (child) {
			try {
				child.kill();
			} catch {
				/* ignore */
			}
			child = null;
		}
		// Always re-show on disable so user isn't left with a hidden overlay.
		const win = getWindow();
		if (win && !win.isVisible()) win.show();
	}

	return {
		setEnabled(next: boolean) {
			enabled = next;
			if (next) start();
			else stop();
		},
		dispose() {
			enabled = false;
			stop();
		},
	};
}
