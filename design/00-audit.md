# 00 · Forensic Audit — lockinra.xyz

**Date:** 2026-08-01 · **Auditor:** Claude Code · **Commit audited:** `858c2a4` (Update downloads to v1.6.0)
**Method:** full source read of all 5 files, live DOM/console/network instrumentation against the deployed site, computed contrast sampling, and claim verification against the app source at `D:\coding\start\LockinRa` (read-only).

> Every number in this document was measured or counted, not estimated. Where a claim could not be substantiated, it is marked **UNSUBSTANTIATED** rather than assumed false.

---

## 0 · Tooling available

Enumerated at the start of this engagement, per §4.1.

**Present and used:**

| Capability | Tool | Status |
|---|---|---|
| Browser (DOM, a11y tree, console, network, JS eval) | `mcp__Claude_Browser__*` | ✅ used throughout |
| Design critique | `design:design-critique` skill | ✅ available |
| Accessibility review | `design:accessibility-review` skill | ✅ available |
| Design system | `design:design-system` skill | ✅ available |
| UX copy | `design:ux-copy` skill | ✅ available |
| User research / synthesis | `design:user-research`, `design:research-synthesis` | ✅ available |
| Design handoff | `design:design-handoff` skill | ✅ available |
| Data viz | `dataviz` skill | ✅ available (if any chart ships) |
| Generative media | Higgsfield MCP (`generate_image`, `generate_video`, `generate_3d`, `upscale_image`, …) | ✅ connected |
| Web research | `WebSearch`, `WebFetch` | ✅ used (GitHub release verification) |
| MCP discovery | `mcp-registry` (`list_connectors`, `search_mcp_registry`) | ✅ available |

**Named in the brief but NOT connected in this session** — recorded per §4.1 rather than silently skipped:

| Missing | Capability it would have provided | Substitute routed to |
|---|---|---|
| ~~**Impeccable MCP**~~ | ~~Automated visual/design QA scoring~~ | 🚨 **CORRECTED 2026-08-01 — this entry was wrong.** `impeccable` **is available**, as a *Skill*, not an MCP server; this inventory only searched MCP servers. Same for the taste skills (`design-taste-frontend`, `gpt-taste`, `high-end-visual-design`, `redesign-existing-projects`, `imagegen-frontend-web`, `brandkit`). First used at the Phase 5 gate — `04-motion.md` §8, where it found 3 defects. `critique`'s dual-agent battery is deferred to Phase 10/11, when markup exists for its detector to scan |
| ~~**Tasta Skill MCP**~~ | ~~Unknown/unavailable~~ | See above — the taste skills are installed and available |
| Dedicated animation/motion MCP | Curve + choreography review | Hand-tuned curve specification in `04-motion.md` + browser FPS measurement |
| Lighthouse/perf MCP | Automated Core Web Vitals | Manual `PerformanceObserver` instrumentation + network/byte accounting |
| Figma MCP | Design-file sync | n/a — no Figma source exists for this project |

**Authentication-blocked** (cannot be used this session; user must authorize via claude.ai connector settings or an interactive `claude mcp` session): `figma`, `linear`, `notion`, `slack`, `github` MCP, `datadog`, and the other `plugin:*` servers. None are load-bearing for this work — GitHub facts were obtained via the public REST API through `WebFetch` instead.

**Screenshot limitation (honest disclosure):** the in-app Browser pane is not currently displayed, so `computer{action:"screenshot"}` returns `Screenshot timed out… the pane is not compositing frames`. All *visual* verification in this audit therefore comes from the accessibility tree, computed styles, measured geometry, and source reading rather than from rendered images. Pixel-level screenshot review at the seven required breakpoints is **deferred to Phase 10** and is a blocking item on the final checklist — it is not claimed as done here.

---

## 1 · Inventory

### 1.1 Files

