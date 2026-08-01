# 05 · Interaction & UX

**Date:** 2026-08-01 · **Status:** specified
**Inputs:** `02-strategy.md` (9 beats), `03-brand.md` (tokens, focus ring), `04-motion.md` (timings, the acknowledgment contract).
**Companion:** `09-copy.md` holds every string; this document holds every *state*.

> Missing states are the single most common tell of an amateur build. This document exists so that no element ships with fewer states than it needs, and so that "what does it look like while it's disabled" is never answered during implementation.

---

## 1 · The interactive inventory — the complete list

The site has **ten** interactive element types. Enumerating them first is what makes §2's state matrix provably complete rather than merely long.

| # | Element | Where | Count |
|---|---|---|---|
| 1 | Primary CTA — platform-aware download | Beat 9, nav | 2 instances, 1 component |
| 2 | Secondary button (link-styled) | Beat 9 (other platforms), 404 | 3 |
| 3 | Inline text link | Throughout, footer | ~30 |
| 4 | Anchor / skip link | Header, in-page | 2 |
| 5 | **Source switch** (3-way radio group) | Beat 1 — signature moment | 1 |
| 6 | Replay control | Beat 1 | 1 |
| 7 | Disclosure (`<details>`) | Beat 8 FAQ | ~8 |
| 8 | Horizontally scrollable region | Beat 7 comparison table (mobile) | 1 |
| 9 | External link (Store, GitHub, releases) | Beats 5, 8, 9, footer | ~8 |
| 10 | `mailto:` link | Support page, footer | 2 |

### 1.1 Three deliberate absences, recorded rather than assumed

**There is no form on this site, and none is added.** `support.html` is a `mailto:` link today; that is the entire contact surface. §10 of the brief specifies a form contract (inline validation, error summary, autocomplete), and the honest answer is that **it has no subject**. A form on a static GitHub Pages site requires a third-party form endpoint — a fifth origin on a page whose thesis is that nothing leaves your machine, and a direct contradiction of the strategy's decision to go from 4 origins to 1. `mailto:` sends the message from the visitor's own client, to a real inbox, with no intermediary. **The form contract is therefore not "skipped" — it is answered: the correct number of forms on this site is zero,** and the reasoning is the site's own thesis. If a form is ever added, it inherits §2's state matrix rows for *loading*, *success*, and *error*, which is why those rows are specified anyway.

**There is no theme toggle.** `prefers-color-scheme` is honoured, both modes are first-class (`03-brand.md` §3.3), and no control is added. A toggle must live either in the nav — where it competes with the one thing the nav exists for — or in the footer, where it is not found. The OS setting is already the visitor's stated preference, and this is a linear 9-beat read, not an app someone lives inside. *Reversal condition:* if Phase 11's UX researcher observes a visitor hunting for it, it goes in the footer as a 3-state `auto/dark/light` control, and the JS cost is charged to `07-performance.md`.

**There is no mobile nav menu.** The header holds the wordmark and one download link. Nine beats do not need a table of contents, and a hamburger would introduce a focus trap, an overlay, an escape handler, and a scroll lock to navigate a page the visitor is already scrolling. The strongest mobile nav is the one that isn't there.

---

## 2 · The state matrix

**Eight states, every one specified for every element.** `—` means *not applicable and provably so*, never *not thought about*.

### 2.1 The universal rules (apply to all ten types)

| Rule | Value |
|---|---|
| Acknowledgment ceiling | **≤120ms** (`--d-micro`) from input to first pixel change — `04-motion.md` §5.5 |
| Focus indicator | `--focus` from `03-brand.md` §3.8 — two-layer ring, ≥5.3:1 on every surface. On `:focus-visible` only |
| `outline: none` | **Banned** unless a superior replacement is applied in the same rule |
| Hit target | **≥44×44px** on touch; ≥24×24px CSS with a ≥44px pseudo-element expansion where the visual is smaller |
| Disabled | **No element on this site has a disabled state** — see §2.2, every row. The generic `opacity: .5` rule was removed at Phase 7: computed, it lands at 4.43:1 (dark) / 3.05:1 (light) and is unreadable (`06-accessibility.md` §3.1). If one is ever added it needs a computed token, not an opacity — and never `disabled` on a link-like control, which removes it from the tab order and from screen readers |
| Control boundary | Any visible edge that identifies an interactive element uses **`--border-control`** (≥3:1 on every surface), never `--border`/`--border-strong`, which are decorative and have no contrast floor |
| Transition | `--d-micro`, `--ease-entrance` for all state changes; **no transition on `:focus-visible`** — a focus ring must be instantaneous |
| Tap highlight | `-webkit-tap-highlight-color: transparent`, replaced by the `:active` state below |
| Text selection | `::selection` uses `--primary-subtle`; never suppressed |

