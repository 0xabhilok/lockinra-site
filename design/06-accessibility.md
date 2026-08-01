# 06 · Accessibility — the contract, and what it caught

**Date:** 2026-08-01 · **Status:** contract set; three token defects found and fixed; page-level audit deferred to Phase 10 with a named gate
**Standard:** **WCAG 2.2 AA is the floor.** Where the site exceeds it, that is noted; where a criterion does not apply, it is recorded as N/A with a reason rather than omitted.

> This document did real work rather than restating a standard. Computing the contrast of the **state** colours — the pairs `03-brand.md` did not compute — found **three genuine failures** in the locked token system, including one that would have made every secondary control on the site unidentifiable under SC 1.4.11. All three are fixed at the token level in §3.

---

## 1 · What is verified now vs. deferred

Honesty about evidence, per §3 of the brief.

| Verified in this phase | Method |
|---|---|
| Every text/background pair, including hover, selected, and disabled states | Computed WCAG relative-luminance sweep (§2) |
| Every non-text pair required by SC 1.4.11 | Same |
| The focus indicator's two-layer geometry | Computed against both the element and the page (§4) |
| Token-level fixes solved on the worst surface, not the average | Lightness sweep to the minimum passing value (§3) |

| Deferred | Gate |
|---|---|
| Screen-reader read-through of the full page | **Phase 10, per section.** Recorded verbatim in §8 as it happens |
| `axe`/`accessibility-review` scores | **Phase 10.** Per section, then full-page. Scores per round in §8 |
| 200% / 400% zoom reflow | Phase 10, measured in-browser |
| `forced-colors` rendering | Phase 10, measured in-browser |
| Keyboard traversal screenshots at every stop | Phase 10 |

**Nothing in the deferred column is claimed as done.** A page that does not exist cannot be read by a screen reader, and the Phase 1 audit made the same disclosure about screenshots rather than inventing results.

---

## 2 · Contrast — every pair, computed

Method: WCAG 2.x relative luminance, HSL→sRGB, ratios computed in a script over the literal token values in `03-brand.md`. Not estimated, not sampled from a rendering.

`03-brand.md` §3.1 already proved every **text-on-surface** pair. This phase computed what it did not: **states**.

### 2.1 Dark mode — state pairs

| Pair | Ratio | Min | |
|---|---:|---:|---|
| CTA label — `--primary-fg` on `--primary` | 6.84 | 4.5 | ✅ |
| CTA label, hover — `--primary-fg` on `--primary-hover` | 8.03 | 4.5 | ✅ |
| Selected pill label — `--primary` on `--primary-subtle` | 5.13 | 4.5 | ✅ |
| Body on selected pill — `--text` on `--primary-subtle` | 11.32 | 4.5 | ✅ |
| Link hover — `--primary-hover` on `--bg` | 8.75 | 4.5 | ✅ |
| Link hover on card — `--primary-hover` on `--surface` | 7.77 | 4.5 | ✅ |
| Warning — `--warning` on `--bg` | 8.93 | 4.5 | ✅ |
| Warning on card — `--warning` on `--surface` | 7.93 | 4.5 | ✅ |
| Warning on elevated — `--warning` on `--surface-elevated` | 7.24 | 4.5 | ✅ |
| **Danger on card — `--danger` on `--surface`** | **4.45** | 4.5 | ❌ **FIX 1** |
| Focus ring on page — `--focus-ring` on `--bg` | 9.34 | 3 | ✅ |
| Focus ring on card — `--focus-ring` on `--surface` | 8.29 | 3 | ✅ |
| Focus ring on overlay — `--focus-ring` on `--surface-overlay` | 6.83 | 3 | ✅ |
| **Control boundary — `--border-strong` on `--bg`** | **2.39** | 3 | ❌ **FIX 3** |
| **Control boundary — `--border-strong` on `--surface`** | **2.12** | 3 | ❌ **FIX 3** |

### 2.2 Light mode — state pairs

