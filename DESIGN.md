# Osteon Design Language

> Extracted from `index.html` (authored CSS custom properties and rules, plus rendered screenshots of Home, 3D viewer, Muscle lab, Joint lab and quiz at 390px, and Home at 1280px). Coverage: flashcards, exam practice, Cartilage/Bone/Microanatomy labs inspected for overflow only, not catalogued.

## Visual Theme
**Dark, clinical, luminous study tool.** Near-black canvas, a single electric-cyan accent, a literary serif for headings against a clean sans for body, and a glowing 3D skeleton as the hero. Feels like a scan room at night. A light theme exists and mirrors the dark one with a deeper teal accent.

## Color Palette
### Neutrals (dark / light)
| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | #05070A | #EDF0F3 | page background |
| `--surface` | #0D1116 | #F8F9FB | cards, inputs, options |
| `--ink` | #F3EFE6 | #131B2B | primary text (warm off-white in dark) |
| `--muted` | #8F98A5 | #5B6677 | secondary text, labels |
| `--line` | rgba(225,232,240,.10) | #D3D9E1 | borders, dividers |

### Brand / Primary
| Token | Dark | Light | Role |
|---|---|---|---|
| `--accent` | #22E5F2 | #0B7A82 | primary actions, active state, glow |
| `--accent-ink` | #021A1C | #FFFFFF | text on accent |
| `--accent-soft` | rgba(34,229,242,.12) | #D6EDEE | selected-chip fill, tag fill |

### Semantic
| Role | Dark | Light |
|---|---|---|
| ok (correct) | #3FD08E | #1A7743 |
| bad (wrong) | #FF6B7A | #C23030 |
| highlight (hl) | #FF7A4D | #E8542B |

### Anatomy palette (domain colours, used in 3D and diagrams)
bone #D8CDB4, muscle #C0706A, joint #E0BC4C, covered #2FA9A8, silhouette #0F141B.

## Typography
**Families:** Instrument Serif (display, headings, quiz questions) + Instrument Sans (body, UI). Loaded from Google Fonts and cached by the service worker; fallbacks Georgia / system-ui.
**Scale:** ad-hoc, no modular ratio. Sizes in use (by frequency): 13, 12.5, 14, 12, 11.5, 13.5, 16, 11, 20, 15, 10.5, 18, plus hero `clamp(40px, 8vw, 62px)` and `clamp(46px, 7.5vw, 76px)`.
| Role | Size | Notes |
|---|---|---|
| Hero h1 | 44px mobile, up to 76px desktop | serif, gradient fill |
| Section / card title | 18-20px | serif |
| Body | 15px, line-height 1.5 | sans |
| Control / chip | 13-14px | sans 600 |
| Eyebrow / tag | 12px uppercase, letter-spacing .06-.1em | sans 600-700 |

## Components
| Component | Level | Purpose | Variants |
|---|---|---|---|
| `.btn` | primitive | actions | default (accent fill), `.ghost`, `.small` |
| `.chip` | primitive | filter / toggle | default, `.on` (accent border + glow) |
| `.seg` tabs | component | lab sub-navigation | scrollable row, `.on` |
| `.hub-card` | component | home tiles (review queue, continue, labs) | `.glow` |
| `.bl-opt` / `.opt` | primitive | quiz answer | default, ok/right (green + tick), bad/wrong (red + cross) |
| `.jl-fb` / `.fb` | component | answer explanation | ok, no |
| `.v3b` | primitive | 3D viewer control | pill, `.on`, `.sq` |
| `.bz-fab` (Blurt) | primitive | floating action | hidden over 3D viewer on phones |
| `.hub-search` | component | global search | focus ring |
| toast, onboarding modal, update bar | pattern | transient messaging | n/a |

## Layout
**Grid:** single column on mobile, `max-width:1080px` centred on desktop, 2-column cards from tablet up.
**Base unit:** none declared. Gaps in use: 2, 4, 5, 6, 8, 10, 12, 14px (mixed 4/5/6 grid). Most common: 6, 8, 10.
**Breakpoint:** 560px (phone vs larger). Touch targets raised to 44px under `pointer:coarse`.