### 2.2 Per-element states

**① Primary CTA** — the download button

| State | Treatment |
|---|---|
| Rest | `--primary` fill, `--primary-fg` text, `--r-sm`, threshold hairline on the top edge |
| Hover | `--primary-hover` fill, threshold +1 step. `--d-micro`. **No lift, no scale** — the brand voice is immovable (`04-motion.md` §4 row 9) |
| Focus-visible | `--focus` ring. Ring is *outside* the button; layout does not move |
| Active | `scale(0.98)`, threshold −1 step, `--d-micro` · `--ease-commit`. The only scale on the element |
| Disabled | **Never disabled.** A download link that cannot be pressed is a bug, not a state |
| Loading | — (navigates away; the browser owns the progress) |
| Success | — (leaving the page *is* the success) |
| Error | Handled at the link level: if the platform probe fails, it degrades to the all-platforms list (§4.1), never to a broken href |

**② Secondary button** — inherits ① with `--surface-elevated` fill, **`--border-control`** boundary, `--text` label. Hover raises the border to `--primary`, not the fill. Never two filled buttons in one viewport (§3.2).

> **Why `--border-control` and not `--border-strong` here.** In light mode `--surface-elevated` and `--surface` are both `#ffffff` — a 1.00:1 fill difference — so this button's *only* boundary is its border. At `--border-strong` that border computes to 1.70:1 and the control has no perceivable edge at all. This was found by computation in Phase 7, not by looking at it (`06-accessibility.md` §3, Fix 3).

**③ Inline text link**

| State | Treatment |
|---|---|
| Rest | `--text` with a `1px` underline at `--border-strong`, offset `0.2em`, `text-decoration-skip-ink: auto` |
| Hover | Underline → `--primary`, text → `--text`. Underline thickness unchanged (thickening reflows the line box on some engines) |
| Focus-visible | `--focus` ring, `border-radius: 2px` so the ring hugs the text |
| Active | `--primary` text |
| Visited | **Not styled.** On a marketing page, visited styling leaks browsing history into the visual design and communicates nothing useful |
| Disabled / Loading / Success / Error | — |

Underline is present at rest, always. Colour-only link differentiation fails WCAG 1.4.1 and is the most common contrast-adjacent failure on marketing sites.

**④ Skip link** — visually hidden until `:focus`, then pinned top-left at `--s-4`, `--surface-overlay`, full `--focus` ring, `z-index` above everything including the header. First element in the DOM. Target is `<main id="main" tabindex="-1">`.

**⑤ Source switch** — the signature moment's 3-way control

Implemented as `role="radiogroup"` with three `<button role="radio">`. Not `<a>`: nothing navigates. Not a `<select>`: all three options must be visible simultaneously because *comparing* them is the interaction.

| State | Treatment |
|---|---|
| Rest | `--surface-elevated`, **`--border-control`** boundary, `--text-muted` label |
| Hover | `--primary` border, `--text` |
| Focus-visible | `--focus` ring. **Roving tabindex**: the group is one tab stop; ←/→/↑/↓ move between options and select, per the WAI radiogroup pattern |
| Active | `scale(0.96)` → `1`, `--d-micro` · **`--ease-entrance`**. A press is an *acknowledgment*; it decelerates, it does not bounce (`04-motion.md` §8, finding 3) |
| **Selected** | `--primary-subtle` fill, `--primary` label, threshold lit beneath. `aria-checked="true"`. This transition is the *commit*, and is the one that carries `--ease-commit` |
| Disabled | — |
| Loading | **The `evaluating` state lives on the cascade rows, not here.** The pill commits instantly and stays interactive; a visitor may switch mid-run and the run restarts (`04-motion.md` §5.3) |
| Success / Error | — (a classification has a *verdict*, not a success) |

**⑥ Replay control** — text button, appears only after a first run completes, `--fs-sm`, `--text-subtle`. Rest/hover/focus/active per ③. It exists because §5.3 of the motion doc promises no cooldown, and a visitor who wants to re-watch should not have to guess that clicking the same pill works.

