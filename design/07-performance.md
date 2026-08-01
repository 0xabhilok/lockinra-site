# 07 · Performance — budgets, enforced

**Date:** 2026-08-01 · **Status:** budgets set, baseline measured, projections stated as projections
**Rule this document is held to:** *"It feels fast" is not a measurement.* Every number below is either **measured** (with the method named) or **projected** (and labelled as such until Phase 10 measures it). No number is asserted.

---

## 1 · The budget

| Metric | Budget | Enforcement point |
|---|---|---|
| LCP (mid-tier mobile, 4G) | **< 1.8s** | Phase 10, per build |
| CLS | **< 0.02** | Phase 10 |
| INP | **< 150ms** | Phase 10 |
| Total JS (compressed) | **< 80 KB** | Every commit — `du` on the built file |
| Total CSS (compressed) | **< 40 KB** | Every commit |
| Initial requests | **< 25** | Phase 10 network panel |
| Above-the-fold weight | **< 400 KB** | Phase 10 |
| Sustained scroll FPS | **≥ 58** | Per section (`04-motion.md` §6.4) |

**A budget that is only checked at the end is a wish.** JS and CSS byte counts are checkable with a shell command and are therefore checked *per commit*, not per phase. The rest need a browser and are checked per section during Phase 10.

---

## 2 · Baseline — the current site, measured

Byte sizes measured directly (`wc -c`, `gzip -9`) at commit `858c2a4`, not estimated.

| File | Raw | Gzip | Fate |
|---|---:|---:|---|
| `index.html` | 178,080 B | **32,582 B** | Replaced |
| `support.js` (the dc-runtime) | 55,416 B | **14,719 B** | **Deleted** |
| `privacy.html` | 9,321 B | 3,621 B | Rebuilt into the system |
| `linux.html` | 8,685 B | 3,442 B | Rebuilt |
| `support.html` | 4,805 B | 2,049 B | Rebuilt |
| `favicon.ico` | 17,394 B | — | ⚠️ Oversized; see §5.3 |
| `icon-512.png` | 14,782 B | — | Kept |
| `icon-192.png` | 5,736 B | — | Kept |
| `apple-touch-icon.png` | 5,385 B | — | Kept |
| `thumbnail.webp` | 3,846 B | — | ⚠️ **320×190** — replaced (§5.4) |
| `favicon-32.png` | 1,300 B | — | Kept |
| `favicon.svg` | 480 B | — | Kept |

### 2.1 The baseline's three structural costs

1. **~45 KB gzip of React + ReactDOM from `unpkg.com`**, render-blocking, plus 14.7 KB of `dc-runtime`. The page's ability to render at all depends on a CDN this project does not control. **This is the single largest performance and reliability defect on the site,** and deleting it is most of the win.
2. **Render-blocking Google Fonts** with no `preload` and no metric-compatible fallback → a guaranteed swap reflow contributing to CLS.
3. **A 3.6s opaque full-screen splash** gating every load, with no `localStorage` check. It is almost certainly the LCP element, and **LCP cannot fire meaningfully before it clears.** No measured LCP figure for the current site is quoted here, because a splash-gated LCP measures the splash, not the page — a number that would flatter the rebuild for the wrong reason.