| File | Raw | Gzip | Role |
|---|---:|---:|---|
| `index.html` | 173 KB | **32 KB** | The entire landing page — markup, all CSS, all JS logic |
| `support.js` | 54 KB | **14 KB** | ⚠️ Misnamed. Not support-page code — it is a **generated React template runtime** (`dc-runtime`) |
| `privacy.html` | 9.1 KB | — | Legal |
| `linux.html` | 8.5 KB | — | Linux download |
| `support.html` | 4.7 KB | — | Support/contact |
| `favicon.ico` | 17.4 KB | — | ⚠️ 17 KB for a favicon — oversized |
| `icon-512.png` | 14.8 KB | — | PWA icon |
| `apple-touch-icon.png` | 5.4 KB | — | |
| `icon-192.png` | 5.7 KB | — | |
| `thumbnail.webp` | 3.8 KB | — | ⚠️ OG image at **320×190** — far below the 1200×630 spec |
| `favicon-32.png` | 1.3 KB | — | |
| `favicon.svg` | 480 B | — | |
| `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest` | ~1.1 KB | — | Deploy/SEO |

**Zero `<img>` elements exist on the entire site.** Every visual is inline SVG or CSS. Consequence: there is no alt-text debt — and also **no photograph or screenshot of the actual application anywhere**. See §3.4.

### 1.2 Third-party origins (measured live, not inferred)

```
https://unpkg.com/react@18.3.1/umd/react.production.min.js
https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js
https://fonts.googleapis.com/css2?family=Inter…&family=JetBrains+Mono…
https://fonts.gstatic.com/            (preconnected)
https://static.cloudflareinsights.com/beacon.min.js
```

**Four third-party origins on a page whose largest on-screen statistic reads “0 bytes leave your device. ever.”** React and ReactDOM add ≈45 KB gzip and put the page's ability to render *at all* in the hands of a CDN this project does not control. See §3.1 — this is finding #1.

### 1.3 Design-system entropy (counted from source)

| Property | Unique values in `index.html` | What a system would have |
|---|---:|---:|
| `font-size` | **41** | 8–10 |
| `padding` | **68** | 6–8 steps |
| `background` | **65** | ~12 semantic roles |
| `gap` | **24** | 5–6 |
| `color` | 24 | ~8 roles |
| `box-shadow` | 21 | 4–5 elevations |
| `border-radius` | **20** | 4–5 |
| `margin-bottom` | 15 | (should be owned by layout, not elements) |
| **Unique `hsl()` literals** | **137** | ~25 tokens |

Supporting counts: **648** `style=` attributes · **256** raw `hsl()` calls · **116** inline `<svg>` · **37** `@keyframes` · **84** `[data-reveal]` · **36** `!important` · **20** `[style*=]` attribute-selector hacks.

**The count is the finding.** 41 type sizes and 137 colors is not a design system with drift — it is the *absence* of a design system. There are 51 CSS custom properties declared on `#lk-root`, but 256 raw `hsl()` literals bypass them. The tokens exist and are then ignored.

### 1.4 Section map

| # | `id` | Purpose | Words | Ask |
|---|---|---|---:|---|
| — | `lk-intro` | 3.6 s full-screen splash | 7 | — (blocks everything) |
| 1 | `top` | Hero + CSS product mockup | 96 | Download |
| 2 | `demo` | 32 s / 4-scene CSS "live demo" | 210 | Watch |
| 3 | *(none)* | Stat band (90% / 200ms / 0 bytes) | 24 | — |
| 4 | *(none)* | Problem → reframe | 168 | — |
| 5 | `features` | Bento, 6 cards | 315 | — |
| 6 | `toolkit` | 9 more feature cards | 340 | — |
| 7 | `made-for` | 5 personas | 190 | — |
| 8 | `privacy` | 6 pills + 4 cards | 245 | — |
| 9 | `performance` | 4 stat cards | 150 | — |
| 10 | `how` | Pipeline + 4 steps | 165 | — |
| 11 | *(none)* | Coach personalities ×3 | 175 | — |
| 12 | `compare` | 5-competitor grid | 130 | — |
| 13 | *(none)* | **Testimonials ×3** | 150 | — |
| 14 | `roadmap` | Shipped / progress / planned | 130 | — |
| 15 | `pricing` | Beta + future Pro | 190 | Download |
| 16 | `faq` | 10 `<details>` | 640 | — |
| 17 | `download` | Final CTA | 85 | Download |
| — | footer | Links | 60 | — |

**18 sections. ~3,470 words. 15,284 px of scroll.** Only 3 sections ask for anything. Twelve consecutive sections (3–14) make no request of the visitor at all.

---

## 2 · Section-by-section teardown

### `lk-intro` — the splash screen
**Verdict: DELETE**

