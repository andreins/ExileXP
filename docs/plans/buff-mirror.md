# Buff mirror (WeakAuras-style buff duplicator) — design plan

## Context

PoE2's buff bar lives in a fixed top-left position on screen. When a player has a long list of "permanent" buffs (passive auras, league-mechanic buffs, charm effects, etc.) followed by gameplay-relevant ones (Killing Palm power charges, Frost Bomb cooldown, etc.), the gameplay-relevant buffs scroll off the right side of the bar and become hard to read mid-fight.

The user wants ExileXP to **mirror specific buffs to a more visible spot** — e.g., directly under the character — so they can be glanced at without taking eyes off the fight. WeakAuras (WoW) and [Lailloken/Exile-UI](https://github.com/Lailloken/Exile-UI/wiki/Clone-frames) (PoE) do something similar.

The user has already confirmed they're OK with the implementation being TOS-borderline; ExileUI exists publicly, so the precedent is set.

## TOS posture

- **What we'll do**: read pixel data from the user's own monitor via OS-level screen capture APIs, render visually in our own transparent window.
- **What we won't do**: read game memory, inject input, modify game files, automate gameplay.
- This puts us in the same bucket as OBS, ShareX, Discord overlay, ExileUI — overlays that observe but never interact.
- ExileUI [explicitly documents](https://github.com/Lailloken/Exile-UI/wiki/Clone-frames) doing this; their author has been at it for years without sanction. Reasonable signal that GGG isn't enforcing against it.
- We should still add a Settings toggle that's **off by default** (opt-in), and a README disclaimer that "this feature reads from your screen — TOS-permissive but use at your own risk".

## What needs to happen

1. **User tells us**:
   - How many buffs to skip from the left (`skipCount`, the count of "permanent" buffs they don't want mirrored).
   - Optionally: a calibration click to set "where is the top-left corner of buff slot 0 on your screen" so we don't hardcode resolution.
   - Approximate buff icon size (default ~48 px at 1080p, scales with UI scale + resolution — at 1440p closer to 64 px, at 4K ~96 px).
2. **App captures the buff region** of the screen every N ms (4 Hz target).
3. **App slices it** into individual buff icon images.
4. **App detects which slots are populated** (so we don't render empty squares for missing buffs).
5. **App renders the populated, post-skip buffs** in a movable area within the ExileXP overlay window.

## Architecture

### Electron main process: screen capture

- Use `desktopCapturer.getSources({ types: ['screen'] })` to enumerate displays.
- For the primary display, use `nativeImage.createFromBuffer(...)` on the captured frame to crop the buff bar region.
- Crop = `{ x: buffBarX, y: buffBarY, w: iconSize * maxBuffs, h: iconSize }`.
- Throttle to 4 Hz (250 ms between captures). Higher refresh = wasted GPU; lower = stale display.
- Slice the cropped buffer into N `iconSize × iconSize` per-buff images.
- Send each slot's image bytes (as base64 PNG or a `Buffer` over IPC) to the renderer along with a `populated: boolean` flag.

### Populated-slot detection

Two viable approaches; ship the cheap one first.

**A) Pixel-color sampling (cheap, ~95% accurate).**

For each slot, sample 4–8 pixels (corners + center). If all sampled pixels match the buff-bar background color (within a small tolerance), the slot is empty. Otherwise it's populated. Background color in PoE2 is a dark transparent grey; populated slots have saturated colored art.

```ts
function isSlotPopulated(slotImage: ImageData): boolean {
  // Sample 4 corner pixels of the icon area (not the icon border)
  const samples = [
    pixelAt(slotImage, 4, 4),
    pixelAt(slotImage, iconSize - 4, 4),
    pixelAt(slotImage, 4, iconSize - 4),
    pixelAt(slotImage, iconSize - 4, iconSize - 4),
  ];
  // If at least one sample has saturation > threshold, slot is populated.
  return samples.some(s => saturation(s) > 0.25);
}
```

**B) Image-diff against a captured "empty" reference (more reliable, costs a calibration step).**

User clicks "Capture empty buff bar" in Settings while standing in a zone with no buffs. We store that reference image. Slot populated = current diff vs reference > pixel threshold.

Start with A. Add B as a power-user fallback if A misfires.

### Renderer: BuffMirror component

- Props: array of `{ index: number; image: string /* dataUrl */; populated: boolean }`.
- Filters out `index < skipCount`.
- Renders the populated buffs as a horizontal row at the configurable position (default: bottom-center of the overlay window).
- Each buff is a `<img>` tag with `image-rendering: pixelated`.
- Hover shows the index ("Buff 8") so the user can debug if needed.

### Settings UI

- New "Buff mirror" section, gated behind a master `Show buff mirror` checkbox (default OFF).
- When enabled:
  - **Skip count**: numeric input (0–20, default 7 per the user's screenshot).
  - **Icon size**: dropdown (`48 / 64 / 96 / custom px`) — auto-pick based on detected resolution.
  - **Calibrate buff-bar position**: button that switches the overlay into "calibration mode" — the user clicks the top-left pixel of buff slot 0 on their screen, and we record `(buffBarX, buffBarY)`. Cancel with Esc.
  - **Mirror position**: dropdown (`Below overlay header / Custom drag`) — for v1, just put it inside the overlay.
- Persist all values in `localStorage` under `poe2-overlay-buffmirror:*`.

## Files

| New | Purpose |
|---|---|
| `electron/buffCapture.ts` | Screen-capture loop, region crop, slot slicing, populated detection. Sends per-slot data via new IPC `overlay:buff-frame`. |
| `src/components/BuffMirror.tsx` | Renders the row of mirrored buff icons. Subscribed to `onBuffFrame`. |

| Edited | Why |
|---|---|
| `electron/main.ts` | Instantiate `buffCapture`, wire IPC, start/stop based on Settings toggle. |
| `electron/preload.cts` | Expose `setBuffMirrorEnabled`, `setBuffMirrorConfig`, `onBuffFrame`. |
| `src/global.d.ts` | Type the new API. |
| `src/App.tsx` | Render `<BuffMirror>` when enabled. |
| `src/components/SettingsPanel.tsx` | New "Buff mirror" section. |
| `src/App.css` | Buff row styling. |

## Open questions

These are the items I'd want to nail down with the user before writing code:

1. **Where does the mirror live?** Inside the overlay window, or in a *separate* small transparent always-on-top window the user can drag anywhere? The latter is more useful ("put it under my character") but doubles the Electron-window code.
2. **At 1440p, what's PoE2's actual buff icon size + bar position?** Worth a one-time calibration screenshot from the user to set the default constants.
3. **Does PoE2's UI scale setting move the buff bar?** If yes, the calibration is per-UI-scale; the user can recalibrate.
4. **TOS messaging in the README?** I'd add a short paragraph: "this feature reads pixels from your monitor — not memory. ExileUI does similar. Use at your own risk; we recommend keeping it off when playing leagues you care about preserving access to."

## Estimate

- Phase 1 (capture loop + IPC plumbing + Settings toggle + basic mirror rendering): ~1 evening.
- Phase 2 (calibration UI + populated-slot detection): ~1 evening.
- Phase 3 (movable separate window): ~half day if we decide to go that route.

## Recommendation

**Defer until v0.2.** The feature is well-scoped but introduces non-trivial Electron screen-capture code, OS permission prompts, and TOS surface area. The existing leveling overlay is the primary value prop; the buff mirror is enhancement. Let v0.1 land, gather community feedback, then build this when there's signal that people want it (and that GGG isn't sanctioning ExileUI-like tools).
