# Screenshot kit

These are the images the project README expects. PNG, ideally captured at 1× DPI on a 1080p+ display, no watermarks.

| File | What to capture |
|---|---|
| `hero.png` | The overlay over a clean PoE2 backdrop (or just a dark desktop). Aim for ~420 px wide on disk — it's the top banner. Profile = Monk, Act 1 or Act 2, gems panel collapsed. |
| `overlay-zone.png` | Profile = Monk, Act 1 / Clearfell. Zone card visible with target level badge and a couple of tasks ticked. Crop to the overlay's bounding box. |
| `overlay-gems.png` | Profile = Monk, Act 2. **Skill Gems · Act 2** panel expanded, notes expanded. Shows the gem grid + a How to Play section. |

## How to capture

The overlay is a transparent always-on-top window — Windows' built-in **Snipping Tool** (`Win + Shift + S`) handles it cleanly:

1. Open ExileXP.
2. Set up the state you want to capture (profile, act, gems panel open/closed, etc.).
3. `Win + Shift + S` → rectangular snip around the overlay → it's on your clipboard.
4. Paste into Paint / Photos / IrfanView / etc., save as PNG into this folder.

## Cropping & background

If you want a darker, more "branded" look, paste the snip onto a 50% darker background before saving (the overlay's transparent regions will otherwise show whatever was behind when you captured). Optional — bare snips are fine for v0.1.0.