**Weaknesses**
1. **A 3.6-second full-screen opaque overlay gates every single page load.** — *Why it exists:* it is a designed "brand moment" with no cost model attached. *Evidence:* `animation: lk-introOut 3.6s cubic-bezier(.16,1,.3,1) forwards` (line 389); live DOM probe returned `introOpacity: "1"` on a warm load; there is **no `localStorage` check** — returning visitors and every back-navigation see it again. *Cost:* the brief's own success criterion is *"understand the product within 20 seconds"* and *"stop the scroll in 3."* This spends the entire 3-second budget showing a logo. It is also almost certainly the Largest Contentful Paint element, and LCP cannot fire meaningfully before it clears.
2. **It is not keyboard-dismissible.** — *Why:* it is a `<div onClick=…>`, not a `<button>`. *Evidence:* line 389. *Cost:* a keyboard-only user waits the full 3.6 s with no escape; the "click to skip" affordance is a lie for them.

**What a world-class version does instead:** nothing. Apple, Linear, Stripe and Raycast all render content immediately. Brand is established by the *quality of the first screen*, not by delaying it. If a reveal is wanted, it belongs to the hero's own entrance — under 500 ms, non-blocking, once per session.

### `top` — hero
**Verdict: REBUILD**

1. **The product mockup is a CSS drawing of the app, not the app.** — *Why:* screenshots are work to keep current; CSS recreations are easy to author inline. *Evidence:* `imgs: 0` from the live DOM; the mockup is ~80 lines of nested divs (510–587). *Cost:* This is the single biggest missed opportunity on the site. §7.2 of the brief demands *"Show the software. A focus OS site that never shows the software convincingly is a brochure."* A hand-drawn approximation is strictly less persuasive than the real thing and quietly signals the real thing may not be presentable.
2. **Six `<button>` elements inside the mockup are focusable and inert.** — *Evidence:* live probe `inertButtons: 6`; e.g. "Let's grind", "Snooze 5m", "Wrong guess", pause/stop (543–544, 579–581). *Cost:* keyboard users tab into decorative furniture that does nothing. Pure noise in the tab order.
3. **Three competing CTAs in one viewport** (Download / Download Linux / Watch demo) plus a nav Download plus store links. *Cost:* violates the one-primary-CTA rule; dilutes the decision.
4. **The headline gradient animates forever.** `lk-shimmer 4.5s linear infinite` on the `<h1>` (478). *Cost:* perpetual motion on the most important text on the site, adjacent to reading. Distracting and a WCAG 2.2 concern for cognitive accessibility.

### `demo` — the 32-second CSS film
**Verdict: REBUILD (keep the ambition, change the substrate)**

1. **It is a 32-second infinite loop the visitor cannot control.** — *Evidence:* 14 `@keyframes` timelines all running `32s … infinite` (203–248). No play/pause, no scrub, no progress. *Cost:* the visitor must *wait* up to 24 s to see scene 4. Nobody does. The best content on the page is behind a timer.
2. **The headline promises 60 seconds; the demo is 32.** — *Evidence:* hero CTA says "Watch the 60-second demo" (491); section copy says "in sixty seconds" (594); the actual loop is `32s`. *Cost:* a small, checkable inaccuracy in the first 400 words.
3. **It animates forever, off-screen, for the life of the page.** 14 infinite CSS timelines never pause when scrolled out of view. *Cost:* continuous compositor work and battery drain — on a page selling *"without eating the day's battery."*
4. **Reduced-motion drops 3 of 4 scenes entirely.** — *Evidence:* `@media (prefers-reduced-motion: reduce) { .lk-ds2,.lk-ds3,.lk-ds4 { display:none } }` (202). *Cost:* **this is content loss, not motion reduction.** A reduced-motion user is shown one quarter of the story. Direct violation of §3 constraint 7 and of §9.4.

### Stat band — "~90% · <200ms · 0 bytes"
**Verdict: REBUILD around verifiable numbers** — see §3.1. Two of the three headline numbers are unsubstantiated and the third is contradicted by the page's own network activity.

### `features` (bento) + `toolkit`
**Verdict: MERGE**