**⑦ Disclosure (FAQ)** — native `<details>`/`<summary>`

| State | Treatment |
|---|---|
| Rest | `<summary>` at `--fs-h3`, marker is a custom chevron (`list-style: none` + `::after`), `--text-muted` |
| Hover | `--text`, chevron `--primary` |
| Focus-visible | `--focus` ring on the `<summary>` (the focusable node) |
| Active | Chevron rotates 90°, `--d-fast` · `--ease-entrance` |
| Open | Chevron at 90°, threshold hairline under the summary. Content animates open only where `interpolate-size: allow-keywords` / `calc-size()` is supported; **otherwise it simply opens** — no JS height measurement, which is the classic `height: auto` animation hack that causes CLS |
| Disabled / Loading / Success / Error | — |

Native `<details>` is used deliberately: it is keyboard-accessible, screen-reader-correct, findable by find-in-page (in engines that expand on match), and works with zero JS. A custom accordion would be strictly worse in all four dimensions.

**⑧ Horizontally scrollable region** — the comparison table below `64rem`

| State | Treatment |
|---|---|
| Rest | `overflow-x: auto`, `tabindex="0"`, `role="region"`, `aria-label` naming the table. **Tabbable, because a scrollable region that keyboard users cannot reach is a WCAG 2.1.1 failure** |
| Focus-visible | `--focus` ring on the container |
| Overflow affordance | A `--bg`→transparent gradient mask on the trailing edge, shown only while more content exists (`scroll-driven`, no JS) |
| Header behaviour | First column `position: sticky; left: 0` with `--surface` fill so the row label survives the scroll |

**⑨ External link** — inherits ③, plus a 12px outbound glyph, `aria-hidden`, with the destination named in the link text itself (`09-copy.md` forbids "click here"). `rel="noopener"`. **No `target="_blank"` on any link** — opening a new tab is a decision that belongs to the visitor, and a landing page has no reason to take it.

**⑩ `mailto:` link** — inherits ③. The address is visible as the link text, so it works when no mail client is configured (the visitor can copy it). Never hidden behind "Contact us."

---

## 3 · Attention guidance

### 3.1 The loudest element, per beat

Only one element may be the loudest thing on screen at a time. The instruments are contrast, scale, isolation, motion, and negative space — named per beat so the claim is falsifiable in review.

| Beat | Loudest element | Instrument | Everything else |
|---|---|---|---|
| 1 Hook | The **source switch** — the thing to press | Motion (the only moving thing) + threshold + isolation | Headline is `--fs-display` but static and `--text`; it is *bigger*, not *louder* |
| 2 Recognition | The sentence | **Negative space** — ~70% empty viewport | Nothing else present. This beat has one element |
| 3 Mechanism | The **deciding stage row** | Threshold (the only lit row) | The other four rows at `--text-muted` |
| 4 Privacy | The one path that **leaves** the machine | Isolation + `--warning` — the only non-primary accent on the site | The eight paths that stay are `--text-muted` hairlines |
| 5 Ships | The **most recent release** row | Scale + `--text`; older rows step down to `--text-subtle` | The ladder recedes with age, which is also the information |
| 6 Workspace | Nothing — **deliberately flat** | — | Four peer clusters. A "loudest" cluster would imply a ranking that does not exist (`04-motion.md` §2.3) |
| 7 Compare | The **LockinRa column** | Surface level (`--surface-elevated` vs. `--bg`) + threshold on its header | Competitor columns on `--bg`, `--text-muted` |
| 8 Cost | **"Free while in beta"** | Scale (`--fs-h2` inside body copy) | FAQ disclosures at rest |
| 9 Decision | **The CTA.** The only filled button in the viewport | Colour — the only `--primary` fill on screen | Platform alternates are `--fs-sm` text links |

**Beat 6 is the interesting one.** It is the only beat with no loudest element, and that is the design: it answers *"is this just a blocker?"* with breadth, and any emphasis would re-introduce the 15-equal-card problem the audit identified by simply reordering it. Flatness is the answer to breadth.

### 3.2 Cognitive load ceilings — enforced, not aspirational