| Pair | Ratio | Min | |
|---|---:|---:|---|
| CTA label — `--primary-fg` on `--primary` | 5.60 | 4.5 | ✅ |
| CTA label, hover — `--primary-fg` on `--primary-hover` | 6.53 | 4.5 | ✅ |
| Selected pill label — `--primary` on `--primary-subtle` | 4.82 | 4.5 | ✅ |
| Danger — `--danger` on `--bg` | 5.36 | 4.5 | ✅ |
| Danger on card — `--danger` on `--surface` | 5.59 | 4.5 | ✅ |
| **Warning — `--warning` on `--bg`** | **3.12** | 4.5 | ❌ **FIX 2** |
| **Warning on card — `--warning` on `--surface`** | **3.25** | 4.5 | ❌ **FIX 2** |
| Focus ring on page — `--focus-ring` on `--bg` | 4.76 | 3 | ✅ |
| Focus ring on card — `--focus-ring` on `--surface` | 4.96 | 3 | ✅ |
| **Control boundary — `--border-strong` on `--bg`** | **1.70** | 3 | ❌ **FIX 3** |

### 2.3 Decorative rules are **not** failures — the distinction that matters

`--border` (1.56 / 1.25) and `--border-subtle` (1.34 / 1.09) are far below 3:1 and that is **correct**. SC 1.4.11 applies to *"visual information required to identify user interface components and states"* — not to decorative dividers. A section rule that could be deleted without losing meaning has no contrast requirement, and forcing one would wreck the quiet hairline aesthetic the brand committed to.

The failure is specifically **`--border-strong`, which `05-interaction.md` §2.2 ② uses as the secondary button's boundary.** That *is* required to identify a control. Fix 3 separates the two cases instead of conflating them.

---

## 3 · The three fixes — solved at the token level

Each value was found by sweeping lightness to the **minimum that clears the threshold on the worst surface**, so the result is a system guarantee. Patching the one failing instance would have left the next component free to fail.

### Fix 1 — `--danger`, dark mode

`0 65% 60%` → **`0 65% 67%`**

Solved minimum is L=66.2% (worst surface `--surface`, 4.51). Set to 67% for margin. Verified: clears 4.5:1 on all five dark surfaces.

*Note:* `--danger` currently has **no consumer on this site** — there are no error states, because there are no forms (`05-interaction.md` §1.1). It is retained for parity with the app's token set and is now safe if a consumer ever appears. An unsafe unused token is a trap for the next engineer; a safe one costs nothing.

### Fix 2 — `--warning`, light mode

`38 80% 42%` → **`38 80% 33%`**

Solved maximum is L=33.2%. Set to 33%. This one is **load-bearing**: Beat 4 uses `--warning` for *the one data path that leaves the machine* (`05-interaction.md` §3.1), which is information, not decoration. At 3.12:1 it was the least readable text in the most important diagram on the site.

Dark mode's `--warning` at 58% already clears (minimum is 44.7%) and is unchanged.

### Fix 3 — a new token: `--border-control`

```css
/* dark  */ --border-control: 150 10% 44%;   /* solved min 43.3% → 3.00:1 worst */
/* light */ --border-control: 150 10% 53%;   /* solved max 53.3% → 3.00:1 worst */
```

**Why a new token rather than raising `--border-strong`.** Raising `--border-strong` to 44% would apply a control-grade line to every place it is used decoratively, making the whole page louder and breaking the "flat-with-hairlines precision" commitment. Splitting the token encodes the actual rule:

| Token | Requirement | Used for |
|---|---|---|
| `--border-subtle` | none | dividers, table rules |
| `--border` | none | card hairlines, decorative edges |
| `--border-strong` | none | emphasis hairlines |
| **`--border-control`** | **≥3:1 on every surface** | **the visible boundary of any interactive element** |

**This fix is more urgent than it looks.** Surface steps in this system are between **1.00:1 and 1.23:1** — computed below — so a control genuinely cannot be identified by its fill:

| Adjacent surfaces | Dark | Light |
|---|---:|---:|
| `--bg` ↔ `--bg-subtle` | 1.07 | 1.04 |
| `--surface` ↔ `--surface-elevated` | 1.10 | **1.00** |
| `--bg` ↔ `--surface-elevated` *(secondary button on the page)* | 1.23 | 1.04 |

In light mode `--surface` and `--surface-elevated` are **both `#ffffff`** — a ratio of exactly 1.00. A secondary button specified as "elevated fill plus a strong hairline" would therefore have been, in light mode, **an invisible fill and a 1.70:1 line**: a control with no perceivable boundary at all. That is an SC 1.4.11 failure on every secondary button on the site, and it was invisible to inspection because it only shows up when you compute it.