1. **15 feature cards across two adjacent sections with no hierarchy between them.** — *Why:* features were appended as they shipped; nothing was ever removed. *Cost:* the visitor cannot tell what matters. A 15-item list communicates "many things" and nothing else. §7.2: *one idea per viewport.*
2. **The bento's placement breaks so badly on mobile it needed a `!important` reset.** — *Evidence:* the comment at 341–346 explains that React re-serialises `grid-area`, so children must be force-reset by class. *Cost:* documented fragility.
3. **The habits heatmap is `Math.sin`-seeded fake data.** — *Evidence:* 1536–1544. *Cost:* minor, but it is invented data rendered as if measured.

### `privacy`
**Verdict: REBUILD — this is the wedge and it is currently the weakest-evidenced section**

1. **It asserts; it does not prove.** Six pills that say "No cloud", "No tracking" are *claims*, styled as *badges*. A privacy-hardline reader discounts unfalsifiable badges automatically.
2. **It contains the site's most serious factual error** (§3.1, finding #2).
3. **The page it sits on loads from four third-party origins**, which any such reader will check first.

### `compare`
**Verdict: KEEP the content, REBUILD the markup**

1. **A 60-cell comparison table with zero table semantics.** — *Evidence:* live probe `tables: 0`; it is `display:grid` over `<div>`s (290–299). *Cost:* **completely unusable with a screen reader** — a blind visitor gets ~60 unlabelled divs reading "✓ ✗ ✗ ✗ ✗" with no row or column association. This is the worst accessibility defect on the site.
2. `✓`/`✗` glyphs carry meaning with no text alternative — information by symbol alone.
3. Requires horizontal scroll below 780 px (`min-width: 780px`).

### Testimonials
**Verdict: DELETE (blocking)** — see §3.1, finding #3.

### `faq`
**Verdict: KEEP** — genuinely the strongest section on the site. Specific, concrete, answers real objections, honest about limits (Wayland, Firefox). It is also the only section that reads like it was written by someone who has used the product. *This voice should become the whole site's voice.*

### `linux.html` / `support.html` / `privacy.html`
**Verdict: REBUILD into the system**

1. **They are a different product, visually.** — *Evidence:* `--bg:#0f1713`, `--primary:#4fae7e`, `--tile1:#3B7257` vs `index.html`'s `hsl(150 3% 6%)` / `hsl(150 38% 52%)`. Different palette, different type stack (system vs Inter), different everything. *Cost:* clicking "Linux (beta)" feels like leaving the site.
2. **`linux.html` links to the wrong domain in visible copy:** "← Back to **lockinra.app**" (124). The site is **lockinra.xyz**.
3. **`support.html` says "Focus & productivity for Windows"** — stale; Linux has shipped since.
4. **The Linux download is v1.3.0 while the site is v1.6.0** — and the page never says so. *Verified:* v1.3.0 is genuinely the newest AppImage that exists (no Linux asset in 1.4.0/1.5.0/1.5.1/1.6.0), so **the link is not broken** — but presenting a three-versions-old build without disclosure is a transparency failure, not a link failure. Fixing this means *disclosure*, not repointing the URL at an asset that does not exist.

---

## 3 · Mandatory audit dimensions

### 3.1 Truth — claims vs. reality ⛔ THREE BLOCKING ISSUES

Verified line-by-line against the app source and the GitHub API.

| Claim | Site location | Verdict |
|---|---|---|
| “Tasks, notes, and screen activity … **encrypted at rest in the OS keychain**” | FAQ (1366), privacy card (1031), **and JSON-LD `FAQPage`** (62) | ⛔ **FALSE AS STATED** |
| Testimonials from 3 named individuals | 1250–1270 | ⛔ **UNVERIFIABLE — presumed fabricated** |
| “~90% distraction classification accuracy” | Stat band (747), FAQ (1402) | ⛔ **UNSUBSTANTIATED** |
| “<200 ms end-to-end on-device inference” | Stat band (751) | ⛔ **UNSUBSTANTIATED** |
| “0 bytes leave your device. ever.” | Stat band (755) | ⚠️ True of the *app*; the *page saying it* contacts 4 third parties |
| “5 releases since June” | Hero (504), roadmap (1280) | ⚠️ **Wrong — there are 8** (v1.0.0 → v1.6.0) |
| “Watch the 60-second demo” | Hero (491) | ⚠️ The demo is 32 s |
| “10+ local models … Llama, Qwen, Gemma, Phi, Mistral, GLM” | Multiple | ✅ **TRUE** — ~~catalog has **21**~~ → **CORRECTED 2026-08-01: the count is 24.** Re-counted at Phase 6 by bounding `MODEL_REGISTRY` (`packages/ai/src/models.ts:43–310`) and counting entries: **24**, all language models, no gating field. The earlier 21 was a miscount. DeepSeek is present and unlisted. Copy uses 24 |
| “~254 MB”, v1.6.0 Windows | Final CTA (1429) | ✅ **TRUE** — 266,534,010 B = 254.2 MB |
| “~276 MB” AppImage | `linux.html` (71) | ✅ **TRUE** — 289,352,678 B = 276.0 MB |
| “<1% CPU while monitoring” | Perf card (1055) | ⚠️ Plausible (cascade design confirmed) but unmeasured |