**Four third-party origins**: `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `static.cloudflareinsights.com`.

---

## 3 · The rebuild's byte budget — projected, with the reasoning

Labelled **projection** throughout. Phase 10 replaces each with a measurement.

| Asset | Projected gzip | Reasoning |
|---|---:|---|
| `index.html` (markup only) | **~9 KB** | ~1,900 words (`02-strategy.md`) + semantic structure. The current 32.6 KB is mostly 648 inline `style=` attributes and 116 inline SVGs, both of which leave |
| `site.css` | **~7 KB** | One stylesheet, `@layer`-organised. Replaces 41 font sizes / 137 colours / 68 paddings with ~35 tokens |
| `site.js` | **~4 KB** | Complete runtime: one IntersectionObserver, the cascade state machine, the platform probe, the motion policy listener (`04-motion.md` §6.3) |
| Icons (unchanged) | — | Not on the critical path |
| OG card | ~40 KB | Not on the critical path; `og:image` is fetched by crawlers, not by visitors |
| **Total critical path** | **~20 KB** | vs. **~92 KB** today (32.6 + 14.7 + ~45 CDN) |

**Headroom against budget: CSS ~7/40 KB, JS ~4/80 KB.** The budgets are not tight, which is the point — they exist so that a future "let's just add a library" has a number to argue against, not because the current plan is near them.

### 3.1 Library accounting — the full ledger

| Candidate | Compressed | Verdict |
|---|---:|---|
| React + ReactDOM | ~45 KB | ❌ **Deleted.** Nothing on this page needs a component runtime |
| `dc-runtime` (`support.js`) | 14.7 KB | ❌ **Deleted** |
| GSAP + ScrollTrigger | ~34 KB | ❌ One scrubbed element; `animation-timeline: view()` does it natively at 0 KB (`04-motion.md` §6.3) |
| Motion One | ~5 KB | ❌ No springs needed; WAAPI needs no wrapper for ~8 animations |
| Lenis | ~3 KB | ❌ Refused on **correctness** — cannot guarantee find-in-page, Home/End, and reduced-motion |
| Google Fonts | ~2 requests, render-blocking | ❌ System stack (`03-brand.md` §3.4) |
| **Cloudflare Insights** | ~1 KB, async | ✅ **Kept** — the one deliberate exception (§3.2) |
| **Total third-party** | **~1 KB, 1 origin** | Down from ~60 KB across 4 origins |

### 3.2 The one third party we keep, and why that is defensible

Cloudflare Insights stays. The user's decision was *"pragmatic on 3rd parties — keep Cloudflare analytics"*, and the honest case is:

- It is **cookieless** and sets no identifier.
- It is **async and non-render-blocking** — it cannot affect LCP.
- It is ~1 KB.
- **It is disclosed on the page itself**, in the footer and in Beat 4: *"This page loads one script: cookieless analytics from Cloudflare. Four origins became one. Open devtools — that's the whole list."*

The audit's finding was never "analytics is wrong" — it was that **"0 bytes leave your device. ever."** was printed above four third-party requests. Going to one origin *and saying so* resolves the contradiction honestly. A site that claims zero and ships one is lying; a site that ships one and says one is credible. Persona 3 will open devtools and find exactly what the page promised.

---

## 4 · Techniques — what earns its place

| Technique | Applied? | Detail |
|---|---|---|
| **Critical CSS inline, rest deferred** | ⚠️ **No — and this is the right call** | The entire stylesheet is ~7 KB gzip. Splitting it into a critical inline chunk plus a deferred remainder adds a build step, a maintenance seam, and a FOUC risk **to save nothing** — 7 KB is smaller than most sites' critical chunk alone. One `<link rel="stylesheet">` in `<head>`, render-blocking, and that is correct at this size |
| **Fonts preloaded / metric-matched** | ✅ N/A by design | No webfonts. Zero requests, zero swap-CLS, zero FOIT. The class of problem is removed |
| **AVIF/WebP, srcset, explicit dimensions** | ✅ | Only the OG card is a raster image; it is not on the visitor's critical path. Every `<img>` carries `width`/`height` |
| **`fetchpriority="high"` on the LCP image** | ✅ N/A | **The LCP element is text** — Beat 1's `<h1>`, rendered from HTML with a system font. There is no LCP image to prioritise, which is the fastest possible LCP by construction |
| **`loading="lazy"` below the fold** | ✅ | Applies to nothing; recorded so the absence is deliberate |
| **`content-visibility: auto` off-screen** | ⚠️ **Restricted** | Applied to Beats 6–9 only, each with `contain-intrinsic-size` set from the measured rendered height. **Not applied above the fold** (it would delay LCP) and **not applied to the comparison table** (`content-visibility` can break find-in-page in some engines, and Beat 7 is the section a skeptical reader searches). A performance technique that breaks Ctrl+F is a net loss on a document |
| **Zero render-blocking third parties** | ✅ | The one third party is async |
| **SVG optimised** | ✅ | One icon family, 1.5px stroke, 24×24, `currentColor`. Current site: 116 inline SVGs at six stroke weights |
| **Video** | ✅ N/A | No video. The signature moment is DOM, driven by the visitor |
| **Service worker** | ❌ Refused | A cache layer on a 5-page static site adds a stale-content failure mode for no gain (`05-interaction.md` §6) |

### 4.1 The four CLS sources, and why each is zero

CLS is budgeted at **< 0.02**, which is strict. It is achievable because every source of layout shift is removed structurally rather than mitigated:

| Source | Status |
|---|---|
| Font swap | **Impossible** — no webfonts |
| Images without dimensions | **Impossible** — every `<img>` has `width`/`height`; there are almost none |
| Late-injected content (ads, embeds, banners) | **Impossible** — none exists |
| JS-driven layout on load | **Prevented** — the platform probe (`05-interaction.md` §4.1) *collapses* alternates rather than inserting a promoted CTA, so it removes height rather than adding it. The reserved space is set in CSS before JS runs |
| Focus ring | **Prevented** — drawn with `box-shadow`, outside layout |
| `<details>` opening | **Not counted** — user-initiated within 500ms is excluded from CLS |

**The projected CLS is 0.00**, and the budget's job is to catch a regression, not to leave room.

---

## 5 · Assets

### 5.1 The animation runtime
Complete cost: one `IntersectionObserver`, one rAF loop **that runs only while Beat 3 is in view**, the cascade state machine, and the ambient breath's play/pause toggle. Projected **~4 KB gzip**, 0 KB of library.

### 5.2 The ambient loop's idle cost
**Zero.** The threshold breath pauses when its section leaves the viewport and on `visibilitychange` (`04-motion.md` §3.2). The current site runs **14 infinite CSS timelines off-screen for the life of the page** — on a page selling *"without eating the day's battery."* That defect is the reason the rule exists.

### 5.3 `favicon.ico` — 17.4 KB
The largest non-icon asset on the site and larger than the projected stylesheet. It carries legacy multi-resolution bitmaps. **Reduced to 16×16 + 32×32 only**, with `favicon.svg` (480 B) serving every modern browser. Projected: **~4 KB**, saving ~13 KB. Not on the critical render path, but it is a request on every load and it costs nothing to fix.

### 5.4 The OG card — currently 320×190
Below the 1200×630 spec, so every social share renders a small, upscaled, blurry card. **Replaced at 1200×630.** Per `03-brand.md` §3.10 the site ships no fabricated screenshots, so the card is **typographic**: the wordmark, Beat 1's headline, and the threshold device, built from the real tokens. This is the one place a generative-media tool could be used — and it is declined, because a generated image would fight a design language whose entire premise is measured restraint, and `03-brand.md` already rules that generated imagery which fights the system gets thrown away.

---

## 6 · Measurement protocol

Phase 10 runs this per section and full-page. Recorded, not recalled.

```js
// LCP
new PerformanceObserver(l => { const e = l.getEntries().at(-1);
  console.log('LCP', e.startTime, e.element); }).observe({type:'largest-contentful-paint', buffered:true});

