# 03 · Brand & visual system

**Date:** 2026-08-01 · **Status:** direction chosen, system locked
**Prototype:** [`design/proto/directions.html`](proto/directions.html) — all three directions built as real HTML and judged in a browser, per §8 of the brief.

---

## 1 · The three directions

Built with identical content and identical base tokens so the comparison isolates **direction**, not palette.

### A — “The Instrument”
> LockinRa is a precision instrument for attention. Everything is ruled, labelled and sourced.

- **Organising device:** the *measurement rule* — a hairline column with mono tick labels that annotates every claim with where it came from.
- **Depth model:** hairlines and surface-tone only. No shadow, no glow.
- **Verdict:** strongest at making the mechanism legible — the cascade explains itself, which is precisely what must replace the deleted “~90%” statistic. The mono source column is genuinely ownable.
- **Failure mode:** reads as a dashboard, not a product with a point of view. It informs but does not *move*. Personas 1 and 2 arrive frustrated, not curious — this direction gives them nothing to feel.

### B — “The Quiet Room”
> The door locks and the noise stops.

- **Organising device:** the **threshold** — one lit horizontal line dividing *outside the block* (dim, desaturated, receding) from *inside* (calm, lit, saturated).
- **Depth model:** atmospheric. Light falls from the threshold; space does the work.
- **Verdict:** strongest emotionally, and the only direction recognisable from across a room. It dramatises the enemy without a word — the renegotiation literally lives *above the line*. One device can carry the entire site: every section boundary is a door.
- **Failure mode:** proves nothing on its own. Left alone it is a beautiful, generic minimal template, and it fails persona 3, who needs evidence in the first screen, not atmosphere.

### C — “The Evidence File”
> This is a trust product, so the site is a dossier.

- **Organising device:** the **citation** — every factual claim carries a marker resolving to a real, checkable source.
- **Depth model:** flat, editorial, print-like. Rules and footnotes instead of elevation.
- **Verdict:** strongest on credibility, and the only direction that converts the audit's worst finding into an asset — volunteering *“task titles are not encrypted”* is the single most persuasive sentence available for persona 3.
- **Failure mode:** dry and academic. Converts the skeptic, bores everyone else. A student at 11pm before a deadline will not read a footnoted dossier.

---

## 2 · The decision

> **Ship B as the spatial and emotional frame. Graft C's citation discipline in as the trust mechanism. Use A's mono annotation strictly for measured values.**

This is a synthesis, not a compromise, because the three operate at **different layers** and never contend for the same decision:

| Layer | Owner | Rule |
|---|---|---|
| Space & rhythm | **B** | The threshold at every section boundary; inside/outside duotone; generous negative space |
| Treatment of claims | **C** | Nothing asserted without a checkable source; limits volunteered, not hidden |
| Annotation of numbers | **A** | Mono reserved **exclusively** for measured values — never for headings or decoration |

**Why the losing directions' weaknesses decided it.** The strategy names three personas, and each direction is fatal to at least one on its own: B alone loses persona 3 (proves nothing), C alone loses personas 1–2 (moves nobody), A alone loses everyone (memorable to no one — and *brand distinctiveness* is a scored dimension). Only the synthesis survives all three.

### 2.1 The one device

Per the Nothing principle — recognisability comes from refusal, and one device repeated beats five used once:

> **The threshold: the lit line between the noise and the work.**

It is simultaneously the enemy (*the renegotiation* lives above the line), the promise (*the rest goes quiet* is below it), and the product (*a guardian standing at a door*). It is one graphic idea that no competitor owns, and it survives at every scale — a full-bleed section divider, a card's top edge, a 1px rule under a heading, the focus ring itself.

**Discipline:** the threshold is the *only* glow on the site. Nothing else emits light. The current site has 20+ radial-gradient glows; the rebuild has one recurring source, which is what makes it read as intentional rather than as an effect.

---

## 3 · The token system

**Foundation:** the app's own **ADR 0013** design language, extended — not replaced. Tokens are stored as bare HSL triplets exactly as the app stores them, so the site and the product are provably the same system. This is the Linear principle applied honestly: the site is a specimen of the product's craft standard because it is *literally built from the product's tokens*.

**One rule, absolutely:** components consume tokens. **No raw colour, size, or spacing value appears in a component, ever.** The audit found 137 raw `hsl()` literals bypassing 51 declared tokens; that is the failure this rule exists to prevent.

### 3.1 Colour — with computed contrast