**Finding #2 — the encryption claim is materially false, and it is the single most load-bearing sentence on the site.**

*Evidence.* `packages/db/migrations/0001_tasks_projects_tags.sql:39-53` defines:
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id     TEXT PRIMARY KEY,
  title  TEXT NOT NULL,     -- plaintext
  notes  TEXT,              -- plaintext markdown body
  …
```
Task titles and task notes are **plaintext SQLite columns**. `safeStorage` is used for *specific sensitive fields* — the `secret` BLOB on memory/usage rows (`{url, title, windowTitle}`), semantic-memory text and embeddings, integration tokens, AI settings, and certain vaulted note kinds — but **not** for tasks.

*Why it happened:* the true, defensible claim ("sensitive activity data is encrypted with an OS-keychain-derived key") got rounded up in copywriting to the punchier "your tasks and notes are encrypted."

*Cost:* this is repeated in three places including `application/ld+json`, so it is machine-readable and will be quoted back. The audience most likely to verify it is precisely the privacy-hardline persona the product is targeting. The honest version is *still an excellent claim* — most competitors encrypt nothing locally and ship everything to a server. **Truth is not a downgrade here.**

**Finding #3 — the testimonials.** Three named people with job titles and initials-avatars under "// FROM THE BETA". I can find no substantiation. Under §3 constraint 1 these must be removed unless the user can confirm they are real, attributed with permission. **This blocks shipping.** Honest replacements that outperform fake praise: the real 8-release changelog, the real Microsoft Store listing, the real architecture diagram, the real offline guarantee demonstrated.

**Findings #4/#5 — 90% and <200 ms.** `packages/ai/src/models.ts` carries `accuracy` as a **qualitative enum** (`'basic' | 'good' | 'great'`), never a percentage. No benchmark in `packages/ai` produces a classification-accuracy figure. Neither number can be sourced. They must be removed, or replaced with something genuinely measured, or reframed as the *architecture* claim they really are ("a staged cascade so most calls never reach the LLM") — which is verifiable, more interesting, and harder for a competitor to copy. **Amended 2026-08-01:** the cascade has **four** decision stages plus a silent fallback, not three — see `04-motion.md` §0.1. Any copy derived from this line must use the four-stage form.

### 3.2 Positioning clarity
The first 96 words never say **what the product is**. "A privacy-first AI workspace for deep work" could describe Notion, Obsidian, Sunsama, or Reflect. The words that would actually differentiate — *it watches your screen and interrupts you* — appear nowhere above the fold. The genuinely unique mechanism (perceive → understand → intervene, locally) is buried at section 10 (`#how`). **Time-to-comprehension is failed by the structure, not the prose.**

### 3.3 Information hierarchy
Squint test: the hero reads as *badge → huge headline → paragraph → three equal buttons → mono strip → large dark rectangle*. Three same-weight buttons means no primary. Below the fold, 18 sections arrive at near-identical rhythm — kicker, h2, paragraph, card grid — **twelve times**. There is no dynamic range: nothing is loud because everything is medium.

### 3.4 Cognitive load
~3,470 words, 15,284 px, 15 feature cards, 10 FAQ items, a 60-cell table, 5 personas, 3 coach voices. **73 focusable elements.** Six of them do nothing.

### 3.5 Visual system
Covered in §1.3. 41 type sizes, 137 colors, 68 paddings. Tokens exist (51 custom properties) and are bypassed 256 times. There is no scale, no ratio, no rhythm rule — values were authored per-element in isolation, which is the direct and predictable consequence of the inline-style architecture.

