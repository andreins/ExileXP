# Changelog

All notable changes to ExileXP are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-05-27

Initial public release.

### Added
- Standard and Monk class profiles with curated leveling content for Acts 1–4 + Interludes.
- Profile registry — adding a new class is a single file under `src/data/profiles/` plus a registry entry.
- Per-act **Skill Gems** panel (Monk only) — gem grid + support gems + collapsible Skill Gem Order / How to Play / Gem Level Up Priority sections. Interludes mirrors the Act 4 gem setup.
- Tempest Bell entries that fill in for Hollow Focus Technique are relabeled to **Hollow Focus** (one in Act 2 / Act 3, one of two in Act 4).
- **Zone autodetect** — Electron main process tails `logs/Client.txt` via `fs.watchFile` (1 s interval, rotation-safe) and pushes zone-entered events to the renderer.
- **Path of Exile 2 folder** picker in Settings (Electron native folder dialog). Default install locations on drives C–H are auto-detected at startup.
- **Click-through hot zone** — the on-screen toggle button stays clickable even with click-through ON, via renderer mousemove hit-tests against `[data-always-interactive]` elements.
- Always-on-top transparent overlay that auto-resizes to fit content via `ResizeObserver`.
- Per-profile progress storage (`poe2-overlay-progress:<profile>`); v2 → v3 storage migration.
- Base64 import/export of all progress + settings via clipboard.
- Per-profile reset and global reset.
- Mark-zone-complete auto-advances to the next zone when autodetect is off.
- Optional tasks render below mandatory ones (stable sort) regardless of authored order.
- "Target Level: N" zone badge.

### Known issues
- Gem icons are CSS-styled letter placeholders. Real PoE2 gem icons are tracked as a follow-up.
- No code signing — Windows SmartScreen will warn on first run. See README for the click-through.
- Auto-update via `electron-updater` is not wired up; users check the Releases page manually.