| Ceiling | Value | Enforcement |
|---|---|---|
| Primary CTAs per viewport | **1** | Nav CTA is `--fs-sm` secondary until Beat 9 is passed; the filled CTA exists once |
| Simultaneous choices per viewport | **≤3** | Beat 1's three sources is the maximum on the site, and they are one decision presented three ways |
| Ideas per beat | **1** | `02-strategy.md` assigns exactly one to each; a second idea is a new beat or is cut |
| Words per beat | **≤210** | 9 beats × ~210 = ~1,900, matching the strategy's word budget |
| Links in the footer | **≤12** | The audit found a footer used as a sitemap |
| Nav items | **1** (the CTA) | §1.1 |

**Secondary actions are subordinate by treatment, not merely by size.** A smaller filled button is still a filled button and still reads as a peer. Subordination is: fill → border → text-link, in that order. Two adjacent buttons never differ only in scale.

---

## 4 · Input models

### 4.1 The platform-aware CTA — and its honest fallback

The primary CTA names the visitor's platform. This is the only piece of the site that branches on the client, so its degradation is specified precisely.

| Path | Behaviour |
|---|---|
| **No JS** (the markup default) | Renders **all three** platform links, Windows first, each labelled with its real version and byte size. Nothing is hidden. This is what ships in the HTML |
| JS + platform detected | The matching link is promoted to the filled CTA; the others collapse into a `--fs-sm` "other platforms" row beneath. **A collapse, never a removal** |
| JS + platform unknown | Identical to the no-JS state. No guessing |
| **Linux** | Promoted link is **v1.3.0**, and the label says so, with the lag disclosed inline — `02-strategy.md` Beat 5. The URL is never repointed at a release that does not exist |

Detection uses `navigator.userAgentData.platform` where available, falling back to a `navigator.platform` test, and **never** a UA-string regex. On failure it does nothing, which lands on the no-JS state. There is no scenario in which a visitor sees zero download links.

### 4.2 Touch

| Requirement | Implementation |
|---|---|
| Targets ≥44×44px | Enforced on all ten types. The source pills are `48px` tall; FAQ summaries have `--s-4` vertical padding, giving 48px |
| **No hover-dependent information** | Nothing is revealed on hover anywhere on the site. Hover changes *emphasis* only. Verified by auditing every `:hover` rule for property type — colour/border only, never `display`, `visibility`, `opacity: 0→1`, or `content` |
| Thumb zone | The Beat 9 CTA sits in the lower-middle third on mobile. The nav CTA is deliberately top-right and deliberately secondary — it is for the visitor who has already decided |
| Tap highlight | `-webkit-tap-highlight-color: transparent`; replaced by the `:active` states in §2.2 so feedback is designed, not default blue |
| 300ms delay | Eliminated by `<meta name="viewport" content="width=device-width, initial-scale=1">` — already present and preserved |
| Momentum scroll | Never overridden. No scroll hijacking anywhere (`04-motion.md` §6.3) |
| Pull-to-refresh | Not suppressed. `overscroll-behavior` is left at `auto` on the body |
| Double-tap zoom | Preserved — `user-scalable=no` and `maximum-scale` are **banned** |

### 4.3 Keyboard

| Requirement | Implementation |
|---|---|
| Full traversal | Every one of the ten types is reachable. Verified by tabbing the whole page and screenshotting every stop (Phase 10) |
| Logical order | DOM order **is** visual order at every breakpoint. No `order`, `row-reverse`, or grid placement that reorders focusable content. This is a layout constraint, not a `tabindex` problem to solve later |
| Visible focus | §2.1. Every stop, no exceptions |
| Skip link | First in DOM, → `<main>` |
| No traps | Nothing traps by construction — there is no modal, no overlay, no menu (§1.1) |
| `Escape` | Closes any open `<details>` that has focus within. That is the only closable thing on the site |
| Focus restoration | — (nothing removes focus from the flow) |
| Roving tabindex | The source group only (§2.2 ⑤) |
| `Home`/`End`/`PgUp`/`PgDn`/`Space` | Native scrolling, never intercepted |
| Find-in-page | Works — no virtualised content, no `content-visibility: hidden`, no split text without an `sr-only` twin (`04-motion.md` §7.2) |

**One rule that prevents most keyboard bugs:** the site never uses `<div onclick>`. Every interactive element is a `<button>`, `<a>`, `<summary>`, or an ARIA-patterned control with full keyboard semantics implemented. A div with a click handler is a defect (§11.1 of the brief), and the audit found several on the current site.

### 4.4 Pointer