```css
:root {
  /* Surfaces — depth by lightness, per ADR 0013 §6 */
  --bg:               150 3% 6%;
  --bg-subtle:        150 3% 9%;
  --surface:          150 3% 11%;
  --surface-elevated: 150 3% 14%;
  --surface-overlay:  150 3% 17%;

  /* Content */
  --text:             150 8% 93%;
  --text-muted:       150 6% 68%;
  --text-subtle:      150 5% 57%;   /* ⚠ RAISED from ADR 0013's 50% — see §3.2 */

  /* Lines — decorative */
  --border:           150 8% 20%;
  --border-strong:    150 10% 30%;
  --border-subtle:    150 7% 16%;

  /* Lines — INTERACTIVE. The visible boundary of any control. ≥3:1 on every
   * surface by construction; see 06-accessibility.md §3 Fix 3. Decorative
   * borders above have no contrast requirement and must never be used here. */
  --border-control:   150 10% 44%;

  /* Brand */
  --primary:          150 38% 52%;
  --primary-hover:    150 42% 58%;
  --primary-fg:       150 40% 8%;
  --primary-subtle:   150 20% 17%;

  /* Status */
  --danger:           0 65% 67%;   /* ⚠ RAISED from 60% — 4.45 on --surface. 06-a11y §3 Fix 1 */
  --warning:          38 70% 58%;

  /* Coach accents (from ADR 0013 §3.1) */
  --coach-supportive: 150 38% 52%;
  --coach-dark:       150 6% 70%;
  --coach-drill:      8 50% 60%;

  /* Interaction */
  --focus-ring:       150 55% 55%;
}
```

**Measured contrast — every pair computed, none estimated.** Values from a WCAG relative-luminance sweep run in-browser.

| Foreground | on `--bg` | `--bg-subtle` | `--surface` | `--surface-elevated` | `--surface-overlay` |
|---|---:|---:|---:|---:|---:|
| `--text` (93%) | 16.8 ✅ | 15.7 ✅ | 14.9 ✅ | 13.6 ✅ | 12.3 ✅ |
| `--text-muted` (68%) | 8.77 ✅ | 8.21 ✅ | 7.79 ✅ | 7.11 ✅ | 6.41 ✅ |
| **`--text-subtle` (57%)** | **6.31 ✅** | **5.91 ✅** | **5.60 ✅** | **5.11 ✅** | **4.61 ✅** |
| `--primary` (52%) | 7.43 ✅ | 6.96 ✅ | 6.60 ✅ | 6.03 ✅ | 5.43 ✅ |
| `--focus-ring` (55%) | 7.36 ✅ | 6.89 ✅ | 6.54 ✅ | 5.97 ✅ | 5.38 ✅ |

**Every text token clears 4.5:1 on every surface level.** That is a *system guarantee*: any legal token combination is compliant by construction, so no component can accidentally ship a contrast failure.

### 3.2 The `--text-subtle` correction (worked, not guessed)

ADR 0013 specifies `--text-subtle: 150 5% 50%`. Measured against the ADR's own surfaces:

| Background | Ratio at L=50% | |
|---|---:|---|
| `--bg` | 5.03 | ✅ |
| `--bg-subtle` | 4.71 | ✅ |
| `--surface` | **4.46** | ❌ |
| `--surface-elevated` | **4.07** | ❌ |
| `--surface-overlay` | **3.68** | ❌ |

A lightness sweep found **L=57% is the minimum that clears 4.5:1 against every surface level**, including the lightest. The site adopts 57%.

Two consequences worth stating:
1. This defect was **found in my own Phase 4 prototype by measuring it**, before any production code existed — which is the entire argument for computing contrast rather than eyeballing it.
2. **The app has the same latent defect**, since it uses the ADR value. That is out of scope for this site rebuild and has been raised separately — including the question of why ADR 0013 §8's claimed axe-core CI gate did not catch it, because a passing gate that misses a real failure is the more serious bug.

### 3.3 Light mode

The site commits to **dark as the primary, designed mode**, with a full light mode as a first-class peer (not an afterthought). Rationale: the product is a focus tool used in long sessions, its own default is dark, and the threshold device depends on light emerging from darkness — a light mode must express the threshold as *a shadow gap* rather than a glow, which is a deliberate re-interpretation rather than an inversion.