**Consequence for `03-brand.md` §3.7:** the depth model is unchanged (flat, hairlines, one glow) — but it now carries the rule that **depth is never the sole indicator of an interactive boundary.**

### 3.1 Disabled states — the rule is deleted, not fixed

`05-interaction.md` §2.1 specified a generic `opacity: .5` for disabled. Computed, that lands at **4.43:1 (dark, elevated)** and **3.05:1 (light)** — failing. Rather than invent a compliant disabled palette:

**No element on this site has a disabled state.** The inventory (`05-interaction.md` §2.2) shows every element's disabled row as `—` or "never disabled" — the primary CTA explicitly so, because a download link that cannot be pressed is a bug. The generic rule is removed. If a disabled control is ever added, it needs a computed token, not an opacity.

*(Disabled controls are exempt from 1.4.3 under WCAG, so this would not have been a formal failure — but shipping unreadable text on the grounds that a spec permits it is not the standard this brief sets.)*

---

## 4 · Focus indicators — the two-layer ring, proved

`03-brand.md` §3.8 defines:

```css
--focus: 0 0 0 2px hsl(var(--bg)), 0 0 0 4px hsl(var(--focus-ring));
```

A naive single-ring design **fails** on the primary CTA: `--focus-ring` directly against `--primary` computes to **1.25:1 (dark)** and **1.13:1 (light)** — effectively invisible, and the most common focus bug on branded buttons, because it only appears on the one control that matters most.

The two-layer ring already solves it, and here are the numbers that prove it rather than assert it:

| Layer boundary | Dark | Light | Min |
|---|---:|---:|---|
| Inner `--bg` gap against the button fill `--primary` | **7.45** | **5.38** | 3 ✅ |
| Outer `--focus-ring` against the inner `--bg` gap | **9.34** | **4.76** | 3 ✅ |
| Outer `--focus-ring` against the page `--bg` | 9.34 | 4.76 | 3 ✅ |

Both boundaries clear 3:1 in both schemes, on the hardest element. **The 2px inner gap is load-bearing and must never be removed for a "tighter" ring.**

Additional focus rules:
- `:focus-visible` only — never `:focus` (which would ring on mouse clicks).
- **No transition on the ring** (`05-interaction.md` §2.1): an animated focus indicator is unusable at speed for keyboard navigators.
- The ring is drawn **outside** the element via `box-shadow`, so it never changes layout and never causes reflow-on-focus.
- `outline: none` without a superior replacement in the same rule is banned.

---

## 5 · Structure & semantics

