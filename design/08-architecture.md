# 08 · Frontend architecture & coding standards

**Date:** 2026-08-01 · **Status:** ⏸ **awaiting sign-off — this is the last gate before code**
**Governs:** every file written in Phase 10.

> The audit's root-cause finding was not "the CSS is messy." It was that **there is no architecture**: 648 inline `style=` attributes, 137 raw `hsl()` literals bypassing 51 declared tokens, 36 `!important`, and 20 `[style*=]` attribute-selector hacks fighting React's style serialization. Every other defect — the entropy, the contrast failures, the drift between pages — is downstream of that. This document is the fix, and it is written so that following it makes the old failure mode *impossible* rather than merely discouraged.

---

## 1 · Decisions requiring sign-off

Five, stated up front. The rest of the document is detail.

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Build step?** | **No build step.** Hand-authored CSS and ES modules, served from the repo root. Shared chrome is kept in sync by a **checker**, not a compiler (§5) |
| 2 | **CSS organisation** | One stylesheet, `@layer tokens, reset, base, layout, components, utilities` (§3) |
| 3 | **Naming** | BEM (`block__element--modifier`) + `is-` state classes + a `js` root scope. Already used throughout `04`/`05` (§4) |
| 4 | **JS shape** | Five ES modules, `type="module"`, `modulepreload`ed. No bundler, no globals (§6) |
| 5 | **Where the three cross-cutting concerns live** | Reduced-motion, colour scheme and no-JS are handled **in the token and layer system**, never per component (§7) |

---

## 2 · File layout

```
/                        ← GitHub Pages serves this directly. Unchanged deploy model.
├── index.html           ← the 9 beats
├── linux.html           ├─ secondary pages, brought into the system
├── privacy.html         │
├── support.html         │
├── 404.html             ← NEW (GitHub Pages currently serves its own default)
├── assets/
│   ├── site.css         ← the single stylesheet (~7 KB gzip projected)
│   ├── og.png           ← 1200×630, replaces the 320×190 thumbnail.webp
│   └── js/
│       ├── main.js      ← entry. Imports the rest; idempotent init
│       ├── reveal.js    ← the ONE IntersectionObserver
│       ├── guardian.js  ← the signature moment's state machine
│       ├── platform.js  ← the platform-aware CTA probe
│       └── motion.js    ← reduced-motion policy + ambient play/pause
├── tools/
│   └── sync-chrome.mjs  ← chrome drift checker (§5). Never required to serve.
├── CNAME  robots.txt  sitemap.xml  site.webmanifest  favicon.*  icon-*.png  apple-touch-icon.png
└── design/              ← these documents
```