### 3.6 Typography
- Inter + JetBrains Mono via **render-blocking Google Fonts** — no `preload`, no `font-display` control beyond the URL's `&display=swap`, no metric-compatible fallback declared → guaranteed swap reflow.
- Sizes are set in `px` throughout (`font-size:13.5px`, `14.5px`, `16.5px`) — **does not respond to the user's browser font-size setting.** An accessibility failure for low-vision users and a WCAG 1.4.4 risk.
- Measure is mostly controlled (`max-width:46ch`) — the one genuinely good typographic decision on the site.
- Half-pixel sizes (13.5/14.5/16.5/13.8 px) are a tell: values chosen by nudging, not by a scale.

### 3.7 Color & light — computed contrast
Measured live via `getComputedStyle` + WCAG relative-luminance:

| Pair | Ratio | AA body (4.5) | Where it hurts |
|---|---:|---|---|
| `--text` on `--bg` | 17.14 | ✅ | |
| `--text` on `--surface` | 15.23 | ✅ | |
| `--text-muted` on `--bg` | 8.38 | ✅ | |
| `--text-muted` on `--surface` | 7.45 | ✅ | |
| `--primary` on `--bg` | 7.43 | ✅ | |
| `--text-subtle` on `--bg` | 4.59 | ⚠️ barely | footnotes |
| **`--text-subtle` on `--surface`** | **4.08** | ❌ **FAIL** | **comparison-table cells**, caption chips |
| **demo kicker on `#0d0f0d`** | **3.97** | ❌ **FAIL** | every `// SCENE` label, 11 px |
| **demo subtext on `#161916`** | **3.66** | ❌ **FAIL** | demo card body text |
| `--border` on `--bg` | 1.47 | n/a | fails 3:1 where borders separate table data |

Three confirmed AA failures, all on small text, all in the demo and comparison sections — the two sections doing the most persuasive work.

### 3.8 Motion
37 keyframe blocks. Perpetual infinite loops on: the h1 gradient, two background orbs (26 s / 32 s), the hero nudge popup bob, four equaliser bars, a pulse dot, and all 14 demo timelines — **none pause when off-screen**. Reduced-motion is handled by one global `animation-duration:.01ms !important` sledgehammer plus the `display:none` content-deletion noted above. There is no motion *system*: no named curves, no duration scale, no stagger doctrine. `cubic-bezier(.16,1,.3,1)` is used consistently, which is the seed of a system, but it is the only one.

### 3.9 Interaction states
Hover exists on nav links and coach cards — **applied by JS `mouseenter` listeners writing inline styles** (1548–1566), not CSS. Consequences: no `:focus-visible` equivalent, nothing on touch, and state that a re-render can clobber. **There is no visible focus style defined anywhere on the site**, no `:active`, no `:disabled`, no loading state. `--webkit-tap-highlight-color` is handled only on the burger.

### 3.10 Copy
Best-in-class in the FAQ; generic above the fold. Offenders: "A privacy-first AI workspace for deep work" (could be anyone), "One calm surface for the whole loop" (pretty, meaningless on first read), "A whole workspace, not a widget" (defines by negation). Strong lines that should survive: *"Focus isn't a willpower problem. It's a tooling problem."*, *"Blockers are blunt."*, *"Pull the cable — focus tracking, capture, and coaching keep running."*

### 3.11 Trust architecture
The strongest available proofs are **not used**: a real Microsoft Store listing (published, verifiable), 8 real releases with real dates and byte sizes, a real ADR-documented architecture, a real offline guarantee. Instead the section leans on badge-pills and fabricated testimonials. **The site is less trustworthy than the product deserves.**

### 3.12 Conversion path
Download appears in nav, hero (×2), pricing, and final CTA. On mobile the nav CTA is `display:none !important` (350) and the burger is JS-only — see §3.15. Between section 3 and section 14 — roughly 9,000 px — there is **no download affordance at all**.

### 3.13 Responsiveness
Breakpoints are 920 / 768 / 480 px — device folklore, not content-driven. The mechanism is the deeper problem: **20 `[style*="…"]` attribute-substring selectors** matching serialized inline styles, with a source comment admitting the fragility ("React re-serialises every inline `style` with spaces … so responsive selectors match on colon/comma-free value fragments — or list both spacings"). Responsive layout depends on *string matching against a framework's serialization format*. Any change to React's CSSOM output silently breaks mobile. 36 `!important` declarations exist mostly to service this. This is the known landmine from prior work, still fully load-bearing.