- `cursor: pointer` on buttons and links; `default` everywhere else. **Never** `cursor: pointer` on non-interactive text — it promises an affordance that does not exist.
- No custom cursor (`04-motion.md` §4 row 10).
- `@media (hover: hover)` guards every hover rule so touch devices never get a sticky hover state after a tap.

---

## 5 · The signature moment — the full interaction spec

Choreography and timing live in `04-motion.md` §5. This is the *behaviour*.

### 5.1 Structure

```html
<section aria-labelledby="hook-h">
  <div class="guardian">
    <p class="guardian__task">Current task: <strong>Build the onboarding flow</strong></p>

    <div role="radiogroup" aria-labelledby="src-label">
      <span id="src-label">You open…</span>
      <button role="radio" aria-checked="false" data-src="github">github.com/…</button>
      <button role="radio" aria-checked="false" data-src="stripe">docs.stripe.com</button>
      <button role="radio" aria-checked="false" data-src="youtube">youtube.com</button>
    </div>

    <ol class="cascade" aria-live="polite" aria-atomic="true">
      <li data-stage="1">Hard rules       <span class="cascade__state">waiting</span></li>
      <li data-stage="2">Your corrections <span class="cascade__state">waiting</span></li>
      <li data-stage="3">Title keywords   <span class="cascade__state">waiting</span></li>
      <li data-stage="4">Local model      <span class="cascade__state">waiting</span></li>
      <li data-stage="5">No match         <span class="cascade__state">silent</span></li>
    </ol>

    <output class="verdict" aria-live="polite"></output>
  </div>
</section>
```

**Five rows, not three** — `04-motion.md` §0.1. An `<ol>` because the order is the argument.

### 5.2 Screen-reader behaviour — the part that is easy to get wrong

A naive implementation announces five separate row changes plus a verdict, producing about eight interruptions over two seconds. That is unusable.

**The contract:**
- The `<ol>` is `aria-live="polite"` **and `aria-atomic="true"`**, but individual row updates are **debounced to a single announcement at resolution.** The intermediate `evaluating` states are `aria-hidden` transitions — visual only.
- At resolution, exactly **one** announcement fires, from the `<output>`: *"youtube.com — classified distracting by the local model. Stages checked: hard rules, your corrections, title keywords."*
- Switching sources mid-run cancels the pending announcement rather than queueing a second.
- **Under `prefers-reduced-motion`, the announcement is identical** — because it was never tied to the animation in the first place. That is the test of whether the a11y layer is real: it should not know that motion exists.

### 5.3 State machine

```
idle ──click──▶ running ──resolve──▶ resolved ──click(other)──▶ running
                   │                     │
                   └──click(any)─────────┴──▶ running   (restart; no cooldown)
```

- `running` is **interruptible at any frame.** Restarting cancels pending timers via a single incrementing run token; a stale timer that fires after a restart is discarded by token mismatch. (This is the bug that ships in most such demos: `setTimeout` chains that keep resolving after the user moved on.)
- The component's state lives in one `data-state` attribute on the root; **CSS reads it.** No class juggling across five nodes.
- Tab-away mid-run does not pause it — the run is ~2s and pausing would be surprising. But `document.hidden` **does** short-circuit to the resolved state, so returning to the tab never shows a half-drawn cascade.

### 5.4 What the visitor can break, and what happens

| Visitor action | Result |
|---|---|
| Rapid-clicks all three sources | Each click restarts cleanly. No queue, no overlap, no stuck row |
| Clicks the selected source again | Replays from the top |
| Tabs into the group and holds `→` | Selection moves and re-runs per keypress; the run token makes this safe |
| Loads with JS blocked | Static three-verdict list (`04-motion.md` §5.6) |
| Loads on a 320px viewport | Rows stack; the source pills wrap to two lines; nothing truncates |
| Zooms to 400% | Component reflows to a single column; no horizontal scroll |

---

## 6 · Loading & perceived performance

**The site has no skeletons and no spinners, because it has nothing to load.** Every beat above and below the fold is static HTML in the initial response (`07-performance.md`). This is stated explicitly because "skeletons over spinners" is the right rule for an application and the wrong rule for a document — a skeleton on a static page is an animation pretending there is a wait.