| Requirement | Commitment |
|---|---|
| **One `<h1>`** | Beat 1's headline. Verified per page — `linux.html`, `privacy.html`, `support.html`, `404.html` each get exactly one |
| **Unbroken heading order** | h1 → h2 per beat → h3 within. No level skipped for styling; size comes from tokens, not from tag choice |
| **Landmarks** | `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, one `<section aria-labelledby>` per beat, `<footer>`. Every `<section>` has an accessible name — an unnamed region is worse than no region |
| **Lists are lists** | The cascade is `<ol>` (order is the argument), clusters and changelog are `<ul>` |
| **Table is a table** | Beat 7 is a real `<table>` with `<caption>`, `<th scope="col">`, `<th scope="row">` — not a grid of divs |
| **No `<div onclick>`** | Every interactive element is `<button>`, `<a>`, `<summary>`, or a fully-implemented ARIA pattern |
| **ARIA only where semantics can't reach** | Exactly two uses site-wide: the source `radiogroup` and the two `aria-live` regions. Everything else is native HTML |
| **Alt text** | Meaning, not description. Decorative SVG gets `aria-hidden="true"`. The threshold divider is decorative and silent. Strings in `09-copy.md` §8 |
| **Language** | `<html lang="en">`. No mixed-language content |
| **Accessible name = visible label** | No `aria-label` contradicts visible text (`09-copy.md` §8) |

---

## 6 · WCAG 2.2 — the criteria added since 2.1

Recorded individually, because "we target 2.2" is only meaningful if the new criteria were actually considered.

| SC | Level | Status |
|---|---|---|
| **2.4.11 Focus Not Obscured (Min)** | AA | ✅ The header is **not sticky** — nothing can obscure a focused element. This is a deliberate architectural choice; a sticky header is the usual cause of this failure |
| **2.5.7 Dragging Movements** | AA | ✅ N/A — nothing on the site is draggable (`04-motion.md` §4 row 13) |
| **2.5.8 Target Size (Min, 24×24)** | AA | ✅ Exceeded — the site's floor is **44×44** (`05-interaction.md` §2.1) |
| **3.2.6 Consistent Help** | A | ✅ Support is in the footer, in the same position, on every page |
| **3.3.7 Redundant Entry** | A | ✅ N/A — no forms, no multi-step process |
| **3.3.8 Accessible Authentication (Min)** | AA | ✅ N/A — no authentication anywhere. There is no account |
| 4.1.1 Parsing | — | Removed in 2.2; not applicable |

Two of these are N/A *because of product decisions the site is making anyway* — no account, no forms — which is worth noting: the privacy architecture and the accessibility profile are the same decision seen from two angles.

---

## 7 · Zoom, reflow, and forced colors

| Requirement | Approach | Verified |
|---|---|---|
| **1.4.4 Resize text (200%)** | `rem` throughout, zero `px` font sizes (`03-brand.md` §3.4). Equivalent to a 720px viewport | Phase 10 |
| **1.4.10 Reflow (400%)** | Equivalent to 360px. Grids collapse via `auto-fit` and container queries, never fixed column counts. Only the comparison table scrolls, inside its own labelled region | Phase 10 |
| **1.4.12 Text Spacing** | No fixed heights on text containers; no `overflow: hidden` on any element containing prose | Phase 10 |
| **forced-colors** | `forced-color-adjust: auto` left alone. **The threshold glow disappears in forced-colors — therefore no information may depend on it.** Every verdict carries a text label; the Beat 4 leaving-path is dashed *and* coloured. Focus uses the `Highlight` system colour | Phase 10 |
| **1.4.1 Use of Color** | Links underlined at rest, always. Verdicts are words. No status conveyed by hue alone | §2, and Phase 10 |

The forced-colors rule deserves emphasis: the site's one signature device is a **glow**, and glows do not survive forced-colors mode. The design is only safe because the threshold is *emphasis*, never *information* — a constraint that has to hold from the first line of CSS, not be retrofitted.

---

## 8 · The audit log — scores per round

Per §11.1 of the brief, every round is recorded. Filled in as rounds run; **empty rows are not scores.**

| Round | When | Tool | Scope | Score | Findings |
|---|---|---|---|---|---|
| Baseline | Phase 1 | `design:accessibility-review` + browser | Current live site | see `00-audit.md` | 4 truth violations, no focus styles anywhere, contrast failures |
| **Token sweep** | **Phase 7 (this doc)** | **Computed luminance script** | **All state pairs, both schemes** | **3 failures / 21 pairs** | **Fixes 1–3, §3. All resolved** |
| R1 | Phase 10 | `axe` + `design:accessibility-review` + `impeccable audit` | Per section, as built | — | — |
| R2 | Phase 11 | Full battery, full page | — | — | — |
| R3 | Phase 12 | Full battery + SR read-through | — | — | — |

### 8.1 Screen-reader read-through — the protocol

Recorded verbatim in Phase 10, not summarised. The three passages most likely to fail, flagged in advance so the test is targeted rather than hopeful:

1. **The cascade** — must produce **one** announcement, not eight (`05-interaction.md` §5.2). The most likely defect on the site.
2. **Beat 2's split text** — must expose **one** text node containing the whole sentence. If the tree shows separate word nodes, the reveal is deleted rather than debugged (`04-motion.md` §7.2).
3. **The comparison table** — row and column headers must associate, so a cell announces as *"LockinRa — knows your current task — yes"* rather than *"yes."*

---

## 9 · Changes this phase requires in other documents

| Doc | Change | Status |
|---|---|---|
| `03-brand.md` §3.1 | `--danger` dark 60% → **67%** | ✅ applied |
| `03-brand.md` §3.3 | `--warning` light 42% → **33%** | ✅ applied |
| `03-brand.md` §3.1/§3.3 | **new** `--border-control` token, both schemes | ✅ applied |
| `03-brand.md` §3.7 | Depth is never the sole indicator of an interactive boundary | ✅ applied |
| `05-interaction.md` §2.1 | Generic `opacity:.5` disabled rule **removed** | ✅ applied |
| `05-interaction.md` §2.2 ② | Secondary button boundary → `--border-control` | ✅ applied |
| `08-architecture.md` | The token layer must make `--border-control` the only legal border on an interactive element | Phase 9 |