// CLS (session windows)
let cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries())
  if (!e.hadRecentInput) cls += e.value; console.log('CLS', cls);
}).observe({type:'layout-shift', buffered:true});

// Long tasks during scroll — pass = zero entries
new PerformanceObserver(l => l.getEntries().forEach(e =>
  console.warn('LONG TASK', e.duration))).observe({type:'longtask', buffered:true});

// Frame histogram — pass = p95 ≤ 18ms, worst ≤ 33ms
let t = performance.now(); const d = [];
(function f(){ const n = performance.now(); d.push(n - t); t = n;
  if (d.length < 300) requestAnimationFrame(f);
  else { d.sort((a,b)=>a-b); console.log('p50', d[150], 'p95', d[285], 'worst', d.at(-1)); }
})();
```

**Conditions, fixed so runs compare:** mid-tier mobile emulation, 4G throttle, 4× CPU slowdown, cache disabled, three runs, median reported. Byte counts from `gzip -9 -c <file> | wc -c` — the same command that produced §2, so before and after are measured identically.

**A section is not "done" until its numbers are in §7.** A missing row is a missing measurement, never an assumed pass.

---

## 7 · Results — filled in during Phase 10

Byte counts are **measured** with `gzip -9 -c <file> | wc -c` — the same command that produced §2, so before and after are measured identically. Core Web Vitals rows stay empty until they are actually measured under the §6 conditions; an empty cell is a missing measurement, never an assumed pass.

| Build | LCP | CLS | INP | JS gz | CSS gz | HTML gz | Critical path | Scroll p95 |
|---|---|---|---|---|---|---|---|---|
| Baseline `858c2a4` | *splash-gated — §2.1* | — | — | 14,719 + ~45 KB CDN | *inline* | 32,582 | **~92 KB** | — |
| All 9 beats + 404 | — | — | — | 6,262 | 9,722 | 8,563 | 24,547 B | — |
| **+ round 1 (Beat 6 surfaces, copy pass)** | — | — | — | **6,262** | **10,751** | **9,258** | **26,271 B** | — |
| Budget | <1.8s | <0.02 | <150ms | 80,000 | 40,000 | — | — | ≥58 |
| **Headroom** | — | — | — | **92% unused** | **76% unused** | — | **−73%** | — |

Per-file, measured 2026-08-01:

| File | Raw | Gzip |
|---|---:|---:|
| `index.html` (9 beats) | 29,952 | **8,563** |
| `404.html` | 3,683 | 1,673 |
| `assets/site.css` | 39,836 | **9,722** |
| `assets/js/guardian.js` | 6,713 | 2,703 |
| `assets/js/reveal.js` | 3,642 | 1,699 |
| `assets/js/platform.js` | 1,177 | 652 |
| `assets/js/main.js` | 1,152 | 611 |
| `assets/js/motion.js` | 1,099 | 597 |
| **JS total** | 13,783 | **6,262** |

**The critical path went from ~92 KB to 24.5 KB — a 73% reduction — while the page gained an interactive signature moment it did not have before.** Most of that is deleting React, ReactDOM and the `dc-runtime`; the rest is that 648 inline `style=` attributes compress far worse than one stylesheet.

Both projections in §3 were close and both were slightly optimistic: CSS came in at 9.7 KB against a 7 KB projection (the components layer carries more comment density than assumed — a deliberate trade, and it is 24% of budget), and JS at 6.3 KB against 4 KB (the guardian state machine and the reveal failsafe). Neither is near its budget, which is what the headroom was for.

### 7.1 Still to measure

LCP, CLS, INP and sustained scroll FPS require the §6 conditions (mid-tier mobile emulation, 4G throttle, 4× CPU slowdown) and a **compositing browser pane**. The pane is not currently displayed in this session, so those runs are pending rather than done. Two predictions are recorded now so they can be checked rather than rationalised later:

- **CLS should be 0.000.** Every source is removed structurally, not mitigated (§4.1) — no webfonts, no un-dimensioned images, no late-injected content, and the platform probe collapses rather than inserts.
- **The LCP element should be Beat 1's `<h1>`**, rendered from HTML in a system font with no blocking script. There is nothing on the critical path that could beat it.

---

## 8 · The two risks worth naming in advance

1. **Beat 3's scrubbed cascade is the only scroll-linked element and therefore the only real FPS risk.** Where `animation-timeline: view()` is unsupported, it falls back to rAF. It is measured **first** in Phase 10, not last (`04-motion.md` §8).
2. **`content-visibility: auto` is the technique most likely to be over-applied.** It is genuinely effective and it genuinely breaks find-in-page in some engines. The restriction in §4 (Beats 6–9 only, never the comparison table) is a rule to enforce in review, not a preference — and every use needs `contain-intrinsic-size` from a measured height, or it trades a paint cost for a scrollbar-jump cost.