| Concern | Treatment |
|---|---|
| Input acknowledgment | ≤120ms, universal (§2.1) |
| Font swap | No webfonts (`03-brand.md` §3.4) → **no FOUT, no FOIT, no swap-CLS.** The class of problem is removed, not mitigated |
| Image arrival | Every `<img>` carries explicit `width`/`height`; the only images are the OG card and icons. **Zero CLS from images by construction** |
| Late-arriving anything | Nothing arrives late. No client-side rendering, no data fetch, no embeds |
| Slow network | The page is a single HTML response plus one CSS and one JS file. At 3G it renders text-first and remains fully functional before the JS lands (§4.1) |
| Offline | Any *already-loaded* page stays functional (no runtime fetches). **No service worker** — a cache layer on a 5-page static site is complexity with a stale-content failure mode, and the `site.webmanifest` stays for icon/PWA metadata only |

---

## 7 · Edge cases

Each row is a test Phase 10 must actually run, not a hazard to keep in mind.

| Edge case | Requirement | How it's handled |
|---|---|---|
| **Long strings** | No overflow, no truncation of meaning | `overflow-wrap: anywhere` on the two nodes that take variable content (release filenames, the mailto address); measure-capped prose elsewhere |
| **320px viewport** | No horizontal scroll of the body | `--gutter` bottoms out at `1.25rem`; the comparison table is the only wide element and it scrolls *inside its own region* (§2.2 ⑧). Verified with `document.documentElement.scrollWidth <= clientWidth` |
| **2560px+** | Not a stretched 1440px layout | `--w-content: 72rem` caps measure; `--fs-display` stops growing at `90rem` (`03-brand.md` §3.6). The threshold device spans full-bleed, so the page still reads as designed rather than as a centred column in a void |
| **200% zoom** | No loss of content or function | `rem` throughout, no `px` (`03-brand.md` §3.4). Equivalent to a 720px viewport at 1440px |
| **400% zoom** | WCAG 1.4.10 reflow — single column, no 2-D scroll | Equivalent to 360px. All grids collapse via `auto-fit`/container queries, not fixed columns |
| **Missing images** | Layout intact | Explicit dimensions reserve the box; `alt` carries meaning. Only the OG card and icons exist |
| **Slow network** | Functional before JS | §6 |
| **Offline** | Loaded page keeps working | §6 |
| **`forced-colors: active`** | Renders correctly | `forced-color-adjust` left at `auto`; borders use `currentColor`-compatible declarations so hairlines survive; **the threshold glow is decorative and disappears — so no information may depend on it.** Verdict states carry a text label, never colour alone. Focus ring uses `Highlight` system colour |
| **Colour-blind** | No information by hue alone | Verdicts read `relevant` / `distracting` as text. The Beat 4 warning path is dashed *and* `--warning`, not `--warning` alone |
| **RTL-readiness** | Layout primitives don't hard-code direction | `margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`, logical borders throughout. **The site does not ship an RTL translation** — this is readiness, and the claim is exactly that: the primitives would not need rewriting |
| **JS error mid-page** | Content unaffected | The reveal system fails *open* (`04-motion.md` §7.3); the signature moment falls back to its static markup |
| **Print** | Legible | A print stylesheet: threshold and glow off, dark palette → white, `<details>` all open, link hrefs printed after their text |

---

## 8 · The three questions, answered for the interaction layer

Per §2.3 of the brief, applied to the interactive elements rather than the sections.

| Element | Why does it exist? | Why here? | Strongest version not yet tried |
|---|---|---|---|
| Source switch | It converts a claim into a demonstration the visitor causes | Beat 1 — the only moment a stranger is still deciding to stay | Show the *fast* path first so the visitor learns speed before depth |
| Replay | The interaction is worth repeating, and repetition shouldn't require a guess | After first resolution, not before | Label it with what will change (`09-copy.md`) |
| FAQ disclosures | Answers the long-tail objections without spending scroll on them | Beat 8, immediately before the ask | Order by objection frequency from `01-research.md`, not by topic |
| Platform CTA | Removes a decision from the one moment that must have none | Beat 9 | Show the byte size inline so the click has no surprise behind it |
| Table scroll region | The comparison genuinely needs 7 columns | Beat 7 | Sticky first column so the row label never leaves |

---

## 9 · Open items

| # | Item | Owner |
|---|---|---|
| 1 | FAQ ordering by objection frequency (§8) | `09-copy.md` |
| 2 | Verdict announcement string — exact wording | `09-copy.md` |
| 3 | Print stylesheet is in scope for Phase 10's polish pass, not the section loop | `08-architecture.md` |
| 4 | Theme-toggle reversal condition (§1.1) is a Phase 11 watch item | `10-reviews/` |