## Depth
| Level | Value | Used for |
|---|---|---|
| Flat | border `--line` only | most cards and options |
| Raised | `0 16px 40px -22px rgba(0,0,0,.8)` + 1px inner top highlight | hub cards |
| Floating | `0 8px 24px rgba(0,0,0,.4)` | toasts, FAB |
| Glow | accent box-shadow ring + blur | selected chips, primary buttons |

## Do's and Don'ts
### Do
- Keep one accent colour; reserve green/red for correctness, orange for highlights.
- Pair every right/wrong colour with an icon or text.
- Use serif for headings and questions, sans for everything functional.
- Keep 44px minimum targets on touch.
- Respect `prefers-reduced-motion` for any new animation.
### Don't
- Add new font sizes or radii outside the scales below.
- Use pure white or pure grey text in dark mode (ink is warm off-white).
- Put new fixed UI over the bottom-right (Blurt lives there).
- Hardcode colours; use the custom properties so light mode works.
- Touch anatomy content when restyling.

## Responsive
Phone-first. 560px breakpoint reflows the hero (smaller skeleton, fewer tags) and the 3D viewer toolbar. Desktop adds wider card grids. Not observed: tablet-specific layout (768-1024px).

## Tokens added (batch 4)
`:root` now also defines spacing `--sp-1..7` (4/8/12/16/24/32/48), radius `--r-sm/md/lg/xl/pill` (8/12/20/28/999), type `--fs-xs..3xl` (12/13/15/18/22/32/48), shadow `--sh-1/2`, motion `--ease`, `--dur-1..3` (150/240/420ms). New CSS must use these. Older CSS is migrated gradually.

## Target direction
**Bento editorial** (chosen 3 Nov 2026): home becomes a tile grid with a large serif wordmark and the live 3D skeleton as hero, a solid-cyan review tile, oversized serif numerals. Motion is limited to the home screen, stops under reduced-motion, and pauses off-screen. Quiz and flashcard screens stay still.

## Token gaps (findings, before batch 4)
- Only colour and font were tokenised. Spacing, radius, type size, shadow and motion had **no tokens**.
- 12+ type sizes where ~7 would do (12 / 12.5 / 13 / 13.5 / 14 are near-duplicates).
- 7+ radii (3, 8, 10, 12, 14, 99, 999).
- Reduced-motion is handled for 3 animations, not globally.

## Agent Prompt Guide
- Use only `var(--*)` colour tokens; never raw hex in new CSS.
- Headings and quiz questions use `--f-display`; everything else `--f-body`.
- Keep the single cyan accent; do not introduce a second brand colour.
- Any new interactive element: 44px min height on coarse pointers, visible `:focus-visible`, icon-or-text alongside colour.
- Do not alter anatomy facts; wording changes apply to UI copy only.

## Home hero (Nov 2026)
Home draws the real skeleton (`models/skel.bin`) live in WebGL, with the 3D viewer's look: `MeshStandardMaterial`, viewer bone/cartilage colours (`V3C`), the same hemisphere and two directional lights. It keeps the scan reveal, slow upward pulse, idle spin, drag with inertia, tap to open the 3D viewer, theme colours and reduced motion. A floor of concentric rings, 72 tick marks and a soft glow sits at foot level inside the 3D scene and turns with the skeleton. The canvas is drawn above the hero card (`.hub-sk{z-index:2}`); the camera's draw distance follows its distance so short hero boxes (iPad portrait) never clip it.

## Bone lab quiz magnifier (Nov 2026)
In Bone lab tests, "Name it", "Attachments & joints" and "Why this shape" questions show a round, zoomed copy of the plate (`.bl-loupe`) beside the question, centred on the highlighted structure, so it stays in view on phones where the plate scrolls away. IDs inside the copy get a `-lp` suffix.

