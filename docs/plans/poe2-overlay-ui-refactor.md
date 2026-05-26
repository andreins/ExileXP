# PoE2 Overlay UI/Data Refactor

## Current State

**UI**: Everything lives in `src/App.tsx` — types, guide data, all state logic, full JSX (292 lines).  
**Data**: Inline `const guide: Act[]` with Act I (2 zones) and Act II (4 zones); Acts III/IV/Interludes are empty stubs.  
**Styling**: `src/App.css` — flat classes, hardcoded colors, no CSS variables. `src/index.css` is Vite boilerplate, unused by the overlay.  
**State**: Three `useState` + `localStorage` pairs — `completed` (task progress), `activeActId`, `activeZoneByAct`. Zustand is installed but unused.

**Current problems:**
- "Interactive" button does nothing useful in its current position
- Act tabs have no CSS class styling (`.actTabs` not in App.css)
- Prev/Mark Zone Done/Next are unstyled HTML buttons
- No visual distinction for bosses, NPCs, optional steps, rewards
- All types and data inline in App.tsx

## Target Architecture

### Types: `src/types/guide.ts`
```ts
ActId = "act1" | "act2" | "act3" | "act4" | "interludes"
ActGuide  { id, label, title, subtitle?, zones }
ZoneGuide { id, name, level?, tags?, notes?, tasks }
ZoneTag   = "waypoint" | "town" | "required" | "optional" | "boss-zone"
ZoneNote  { type: "info"|"warning"|"tip"|"patch", text }
GuideTask { id, text, required?, optional?, boss?, rewards?, note? }
```

### Data split
```
src/data/acts/act1.ts        ← Act I zones (Riverbank, Clearfell, etc.)
src/data/acts/act2.ts        ← Act II zones (Vastiri, Ardura, Mawdun, etc.)
src/data/acts/act3.ts        ← placeholder, zones: []
src/data/acts/act4.ts        ← placeholder, zones: []
src/data/acts/interludes.ts  ← placeholder, zones: []
src/data/acts/index.ts       ← export const guide: ActGuide[]
```

Task IDs are prefixed: `"act1-riverbank-bloated-miller"` (was `"riverbank-bloated-miller"`).

### Components
- `OverlayHeader` — title + click-through indicator; container is draggable, buttons are no-drag
- `ActTabs` — horizontal tab strip, replaces Interactive button
- `ProgressStrip` — thin bar showing zone position within the act
- `ZoneCard` — zone header + notes + task list
- `TaskRow` — single task: checkbox, styled text, reward badges
- `ZoneNav` — Prev / Complete Zone / Next in compact PoE style

### localStorage keys
| Key | Value |
|-----|-------|
| `poe2-overlay-progress` | `Record<taskId, boolean>` |
| `poe2-overlay-active-act` | `ActId` string |
| `poe2-overlay-active-zone-by-act` | `Record<ActId, number>` |
| `poe2-overlay-version` | `"2"` (migration marker) |

**Migration**: On load, if version ≠ 2, attempt to re-key old progress by matching old bare IDs to new prefixed IDs. Wrap in try/catch; if it fails, old progress is silently dropped.

## Target UX

- Act tabs at the top: `Act I | Act II | Act III | Act IV | Interludes`
- One zone visible at a time (overlay mode)
- Individual task checkboxes persist per task
- "Complete Zone" marks all zone tasks done; pressing again unmarks them
- Prev / Next navigate zones within the act; disabled at boundaries
- ProgressStrip shows current zone position

## Styling Direction (Domistae-inspired PoE2)

**CSS variables** (defined on `:root` in App.css):
```
--bg-overlay  rgba(18,13,8,0.92)     dark background
--bg-header   rgba(43,31,19,0.92)    header/tab strip
--bg-panel    rgba(28,22,15,0.85)    zone panel
--border-gold rgba(194,139,61,0.4)   gold border
--text-gold   #e6b96e                section headers
--text-body   #c7b8a0                muted tan body
--text-muted  #8c806f                hints/subtitles
--text-boss   #d44444                boss task names
--text-npc    #6b9ed6                NPC/location names
--accent-bronze #d89b4b             buttons/accents
```

- Zone names: serif/small-caps (`Palatino Linotype` → Georgia fallback)
- Task rows: dense 6px vertical padding, subtle top border
- Reward badges: small outlined pills
- ZoneNav buttons: bronze border, semi-transparent dark fill — no grey
- Act tabs: gold bottom-border on active, muted text on inactive
- No Bootstrap-looking controls anywhere

## Electron Constraints

- `.topbar` / OverlayHeader container must keep `-webkit-app-region: drag`
- All buttons, tabs, and checkboxes inside must have `-webkit-app-region: no-drag`
- `html, body, #root` must keep `background: transparent`
- `.app` keeps `border-radius`, gold border, semi-transparent dark bg
- Ctrl+Shift+X → click-through toggle (IPC, no changes to main.ts/preload.ts)
- Ctrl+Shift+H → hide/show (no changes needed)

## Acceptance Criteria

- [ ] `App.tsx` contains no inline guide data or type definitions
- [ ] `src/types/guide.ts` exports all shared types
- [ ] 5 act files exist and export typed `ActGuide` objects
- [ ] Act tabs show: Act I | Act II | Act III | Act IV | Interludes
- [ ] Switching act tabs changes the visible zone
- [ ] One zone visible at a time
- [ ] Task checkboxes work and persist across reload
- [ ] Complete Zone marks all tasks done; toggling unmarks them
- [ ] Prev/Next work; disabled at first/last zone
- [ ] ProgressStrip shows zone position within act
- [ ] Empty acts show clean empty state
- [ ] No generic grey buttons anywhere
- [ ] Zone names use serif/small-caps
- [ ] Boss tasks have red/orange text
- [ ] Reward badges render as outlined pills
- [ ] Topbar remains draggable; interactive elements are no-drag
- [ ] Ctrl+Shift+X click-through works
- [ ] Ctrl+Shift+H hide/show works
- [ ] Transparent overlay background preserved
- [ ] Old progress migrated or clearly documented as reset
- [ ] `npm run build` passes with no TypeScript errors
