# ExileXP

A Path of Exile 2 leveling overlay — class profiles, skill gem guide, and Client.txt zone autodetect.

![screenshot](docs/screenshot.png)

> _Screenshot coming soon. Drop one in `docs/screenshot.png` before tagging the first GitHub release._

## Features

- **Class profiles** — Standard (generic) and Monk (Invoker / quarterstaff). More classes coming. Profiles are full rulesets — they don't stack with each other.
- **Curated leveling guide** for Acts 1–4, updated for the 0.5 patch (Verisium Runeforging, Fate of the Vaal, pressure pads, Dreadnought rework, etc.).
- **Per-act Skill Gems panel** (Monk) — skill + support gem layouts with mapping / bossing / level-up priority notes.
- **Zone autodetect** — tails `logs/Client.txt` and switches zones automatically as you play.
- **Click-through toggle** — let your clicks pass through to the game, with the toggle button itself always clickable.
- **Per-profile progress**, base64 import/export, per-profile and global reset.
- **Always-on-top** transparent overlay that resizes itself to fit its content.

## System requirements

- Windows 10 or 11 (x64)
- Path of Exile 2 (Steam or standalone)

## Install

1. Download the latest `ExileXP-<version>-portable.exe` from the [Releases](https://github.com/Naean/ExileXP/releases) page.
2. Double-click to run. **No install — no uninstaller — no registry footprint.** Settings live in `%APPDATA%/ExileXP/`.

> **First-run SmartScreen warning:** the .exe is not code-signed (paid certs cost $90+/yr — skipped to keep the project free). Windows will show "Windows protected your PC" on first launch. Click **More info → Run anyway**.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl + Shift + X` | Toggle click-through (overlay still visible, mouse passes through) |
| `Ctrl + Shift + H` | Show / hide the overlay |

The on-screen ◎/⊘ button toggles click-through too — and it stays clickable even when click-through is on (hover it while click-through is enabled to temporarily wake the cursor).

## Profiles

- **Standard** — generic campaign guide derived from community references.
- **Monk** — Invoker / Bell quarterstaff. Adds curated tasks per zone, a Skill Gems panel per act (Acts 1–4 + Interludes), and class-specific notes (Frost Bomb timing, Siphoning Strike → Falling Thunder combos, Hollow Focus / Tempest Bell guidance, etc.).

Switch profiles in **Settings** (the gear icon, top-right). Each profile has independent progress.

## Zone autodetect

In Settings → **Path of Exile 2 folder**, click **Browse…** and pick your PoE2 install folder (the one that contains `logs/`). ExileXP looks up `Client.txt` from there and tails it for `You have entered <zone>` events. The overlay switches to the matching zone card automatically.

Default install locations (Steam + standalone, drives C–H) are auto-detected on first launch — most users don't need to touch this.

Toggle **Autodetect zone** off if you'd rather drive zones manually with the **Next / Prev** buttons.

## Development

```bash
npm install
npm run dev        # Vite renderer + Electron main, hot reload
```

Building from source:

```bash
npm run build      # Type-check + Vite production build + Electron main TS
npm run dist       # Produce release/ExileXP-<version>-portable.exe
```

## Roadmap

- More class profiles (Witch, Ranger, Warrior, etc.).
- Real PoE2 gem icons (currently colored letter placeholders).
- Per-zone EXP tracking and pace overlay.
- macOS / Linux builds if there's demand.

## Credits

- **[Domistae / poe2-leveling](https://github.com/domistae/poe2-leveling)** — base leveling structure and zone curation that the Standard profile is modeled on (MIT-licensed).
- **Grinding Gear Games** — Path of Exile 2.

## License

[MIT](LICENSE) © 2026 Naean