## Home redesign (batch 9, Nov 2026)
Home now follows the concept-v2 visual language throughout, scoped under `#hub`:
- **Top bar** (`.oh-top`): wordmark + theme toggle icon (the top CTA was removed in batch 12 as redundant: the skeleton opens the viewer and the Review queue card has its own button). The greeting moved out of the header.
- **Hero** (`.oh-hero`): the live WebGL skeleton is centred full-width over a large outlined "Osteon" wordmark (`.oh-word`), with a drag-to-rotate azimuth readout (`.oh-az`/`#ohazv`, driven live from `SK.pivot.rotation.y` in `skTick`) bottom-right of the stage. The headline and subtext sit below the stage, right-aligned subtext balancing the left-aligned `<h1>`.
- **Bento tiles**: `Skeleton and muscles` is a 2x2 feature tile carrying a cutout figure (`img/hub-tile-skeleton.webp`); Microanatomy gets a concentric-rings mark; Flashcards gets a small card-stack doodle (`.oh-deck`).
- **Scroll story** (`ohStory()`/`.oh-story`): below the tiles, a sticky section turns the same skeleton through 4 quarter-turns (front/side/behind/other-side) while labelling 2 landmarks per chapter (anchors computed from node bounding boxes in `skBuild`, projected each frame in `ohPins()`). Falls back to a static 2-column list when WebGL is unavailable (`#hub:not(.sk-on)`).
- Still true to the pre-batch-9 rules: single cyan accent, `var(--f-display)` for headings, reduced-motion snaps the story instead of animating it, nothing overlaps the Blurt button.

## Labs and quizzes redesign (batch 10, Nov 2026)
All seven lab/quiz screens (Bone, Joint, Muscle, Cartilage, Microanatomy, Exam practice, Flashcards) share one dialog shell (`.bl`), so this batch is a single CSS pass scoped to that shell — no markup or behaviour changed, confirmed by a computed-style diff against main showing zero pixel difference on Home and the 3D viewer:
- `.eyebrow` inside `.bl` is now accent-coloured with wider letter-spacing, matching the concept's small caps labels.
- `.bl-stage` (the figure/plate panel shared by every lab) gets a "specimen" treatment: a soft accent-tinted radial glow behind the figure plus four corner crop-marks drawn in pure CSS (`.bl-stage::after`, multi-layer `background-image`), no new markup.
- `.btn` and `.chip` inside `.bl` are pill radius (`var(--r-pill)`), with a small lift-on-hover for buttons, consistent with Home's CTAs.

## 3D viewer and small overlays (batch 11, Nov 2026)
Checked the 3D viewer (`.v3`) screen by screen — Layers panel, label cards, camera controls — against the concept language. It already carried it from earlier batches: pill glass buttons (`.v3b`), accent-cyan "on" state, serif title, dark radial-gradient stage. No changes made there.

The two small overlays opened from the Home menu — "About" (`abOpen`) and "My mnemonics" (`mnOverlay`) — had been left behind: plain uppercase section labels and squared-off buttons. Both share one shell (`.rmcr`), always dark regardless of app theme (like `.v3`), so this batch's CSS hardcodes the dark-mode accent (`#22E5F2`) rather than `var(--accent)`, which would resolve to the dimmer light-theme teal and look muddy against the fixed-dark card:
- `.mn-h`, `.mn-h2`, `.ab-h`, `.cr-h` (section eyebrows) are now accent-coloured.
- `.btn` inside `.rmcr` is pill radius with the same lift-on-hover as Home/labs.
- Confirmed zero pixel/style difference against main on Home, 3D viewer, and all seven lab/quiz screens — the change is fully scoped to `.rmcr`.
- `.bl-opt` (quiz answer options) keep their existing ok/bad colours and icons; only the corner radius and hover border changed.

## Hero fixes (batch 12, Nov 2026)
- Removed the top-bar "Start revising" pill (`.oh-cta-top`): redundant with tapping the skeleton and the Review queue card.
- `.oh-h1` gets `padding-bottom:.14em` so the italic "by heart." descenders aren't clipped by `.oh-hero{overflow:hidden}` (seen on iPad with the real Instrument Serif).
- The fixed Blurt button no longer covers hero text: above 700px `.oh-sub` keeps a right margin clearing the button; at 700px and below the hero's min-height ends 80px above the screen bottom.