```css
.light {
  --bg: 150 12% 98%;  --bg-subtle: 150 10% 96%;
  --surface: 0 0% 100%; --surface-elevated: 0 0% 100%; --surface-overlay: 150 5% 99%;
  --text: 150 14% 14%; --text-muted: 150 9% 38%; --text-subtle: 150 8% 43%;  /* raised from 55% */
  --border: 150 8% 88%; --border-strong: 150 10% 75%; --border-subtle: 150 6% 94%;
  --border-control: 150 10% 53%;   /* ≥3:1 on every light surface — 06-a11y §3 Fix 3 */
  --primary: 150 32% 34%; --primary-fg: 0 0% 100%;
  --danger: 0 65% 47%;
  --warning: 38 80% 33%;           /* ⚠ DARKENED from 42% — was 3.12 on --bg. 06-a11y §3 Fix 2 */
  --focus-ring: 150 45% 34%;
}
```

**🚨 Light mode's surface steps are 1.00:1.** `--surface` and `--surface-elevated` are both `#ffffff`. Depth in light mode therefore comes *entirely* from borders and shadow gaps — which is why `--border-control` exists and why **depth is never the sole indicator of an interactive boundary** (§3.7). Computed in `06-accessibility.md` §3.

`--text-subtle` is raised from ADR 0013's light value (`150 6% 55%` → 3.6:1 on white ❌) to `150 8% 43%`, which clears 4.5:1 on `#ffffff`. **Same class of defect, same fix, both modes.**

### 3.4 Type

**No webfonts.** A system stack, argued:

```css
--sans: "Segoe UI Variable Text","Segoe UI",-apple-system,BlinkMacSystemFont,
        "SF Pro Text",system-ui,sans-serif;
--mono: ui-monospace,"Cascadia Code","Segoe UI Mono","SF Mono",Menlo,Consolas,monospace;
```

The brief invites either answer if argued. The argument for system:
1. **Zero requests, zero bytes, zero render-blocking, zero swap-CLS.** The current site's Google Fonts link is render-blocking with a guaranteed reflow and no metric-compatible fallback.
2. **It removes two of the four third-party origins** on a page whose thesis is that nothing leaves your machine — at literally no cost.
3. **The primary platform is Windows**, where `Segoe UI Variable` is an excellent variable typeface — and ADR 0013's own fallback chain already names it. The app itself moved to a Segoe UI Variable stack in its 2026-07 polish pass, so this *matches the shipping product*.
4. ADR 0013 describes self-hosted Inter in `packages/ui/theme/fonts/` — **those files do not exist in the repo.** The "self-hosted Inter" baseline is aspirational, so there is nothing to stay consistent with.

Trade-off accepted and stated: the site will render in a different typeface on macOS (SF Pro) than on Windows (Segoe UI Variable). For a Windows-first product whose Linux build is explicitly beta, per-platform-native rendering is a feature, not a defect.

**Scale** — extends ADR 0013's 9 steps with three display sizes the app never needed, using `clamp()` for fluid behaviour. **9 sizes total on the site, replacing 41.**

| Token | Size | Leading | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `--fs-display` | `clamp(2.6rem, 6vw, 4.5rem)` | 1.02 | 600 | -0.035em | Beat 1 hero only |
| `--fs-h1` | `clamp(2rem, 4vw, 3rem)` | 1.08 | 600 | -0.03em | Beat headline |
| `--fs-h2` | `clamp(1.5rem, 2.4vw, 2rem)` | 1.15 | 600 | -0.02em | Sub-head |
| `--fs-h3` | `1.125rem` | 1.4 | 600 | -0.01em | Card title |
| `--fs-lede` | `clamp(1.0625rem, 1.5vw, 1.25rem)` | 1.6 | 400 | 0 | Beat lede |
| `--fs-body` | `1rem` | 1.6 | 400 | 0 | Body |
| `--fs-sm` | `0.875rem` | 1.55 | 400 | 0 | Secondary |
| `--fs-xs` | `0.8125rem` | 1.5 | 400 | 0 | Meta |
| `--fs-label` | `0.6875rem` | 1.4 | 500 | 0.16em | Mono overline |