### 3.14 Accessibility
- ❌ **No skip link** (`skipLink: false`) with 73 focusable elements.
- ❌ **Comparison table has no table semantics** — 60 divs (§2).
- ❌ Three AA contrast failures (§3.7).
- ❌ **No focus indicator defined anywhere.**
- ❌ Splash overlay not keyboard-dismissible.
- ❌ 6 inert focusable buttons.
- ❌ Dead social link: `<a href="#top" aria-label="X">` (1463) — labelled "X", goes nowhere. Violates the "no `#` hrefs" rule.
- ❌ `px` font sizes throughout (§3.6).
- ❌ Reduced-motion deletes content (§2, `demo`).
- ✅ Heading order is clean: single `h1`, no skipped levels (verified live).
- ✅ `<details>`/`<summary>` for FAQ — correct native semantics.
- ✅ `aria-label`/`aria-expanded` wired correctly on the burger.
- ⚠️ Ambient backdrop correctly `aria-hidden="true"`; scroll-progress bar is not.

### 3.15 No-JS behaviour
The page **is** in the served HTML (inside `<x-dc>`), so core content survives — but:
- ❌ **Mobile navigation is completely unavailable.** `.lk-navlinks{display:none!important}` at ≤768 px and the menu only opens via a JS class toggle. No JS on a phone = no nav, and the nav CTA is hidden too.
- ❌ Both theme icons (sun **and** moon) render simultaneously — `<sc-if>` is an unknown element whose children display unconditionally.
- ❌ Theme toggle inert; heatmap renders as an empty box; Linux visitors get the Windows CTA.
- ⚠️ **If unpkg.com is blocked or down, the page never hydrates** — and unpkg is exactly the kind of CDN blocked by the privacy-focused network setups this audience runs.

### 3.16 Performance
| Metric | Measured | §11.2 budget | |
|---|---:|---:|---|
| Initial HTML (gzip) | 32 KB | — | |
| JS: `support.js` | 14 KB | — | |
| JS: React + ReactDOM | ≈45 KB | — | |
| **Total JS (gzip)** | **≈59 KB** | < 80 KB | ⚠️ passes only because there is no app |
| CSS | 0 KB separate (all inline) | < 40 KB | ⚠️ unmeasurable as structured |
| Third-party origins | **4** | 0 preferred | ❌ |
| Render-blocking in `<head>` | `support.js` (no `defer`), Google Fonts CSS | 0 | ❌ |
| Document height | 15,284 px | — | |

Structural problems: `support.js` is **synchronous in `<head>`** → parser-blocking → *then* it fetches two more scripts cross-origin → *then* React mounts and re-renders the entire body. LCP cannot complete before a 3.6 s splash animation clears. CLS is guaranteed by (a) font swap with no metric fallback and (b) a **2.3-second delayed reveal** (`setTimeout(setup, 2300)`, 1530) that sets `opacity:0` on all 84 `[data-reveal]` elements *after* the page has been visible — a mass repaint and visible flash two seconds in. Off-screen sections have no `content-visibility`, and ~20 infinite animations composite forever.

### 3.17 SEO / meta
✅ Strong: title, description, canonical, OG, Twitter, 4 JSON-LD blocks, sitemap, robots, `google-site-verification`.
❌ **OG image is 320×190** — social platforms expect 1200×630; it will render as a small blurry thumbnail everywhere it matters.
❌ The `FAQPage` structured data **contains the false encryption claim**, publishing it in machine-readable form to search engines.
⚠️ `sitemap.xml` `lastmod` dates are stale (2026-07-07/18). ⚠️ `keywords` meta is ignored by every major engine — harmless, but noise.

### 3.18 Craft tells
✅ `::selection` is themed. ✅ `scroll-margin-top` clears the sticky nav. ✅ `tabular-nums` on stats. ✅ Optical `-0.02em`/`-0.03em` tracking on display sizes.
❌ No custom focus ring. ❌ No scrollbar treatment. ❌ 17 KB favicon. ❌ **No 404 page** — GitHub Pages will serve its default. ❌ Half-pixel font sizes. ❌ Duplicated `margin-top` on the same element (548: `margin-top:auto` then `margin-top:24px`) — a dead declaration, evidence of hand-editing without review.