**Preserved exactly, per §3 of the brief:** `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, and every icon file. `sitemap.xml` gets updated `lastmod` values and gains nothing else — `404.html` is deliberately **not** listed in it.

**Deleted:** `support.js` (55 KB of `dc-runtime` — misnamed, unrelated to `support.html`) and `thumbnail.webp` (replaced by `assets/og.png`).

---

## 3 · CSS architecture

### 3.1 The cascade, made predictable

```css
@layer tokens, reset, base, layout, components, utilities;
```

Declared **once, at the top of `site.css`, before any rule.** Layer order is then fixed regardless of source order or specificity, which is what makes `!important` unnecessary. This single line is the direct fix for the 36 `!important` declarations in the current site.

| Layer | Owns | Never contains |
|---|---|---|
| `tokens` | Every custom property. `:root` and `.light` only | Any selector that paints |
| `reset` | Box-sizing, margin zeroing, media defaults, `:focus-visible` baseline | Anything brand-specific |
| `base` | Element defaults: `body`, headings, `p`, `a`, `table`, `ul` | Any class selector |
| `layout` | Layout primitives only: `.stack`, `.cluster`, `.grid`, `.bleed`, `.measure` | Any colour |
| `components` | One block per section of the file, BEM | Any raw value |
| `utilities` | A short, closed list (§3.4) | Anything not in that list |

### 3.2 The rule that makes the old failure impossible

> **A component may reference tokens. A component may not contain a raw colour, size, or spacing value.**

`03-brand.md` §4 states this as invariant #1. The architecture enforces it structurally:

- **`tokens` is the only layer permitted to contain a literal colour or a literal length.** A raw `hsl()` or `px` outside that layer is a review-blocking defect, greppable in one command:
  ```bash
  grep -nE 'hsl\(|#[0-9a-f]{3,6}|[0-9]+px' assets/site.css | grep -v '@layer tokens' 
  ```
- **Zero inline `style=` attributes in any HTML file.** The one legitimate use — a value only known at runtime — is handled by setting a *custom property* on the element (`style="--i:3"`), never a property. That exception is written down here so it is a rule, not a loophole.
- **`!important` is banned with exactly one documented exception:** the `prefers-reduced-motion` universal override (`04-motion.md` §7.1), which must out-cascade every animation declaration including future ones. It is the one place where a blunt instrument is the correct instrument, and it is inherited from the app's own `motion.css`.

### 3.3 Modern CSS, used where it earns its place

| Feature | Used for | Not used for |
|---|---|---|
| Custom properties | Every token; runtime values via `--i` | — |
| `clamp()` | Fluid type and `--beat-y` (`03-brand.md` §3.4/§3.5) | Anything with only two states — that's a media query |
| **Container queries** | Cards inside variable-width beats — the component decides | Page layout; that's viewport-level and uses media queries |
| `:has()` | `.beat:has(.guardian)` for the hero's tighter rhythm; `<details>` open styling on the parent | Anything load-bearing — it is progressive enhancement, and the fallback is the default state |
| **Logical properties** | All spacing/borders: `margin-inline`, `padding-block`, `inset-inline`, `border-inline-start` | — (this is universal, per `05-interaction.md` §7 RTL-readiness) |
| `color-mix()` | Hover and threshold steps: `color-mix(in oklab, hsl(var(--primary)) 90%, white)` | Any value that must be *guaranteed* to hit a contrast ratio — those are solved and stored as tokens (`06-accessibility.md` §3), never mixed at runtime |
| Nesting | Within a component block, one level deep | Deeper than one level — it reproduces the specificity problem it was meant to solve |
| `@supports` | Guarding `animation-timeline` (`04-motion.md` §6.2) | Guarding anything with a graceful natural fallback |

**The `color-mix()` restriction is the important one.** It is tempting to derive every state colour at runtime. But `06-accessibility.md` found three contrast failures by *computing* values, and a runtime mix cannot be computed ahead of time or asserted in review. **Contrast-critical colours are solved offline and stored as tokens; `color-mix()` is for emphasis steps that carry no contrast requirement.**

### 3.4 The utilities layer is closed

Exactly six, listed here so the layer cannot grow into a framework:

`.sr-only` · `.skip-link` · `.measure` · `.mono` · `.visually-hidden-focusable` · `.no-scrollbar`

Anything else belongs to a component. A utility layer that accepts additions becomes Tailwind without the tooling, and the audit's entropy counts are what that looks like at the end.

---

## 4 · Naming

**BEM, one convention, no exceptions.**

```
.beat              .beat__content        .beat--quiet
.guardian          .guardian__task       .guardian--resolved
.cascade           .cascade__state
.threshold         .threshold__glow
```

- **Block** = one word, the thing a stranger would call it. Already fixed by `04-motion.md` and `05-interaction.md`, which name `.beat`, `.guardian`, `.cascade`, `.threshold`, `.verdict`.
- **State** = `is-` prefix, and **state classes are the only classes JS ever writes**: `is-revealed`, `is-selected`, `is-running`. This makes the JS↔CSS contract greppable in both directions.
- **Root scopes** = `js` on `<html>` (set before paint, §7.3) and `light`/`dark`.
- **Data attributes for machine state**: the guardian's state machine lives in one `data-state` attribute on the root and CSS reads it (`05-interaction.md` §5.3). Five nodes are never class-juggled independently.
- **No orphan selectors.** Every selector in `components` sits under a `/* ── Block: name ── */` banner. A selector that belongs to no block is a defect.

---

## 5 · Shared chrome — no build step, a checker instead

Five pages share a `<head>`, a header, and a footer. They must never drift — the current site drifts already (`lockinra.app` vs `.xyz` across pages, per the audit).

**Rejected: a build step.** §3 of the brief sets the default to none, GitHub Pages serves the repo root, and a compiler means the served file is no longer the authored file — which for a 5-page static site buys nothing and costs a class of "did you rebuild?" bugs.

**Rejected: silent duplication.** That is the current state, and it produced the drift.

**Chosen: marked, mechanical duplication with an enforced checker.**

```html
<!-- #chrome:footer start — canonical source is index.html. Run tools/sync-chrome.mjs after editing. -->
<footer class="chrome-footer"> … </footer>
<!-- #chrome:footer end -->
```

`tools/sync-chrome.mjs`, ~40 lines, zero dependencies:

| Command | Behaviour |
|---|---|
| `node tools/sync-chrome.mjs --check` | Exits **1** with a diff if any page's marked block differs from `index.html`'s. Runs in CI and pre-commit |
| `node tools/sync-chrome.mjs --write` | Copies each canonical block from `index.html` into the other four pages |

Three properties this has that a build step does not: **the committed HTML is always the served HTML**; the site deploys with the tool absent or broken; and drift becomes a *failing check with a diff* rather than something a human is asked to notice. It is a test, not a compiler.

**Per-page `<head>` differences** (title, description, canonical, OG) sit **outside** the marked block, in a small per-page section, so the checker never fights legitimate variation.

---

## 6 · JavaScript

### 6.1 Shape

Five ES modules, none over ~80 lines. Loaded as `<script type="module" src="assets/js/main.js"></script>` — deferred by definition, never render-blocking. The four non-entry modules get `<link rel="modulepreload">` so the import waterfall flattens to one round trip.

| Module | Single purpose | Exports |
|---|---|---|
| `main.js` | Entry. Feature-detects, wires modules, idempotent | `init()` |
| `reveal.js` | **The one IntersectionObserver.** Elements register into it | `observe(el)`, `disconnect()` |
| `guardian.js` | Cascade state machine + run token | `mount(root)` |
| `platform.js` | CTA platform probe and collapse | `promote(root)` |
| `motion.js` | Reduced-motion policy; ambient play/pause on visibility | `apply()`, `watch()` |

### 6.2 Rules

- **No global namespace pollution.** Modules are scoped by definition; nothing is attached to `window`. The current site's runtime does the opposite.
- **Idempotent init.** `mount()` and `init()` are safe to call twice; each guards on a `data-mounted` attribute. Cheap, and it makes the code survivable under any future partial re-render.
- **Event delegation over many listeners.** One `click` listener on the guardian root handles all three source pills, matching with `closest('[data-src]')`. Not three listeners, and not a listener per row.
- **Cleanup is real.** `will-change` is removed on `transitionend`; the rAF loop stops when Beat 3 leaves the viewport; the ambient animation pauses on `visibilitychange`. Every start has a stop.
- **No `setTimeout` chains without a run token** — the exact bug that makes interactive demos resolve after the user has moved on (`05-interaction.md` §5.3).
- **Fail open, always.** Every module is wrapped so a throw leaves the page in its no-JS state, which is fully functional. **A script error must never hide content** (`04-motion.md` §7.3).
- **No `innerHTML` with anything but literal, author-controlled strings.** There is no user input on this site; the rule exists so that stays true.

### 6.3 Comments

Explain **why**, never what. The density target is the app's own `packages/embeddings/src/cascade.ts` — a file-head comment explaining the decision procedure and its ordering rationale, then near-silence over obvious code. Two comments are mandatory because they encode decisions a future reader will otherwise "fix":

1. Why the 2px inner focus-ring gap exists (`06-accessibility.md` §4).
2. Why the cascade shows five rows (`04-motion.md` §0.1) — the next engineer will otherwise simplify it to three and reintroduce a truth violation.

---

## 7 · The three cross-cutting concerns — system-level, not per-component

Per §12 of the brief, these are architectural.

### 7.1 Reduced motion
One `@media (prefers-reduced-motion: reduce)` block in the `tokens` layer that neutralises `--parallax-depth` **at the token level**, plus the universal duration override. A component added next year inherits correct behaviour without its author knowing the rule exists. Full matrix: `04-motion.md` §7.1.

### 7.2 Colour scheme
`prefers-color-scheme` only — no toggle (`05-interaction.md` §1.1). Both schemes are token blocks in the `tokens` layer; **no component contains a scheme-conditional rule.** If a component needs a different value in light mode, that is a missing token, not a media query.

### 7.3 No-JS
The `js` class is set on `<html>` by a **single inline script in `<head>`**, before first paint:

```html
<script>document.documentElement.classList.add('js')</script>
```

Every JS-conditional style is scoped `.js …`. This is the inverse of the common pattern and the reason it matters: **content is visible by default and JS opts into hiding it.** If the script fails, is blocked, or never runs, the page is complete. It is the same principle as failing open, applied to CSS.

*This is the only inline `<script>` on the site, and its only job is to set that class. It is ~50 bytes and cannot fail.*

---

## 8 · Definition of done, per section

Phase 10 builds vertically. A section is done when **every** line is true — not when it looks right:

- [ ] Zero inline `style=` (except `--custom-property` runtime values)
- [ ] Zero raw colour/size literals outside the `tokens` layer (grep clean, §3.2)
- [ ] Zero `!important` (except the one documented reduced-motion block)
- [ ] Every selector under a named block banner
- [ ] Keyboard: full traversal, visible focus at every stop
- [ ] Screen reader: section read-through recorded in `06-accessibility.md` §8
- [ ] Both colour schemes checked
- [ ] Reduced motion checked
- [ ] All 7 breakpoints checked: 375 · 428 · 768 · 1024 · 1440 · 1920 · 2560
- [ ] `documentElement.scrollWidth <= clientWidth` at 320px
- [ ] Console clean — zero errors, zero warnings
- [ ] Frame histogram p95 ≤ 18ms; zero long tasks (`07-performance.md` §6)
- [ ] Numbers written into `07-performance.md` §7
- [ ] Committed, with a message saying what shipped and why

---

## 9 · What this architecture makes impossible

The test of an architecture is which defects it rules out rather than discourages. Against the audit's own findings:

| Audit finding | Ruled out by |
|---|---|
| 648 inline `style=` | §3.2 — zero-inline-style rule + grep check |
| 137 raw `hsl()` bypassing 51 tokens | §3.2 — literals only legal in the `tokens` layer |
| 36 `!important` | §3.1 — `@layer` makes them unnecessary; one documented exception |
| 20 `[style*=]` hacks | The React runtime that forced them is deleted (§2) |
| 41 font sizes, 68 paddings | `tokens` is the only layer with lengths; the scales are closed |
| Contrast failures | `06-accessibility.md` §3 — every legal token pair passes by construction |
| Page drift (`lockinra.app` vs `.xyz`) | §5 — the checker fails the build on drift |
| Content hidden when JS fails | §7.3 — CSS hides only inside `.js` |
| Animations ignoring reduced-motion | §7.1 — neutralised at the token level |
| 14 infinite off-screen animations | §6.2 — every start has a stop |

---

## 10 · Sign-off

**Recommended:** approve all five decisions in §1 as stated.

The one worth a second look is **§1.1, no build step.** The argument for a build step is real — five copies of a footer is five places to edit. The argument against is that the brief sets no-build as the default, the served file staying identical to the authored file is genuinely valuable on a site whose thesis is inspectability, and a 40-line checker converts the risk (silent drift) into a failing test with a diff. If you would rather have a real build step with committed output, that is a one-line change here and roughly an hour in Phase 10.

**This is the last gate. On approval, Phase 10 begins with the token and base layer, then chrome, then the hero.**