**Rules.** Body measure 60–72ch, lede 44–52ch, display ≤18ch. `rem` throughout — **never `px`** (the audit found `px` sizes site-wide, which ignore the user's browser font-size setting). Mono is reserved for *measured values, system speech, and source citations* — never headings, never decoration.

### 3.5 Space

One geometric scale. **8 steps, replacing 68 padding values.**

```css
--s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem;
--s-6:1.5rem; --s-8:2rem; --s-12:3rem; --s-16:4rem;
--s-24:6rem;  --s-32:8rem;
```

**Rule for when each is used:** `--s-1/2` intra-component (icon↔label); `--s-3/4` component padding; `--s-6/8` between components; `--s-12/16` between groups; `--s-24/32` between beats.

**Vertical rhythm — section padding is a single fluid token, not 12 hand-tuned values:**
```css
--beat-y: clamp(4rem, 9vw, 8rem);
```

### 3.6 Layout

```css
--w-prose: 68ch;    /* body text */
--w-narrow: 42rem;  /* lede, centred beats */
--w-content: 72rem; /* standard beat */
--w-wide: 80rem;    /* comparison table, full-bleed */
--gutter: clamp(1.25rem, 4vw, 2.5rem);
```

**Breakpoints derived from where the content breaks, not from device folklore:**
- `48rem` (768px) — the beat grids stop fitting two columns
- `64rem` (1024px) — the comparison table fits 7 columns without scroll
- `90rem` (1440px) — display type stops growing; measure caps

Container queries used where a *component* should decide (cards in variable-width beats); media queries only for page-level layout.

### 3.7 Depth

**Commitment: flat-with-hairlines precision, plus exactly one light source.** ADR 0013 §6 already establishes that dark mode gets depth from surface lightness, not shadow — the site follows this, which also settles the mixing prohibition.

```css
--elev-0: none;                                   /* page */
--elev-1: inset 0 1px 0 hsl(0 0% 100% / .04);     /* card: hairline highlight only */
--elev-2: 0 8px 24px hsl(150 30% 3% / .5),
          inset 0 1px 0 hsl(0 0% 100% / .05);     /* popover / the nudge */
--elev-3: 0 24px 56px hsl(150 30% 3% / .6),
          inset 0 1px 0 hsl(0 0% 100% / .06);     /* modal — used at most once */
--threshold: 0 0 24px hsl(var(--primary) / .45);  /* THE one glow */
```

**The one rule this model must carry (added Phase 7):** surface steps in this system compute to **1.00–1.23:1** — visually real, but far below the 3:1 that SC 1.4.11 requires to *identify a control*. Therefore: **depth is never the sole indicator of an interactive boundary.** Every interactive element's edge is drawn with `--border-control`, never with an elevation step alone. See `06-accessibility.md` §3, Fix 3.

Radii, from ADR 0013 §5: `--r-sm:6px` (buttons/inputs) · `--r-md:8px` (cards) · `--r-lg:12px` (modals/panels) · `--r-full:999px` (pills).

### 3.8 Focus, selection, scrollbars

```css
--focus: 0 0 0 2px hsl(var(--bg)), 0 0 0 4px hsl(var(--focus-ring));
```
Applied on `:focus-visible` to **every** interactive element — the audit found no focus style anywhere. Two-layer ring so it reads on any surface; measured ≥5.3:1 against every background (§3.1). `outline: none` without a superior replacement is banned.

### 3.9 Iconography

One family, drawn inline as SVG: **1.5px stroke, 24×24 viewBox, round caps and joins, currentColor**, optically aligned to the text baseline. The current site's 116 inline SVGs vary between 1.6, 1.7, 2, 2.2, 2.4 and 3.4 stroke widths — six weights in one system. **One weight, no exceptions**, except the wordmark's `M8 5 V17 H17` glyph, which is a logo and therefore not an icon.

### 3.10 Product surfaces — the honesty rule

The site contains **no photographs and no fabricated screenshots.** Product surfaces are built as **live HTML reproductions using the tokens above** — which is what makes the signature moment interactive at all.

**The rule that keeps this honest:** these surfaces are *reproductions of the real UI, built from the real design tokens*, and the site never captions them as screenshots, never adds a fake camera frame, and never depicts a feature that does not ship. Every string shown must be something the app can actually produce. Where a surface shows a number, it is either clearly illustrative (a demo task) or sourced.

Framing rules, so 30% of perceived quality is not lost to inconsistency: identical `--r-lg` corner, identical `--elev-2`, identical window chrome, identical inner padding, cropped tight to the one interaction that matters (the Raycast principle) — **never a full window shrunk to fit**.

---

## 4 · What a different engineer would need

This document plus `04-motion.md` should reproduce the site. The invariants, in priority order:

1. **Components consume tokens. No raw values. Ever.**
2. **One glow: the threshold.** Everything else gets hairlines and surface tone.
3. **Mono means measured.** If it is not a number, a system utterance, or a citation, it is not mono.
4. **Every claim carries a source, or it is cut.**
5. **`rem` never `px`; `:focus-visible` on everything; every token pair ≥4.5:1 by construction.**