---

## 4 · The five things that most limit this site

**1 · It contains statements that are not true.**
An overstated encryption claim (contradicted by `0001_tasks_projects_tags.sql`), three unverifiable testimonials, and two unsourced statistics. *Systemic reason:* marketing copy was written from the product's *ambition* rather than from its *source*, with no verification step between. On a product whose entire wedge is trust, this is not a copy problem — it is a **positioning-integrity** problem, and it is the only finding that can damage the project beyond the website.

**2 · The site is a runtime-hydrated React app pretending to be a static page.**
178 KB of HTML with 648 inline styles, mounted by a CDN-fetched React from `unpkg.com`, with responsive behaviour implemented as *substring matches against React's style serialization*. *Systemic reason:* the page was exported from a component-authoring tool (`dc-runtime`) and shipped as-is rather than compiled to static output. Everything in §3.5, §3.13 and §3.16 descends from this one decision.

**3 · Nothing on the page is the actual product.**
Zero `<img>`. The hero "mockup", the 32-second "demo", and the habits heatmap are all CSS re-creations — the heatmap is literally `Math.sin`-seeded. *Systemic reason:* CSS drawings are easy to author inline and never need updating. *Cost:* the most persuasive asset available — the real, shipping, Microsoft-Store-published application — is never shown.

**4 · Eighteen sections at one volume, and no argument.**
~3,470 words with twelve consecutive sections that ask nothing and build nothing. Sections were appended as features shipped; none was ever removed or subordinated. There is no narrative — no problem the visitor feels, no turn, no proof, no close. *Systemic reason:* the page is organised around **what the product has** rather than **what the visitor needs to believe, in order**.

**5 · The differentiator is asserted, never demonstrated — and the page undercuts it.**
"Local-first" is the whole business, and it is delivered as six badge-pills, while the page loads from four third-party origins and prints "0 bytes leave your device. ever." *Systemic reason:* the claim was treated as a *message* to broadcast rather than a *property* to prove. A privacy-first site should be the most obvious possible demonstration of its own thesis: zero third parties, no analytics, no CDN, verifiable by opening devtools.

---

## 5 · Baseline scores (Phase 1)

Scored against the same rubric the Phase 11 panel will use, so movement is measurable.

| Dimension | Score | One-line justification |
|---|---:|---|
| Design | 5.5 | Competent, coherent dark aesthetic; no system, no hierarchy, no dynamic range |
| Usability | 4.5 | 3.6 s gate, uncontrollable 32 s demo, 3 competing CTAs, no download for 9,000 px |
| Creativity | 5.0 | The CSS demo is genuinely ambitious; everything around it is category-standard |
| Content | 3.0 | Excellent FAQ voice; **false and unverifiable claims cap this hard** |
| Mobile | 4.0 | Works, but via `[style*=]` string-matching and 36 `!important`; no-JS nav dead |
| Accessibility | 3.0 | No skip link, no focus ring, unreadable comparison table, 3 contrast failures |
| Performance | 4.0 | Blocking head script → CDN React → 3.6 s splash → 2.3 s reveal flash |
| Motion | 4.5 | One good curve, 37 keyframes, no system, reduced-motion deletes content |
| Brand distinctiveness | 4.0 | Swap the logo and this is any dark-mode dev-tool site |
| **Overall** | **4.2 / 10** | A capable, honest-*feeling* site undermined by architecture and by four claims |

---

## 6 · Immediately blocking (must resolve before any build)

1. ⛔ **Testimonials** — remove, or confirm real + permissioned. *Requires user decision.*
2. ⛔ **Encryption claim** — rewrite to what the source supports, in all 3 locations incl. JSON-LD.
3. ⛔ **"~90%" and "<200 ms"** — remove or substantiate. *Requires user decision.*
4. ⛔ **`aria-label="X"` → `#top`** dead social link.
5. ⚠️ **"5 releases since June" → 8.** **"60-second demo" → matches actual length.**
6. ⚠️ **`lockinra.app` → `lockinra.xyz`** in `linux.html`.
7. ⚠️ **Disclose the Linux build is v1.3.0** — do *not* repoint the URL; no newer AppImage exists.
