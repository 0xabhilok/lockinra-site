# 04 · Motion system

**Date:** 2026-08-01 · **Status:** system locked; choreography specified
**Inputs:** `02-strategy.md` (the 9 beats, the signature moment), `03-brand.md` (tokens, the threshold device, flat-with-hairlines depth).
**Foundation:** the app's own motion layer — `packages/ui/theme/motion.ts` and `packages/ui/theme/motion.css` — extended, not replaced.

> The rule this document exists to enforce: **every animation names its job before it gets a curve.** An animation without a job is deleted, not tuned. Section 4 is therefore as much a list of refusals as of deployments, and the refusals are the part that makes the rest read as intentional.

---

## 0 · Two corrections to the upstream docs (found by reading the app source)

Both were found while sourcing this document against `D:\coding\start\LockinRa`. Both are recorded here rather than quietly fixed, because §3 of the brief makes truth a law and the site's own audit exists to catch exactly this class of error.

### 0.1 🚨 The cascade has **four decision stages and a fallback**, not three

`02-strategy.md` §1.4/§4 and `01-research.md` describe a *"three-stage cascade (hard rules → semantic match → LLM)"*. The implementation at [`packages/embeddings/src/cascade.ts`](../../LockinRa/packages/embeddings/src/cascade.ts) is:

| # | Stage | `source` | What it actually is |
|---|---|---|---|
| 1 | Hard rules | `rule` | Deterministic domain/app allow+block lists. Instant. |
| 2 | **Correction kNN** | `knn` | Nearest-neighbour vote over **the user's own past corrections**, similarity floor 0.75, recency-weighted, needs ≥60% agreement to be trusted |
| 3 | **Title lexicon** | `lexicon` | Cheap keyword signal on the page/window title. Confidence 0.65. **Omitted entirely from the strategy doc.** |
| 4 | LLM | `llm` | Only reached for genuine novelty |
| 5 | Fallback | `fallback` | `unknown` @ confidence 0 — silent; the caller degrades |

Two things follow, and the second one is an upgrade rather than a concession:

- **Drawing three stages would have been a new fabrication** — the same species of error as the "~90% accuracy" the audit deleted. Beat 3's entire job is *"the honest architecture … the cascade drawn accurately."* It is now drawn with four stages and the silent fallback.
- **Stage 2 is not "semantic matching against your task text."** It is matching against **your own past corrections**. The task title is only one field of the embedded key (`defaultBuildKey`). This is a *better* story than the one the strategy doc told — the mechanism is personalisation, not string similarity — and it comes with an honesty requirement: at cold start there are no corrections, stage 2 is empty, and behaviour reduces to rules → lexicon → LLM. The source comments call this out explicitly as *"learning your patterns, never fabricating confidence it lacks."* The site says so too (§5.6).

**Action:** `02-strategy.md` §1.4, §4 and `01-research.md` §32 need the three-stage phrasing amended to four-plus-fallback. Logged in §9.

### 0.2 The reason strings are real — so the site uses the real ones

`cascade.ts` emits literal `reason` text: `"matched N of your past corrections"` (kNN), `"title keyword signal"` (lexicon), `"no classifier available"` (fallback). The signature moment displays **these strings verbatim** rather than invented copy. Brand §3.10's honesty rule — *"every string shown must be something the app can actually produce"* — is satisfiable exactly, so it is satisfied exactly.

---

## 1 · Inheritance: the site is built from the product's motion tokens

Phase 4 argued that the site and product are provably one system because the site is literally built from the app's colour tokens. The same argument is made here, and it is stronger, because motion is where most design systems quietly diverge.

`packages/ui/theme/motion.ts` already declares four named curves. The site adopts all four **unchanged**, keeps the app's names, and adds exactly one:

| App token (`motion.ts`) | Site name | Value | Status |
|---|---|---|---|
| `ease.out` | `--ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | inherited verbatim |
| `ease.in` | `--ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | inherited verbatim |
| `ease.inOut` | `--ease-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | inherited verbatim |
| `ease.snap` | `--ease-commit` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | inherited verbatim, renamed for its job |
| — | `--ease-ambient` | `cubic-bezier(0.37, 0, 0.63, 1)` | **new** — see §2.1 |

Where the site diverges from the app, it says so and why. There is one divergence: the app's `duration` scale tops out at `entrance: 450` because the app never animates a scene, only components. The site needs two longer steps for the signature moment and the beat-scale reveals (§2.2).

---

## 2 · The physics

### 2.1 The five curves — each with one stated job

Five is the ceiling the brief sets, and five is what is used. Anything that cannot name which of these it is does not ship.

```css
:root {
  /* Decelerate hard. Things ARRIVING. The house curve — if in doubt, this one. */
  --ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);

  /* Accelerate away. Things LEAVING. Never used for an entrance. */
  --ease-exit:     cubic-bezier(0.7, 0, 0.84, 0);

  /* Symmetric. A→B moves where BOTH endpoints are on screen. */
  --ease-move:     cubic-bezier(0.65, 0, 0.35, 1);

  /* Overshoot 1.56. A decision COMMITTING — the only curve allowed to bounce. */
  --ease-commit:   cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Sinusoidal, seamless at the loop boundary. Infinite ambient ONLY. */
  --ease-ambient:  cubic-bezier(0.37, 0, 0.63, 1);
}
```

| Curve | Job | Deployed on | Never used for |
|---|---|---|---|
| `--ease-entrance` | Entrances, scroll reveals, spatial arrivals | Every beat reveal; the nudge; every popover | Anything leaving |
| `--ease-exit` | Exits, dismissals | The nudge dismiss; the mobile nav close | Anything arriving |
| `--ease-move` | On-screen A→B translation | The threshold sweep; scroll-linked progress | Enter or exit |
| `--ease-commit` | State commit, micro-feedback with weight | The verdict chip landing; the source-switch pill; the copy-confirm | Anything larger than a card — an overshooting page section reads as broken |
| `--ease-ambient` | Infinite low-amplitude loops | The threshold breath. **That is the complete list.** | Anything one-shot |

**Why `--ease-ambient` is new rather than reusing `--ease-move`.** `cubic-bezier(0.65,0,0.35,1)` has non-zero acceleration at t=0 and t=1. On a one-shot that is invisible; on an infinite alternating loop it produces a faint but perceptible *tick* at each reversal, which on a 4.5s breath reads as a stutter every 2.25s. Sinusoidal easing reverses with zero acceleration and is seamless. The app's `lk-momentum-aura` uses plain `ease-in-out` (the keyword — `0.42,0,0.58,1`) which is close but not symmetric-sinusoidal; the site's value is the exact sine approximation. This is a one-line divergence and it is deliberate.

**Springs vs. tuned béziers.** The brief invites either. The site uses **tuned béziers**, argued: a real spring solver needs either a library (§6.3 — rejected on bytes) or ~40 lines of rAF integration that must then be duplicated for the reduced-motion path and cannot be expressed in CSS-native scroll-driven animation (§6.2). `--ease-commit`'s 1.56 overshoot is a spring's first oscillation with the tail truncated, which is what a spring visually *is* at these durations. The one place a real spring would win — dragging, throwing, flicking — does not exist on this site (§4, row 13).

### 2.2 The duration scale

Six steps. The first five are the app's, renamed to the site's semantic scheme; the last two are the additions §1 flagged.

```css
:root {
  --d-micro: 120ms;  /* hover, tap, focus ring, checkbox            */
  --d-fast:  200ms;  /* small element enter; chip; tooltip          */
  --d-base:  320ms;  /* standard state change; card reveal          */
  --d-slow:  520ms;  /* large element; a beat's headline arriving    */
  --d-scene: 800ms;  /* multi-element choreography (signature only) */
  --d-breath: 4500ms;/* the ambient loop period                     */
}
```

**The three rules, and how they resolve when they conflict:**

1. **Enter slower than exit.** Exit duration = **0.6 × enter**, snapped to the scale. An arrival is information the user must parse; a departure only needs to not be abrupt. Concretely: nudge enters `--d-base` (320) → exits 200 (`--d-fast`). Mobile nav enters 320 → exits 200.
2. **Small moves faster than large.** The base step is chosen by the element's largest dimension: ≤32px → `--d-micro`; ≤120px → `--d-fast`; ≤480px → `--d-base`; a full beat → `--d-slow`.
3. **Distance scales duration sub-linearly.** `duration = base × √(distance / 100px)`, clamped to ±1 step of the base. Doubling travel multiplies time by 1.41, not 2 — which is what makes long moves feel *fast* rather than merely long.

**When 1 and 2 disagree, 2 wins, then 1 is applied to the result.** A large element leaving still leaves faster than it arrived; it does not inherit a small element's duration.

Worked example — the nudge card (280×96px, travels 16px up):
base by rule 2 = `--d-base` (280px ≤ 480) → 320ms. Rule 3: √(16/100) = 0.4 → 128ms, clamped to one step below base = `--d-fast` = 200ms. **Enter 200ms.** Exit = 0.6 × 200 = 120ms = `--d-micro`. Both land on the scale; nothing is hand-picked.

### 2.3 Stagger doctrine

```css
--stagger-step: 60ms;
--stagger-max:  240ms;   /* hard ceiling on total added delay */
```

- **Base step 60ms.** Below ~40ms a stagger is not perceived as sequence, only as sloppiness; above ~90ms the last item feels forgotten.
- **Ceiling 240ms**, which is 5 items at full step. Beyond 5, the step *compresses* (`step = min(60, 240 / n)`) rather than the total growing. A 12-item list therefore staggers at 20ms and reads as a single soft wave — never as a queue.

**The rule for stagger vs. block** — the question is whether *order carries meaning*:

| Order means something → **stagger** | Items are peers → **arrive as a block** |
|---|---|
| Beat 5's changelog ladder (dates are a sequence) | Beat 6's 4 workspace clusters (no cluster precedes another) |
| The cascade's stage rows (the whole point is that stage 1 runs before stage 4) | Beat 7's comparison table rows (alphabetical ≠ meaningful) |
| Beat 8's cost list (leads with the 8GB path deliberately) | Beat 9's download links (platform is not a sequence) |

Staggering peers is the single most common way a site announces that its motion is decorative: it implies a sequence that the content does not have.

### 2.4 Origin doctrine

**Nothing teleports. Everything enters from where it came from and leaves toward where it is going.**

| Element | Enters from | Because |
|---|---|---|
| The nudge (signature moment) | The coach avatar's edge, +12px Y, scale 0.96 | It is *spoken by* that element |
| A verdict chip | Its own stage row, 0px travel, scale only | It is a *property of* that row, not a visitor to it |
| Beat content on scroll | **Revealed in the threshold's wake** — no independent travel (§3.4) | The light arriving *is* what makes the beat visible |
| Threshold light | Sweeps from the beat's leading edge outward | The light has a source and the source is the line |
| Mobile nav | The top edge it is anchored to | Anchored things grow from their anchor |
| Focus ring | Nowhere — scales 0.9→1 in place over `--d-micro` | A focus ring has no origin; it is a state of the element |

**Corollary (the one that gets violated most):** an element that enters with a Y-translate must exit with the *same-signed* Y-translate. A card that rises 16px on entry and then rises 16px on exit is teleporting — it has denied where it came from. Enter `+16 → 0`; exit `0 → +16`.

---

## 3 · The threshold, in motion

The brand doc names one device: **the lit line between the noise and the work.** It is the only glow on the site. Motion's job is to make it behave like a real light source, consistently, everywhere it appears — because a device that moves differently in each context is five devices.

**The three behaviours, and nothing else:**

1. **Sweep** — on first reveal, light travels along the line from the leading edge outward. `clip-path` inset animated 100%→0%, `--d-slow`, `--ease-move`. Scroll-triggered, once, never replayed.
2. **Breath** — once lit, the glow's spread oscillates ±18% around its rest value on a `--d-breath` (4.5s) period, `--ease-ambient`. Amplitude is deliberately below the threshold of conscious notice; its job is that the page is never *dead*, not that anyone sees it breathing. Inherited directly from the app's `lk-momentum-aura` (4.5s), which is the same idea at component scale.

   **The breath runs only where it is being seen.** It is paused when its section leaves the viewport (the same single `IntersectionObserver` from §6.2 toggles `animation-play-state`) and when `document.hidden` fires. An infinite background animation that keeps compositing in a backgrounded tab is a battery cost with no viewer — and on a site whose Beat 8 answers *"will it eat my battery"*, shipping one would be a small hypocrisy of exactly the kind the audit was written to catch. Cost when idle: **zero**.
3. **Response** — the threshold under a focused or hovered interactive element brightens by one step over `--d-micro`. This is the site's universal hover affordance, which is how one device does the work that most sites spend a dozen effects on.

### 3.4 Reveal-in-the-wake — the beat entrance, replacing fade-and-rise

**Beats are not revealed by their content moving. They are revealed by the light arriving.**

The threshold sweeps along the section's leading edge (§3.1). The beat's content becomes visible **in the sweep's wake**, trailing the leading edge by ~180ms, as a masked reveal rather than an independent translate:

```css
.beat__content {
  /* Visible by default (§7.3). The .js scope adds the hidden start state. */
  clip-path: inset(0 0 0 0);
  opacity: 1;
}
.js .beat:not(.is-revealed) .beat__content { opacity: 0; }
.js .beat.is-revealed .beat__content {
  animation: wake var(--d-slow) var(--ease-entrance) 180ms both;
}
@keyframes wake { from { opacity: 0; clip-path: inset(0 0 28% 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
```

**Why this replaces the obvious answer.** The first draft of this document specified `+16px Y, opacity 0→1` on every beat — a fade-and-rise. That is the single most category-interchangeable motion on the web: it is what every landing page does, it would be identical on a competitor's site, and it introduces a *second* motion idea that has nothing to do with the one device. Reveal-in-the-wake costs the same bytes, animates the same two properties, and is only expressible on a site that has a threshold — which is the definition of a motion that belongs to this product.

It also removes a contradiction. §2.4 requires that things enter from where they came from; content that "rises from below" came from nowhere — it was always at that scroll position and only the viewport moved. Light arriving from a source that exists on screen is the honest account of what changed.

Amplitudes are stated as percentages of the token, never as new values: the glow is always `--threshold` from brand §3.7, modulated. **No component may introduce a second glow, including on hover.** That single prohibition is what keeps the effect readable at 4.2/10 → 9/10.

---

## 4 · The techniques, deployed or refused — with reasons

The brief lists thirteen techniques and expects each *"where it earns its place, none as decoration."* Six are deployed, one is deployed in a restricted form, six are refused. Every refusal traces to a decision already made in `03-brand.md` or `02-strategy.md`, which is the test of whether those documents were real.

| # | Technique | Verdict | Where / why |
|---|---|---|---|
| 1 | **Scroll storytelling** | ✅ **Deploy** | **Beat 3.** The cascade *draws itself* as you scroll: stage 1 lights, then 2, then 3, then 4, with the connector filling between them, scrubbed to scroll position. This is the one section that must *tell* rather than list, because "the LLM is the last resort" is a claim about **order**, and order is exactly what a static diagram communicates worst. Also **Beat 4** at lower intensity: the data-flow paths draw from disk outward, and the one path that leaves the machine draws last and stops at a wall. |
| 2 | **Depth & layering** | ✅ **Deploy** | Three planes only: threshold glow (back), content (mid), the nudge and popovers (front). Three is enough to read as space and few enough to never be ambiguous. Governed by `--elev-*` from brand §3.7 — motion does not invent new depths, it only moves things between existing ones. |
| 3 | **Parallax** | ⚠️ **Restricted** | **Only the threshold glow layer, and its differential is derived, not chosen** (see row 4). **Never on text.** Never above 8% differential. Rationale: the audit's baseline site had parallax on reading content, which is the single most reliable way to make a page feel cheap and to induce vestibular discomfort. |
| 4 | **3D transforms** | ⚠️ **Restricted — one use** | The threshold's parallax comes from *real perspective*: the glow layer sits at `translateZ(-1px)` inside a `perspective: 4px` container, so its differential falls out of the projection maths instead of a hand-tuned percentage. It is therefore correct at every viewport and zoom level for free, and it is the one place the brief's *"tilt with real physics"* is satisfiable honestly. **Pointer-tilt on product cards is refused** (row 8). |
| 5 | **Text reveals (char/word/line)** | ✅ **Deploy — exactly once** | **Beat 2, the renegotiation sentence**, at **word** granularity. Once, on the site's quietest beat, where the reader is being asked to supply a memory and the pacing of the sentence *is* the content. Character-level is refused: it is 4× the nodes for a legibility cost, and at `--fs-h1` it reads as a slot machine. A11y treatment in §7.2 is mandatory, not optional. |
| 6 | **Masked transitions (clip-path)** | ✅ **Deploy** | The threshold sweep (§3.1) and the cascade's connector fill. Both are *a thing being revealed by light travelling*, which is the device's own logic. No wipes elsewhere. |
| 7 | **Stagger** | ✅ **Deploy** | Per §2.3's meaning test. Three staggered lists on the whole site. |
| 8 | **Interactive cards** (pointer light, tilt, magnetic content) | ❌ **Refuse** | Brand §3.7 commits to **flat-with-hairlines precision plus exactly one light source**, and §2.1 makes "one glow: the threshold" the second-highest invariant. A pointer-tracked highlight is a second, mouse-shaped light source on every card. It is the most fashionable effect on this list and it directly contradicts the one decision that makes the site recognisable. Refusing it is not restraint for its own sake — *it is what buys the threshold its meaning.* |
| 9 | **Magnetic buttons** | ❌ **Refuse** | Two independent reasons. **Motorically:** a target that moves toward the cursor invalidates the ballistic phase of the pointing movement; Fitts-law-conformant acquisition depends on a stationary target, and magnetism measurably costs time on the corrective phase for a novelty payoff. **Tonally:** the brand voice (`02-strategy.md` §1.5) is *"calm, on your side, slightly immovable — the register of something standing at a door."* A button that flinches toward the cursor is the opposite of immovable. The primary CTA is the last thing on this site that should feel eager. |
| 10 | **Cursor effects** | ❌ **Refuse** | The brief's own test — *"only if they carry meaning; a bespoke cursor that does nothing is a liability."* Nothing on a 9-beat landing page needs a custom cursor to be comprehensible. It would also have to be disabled on touch (~55% of traffic), under reduced motion, and for forced-colors, meaning it is an effect that only exists for a minority of sessions. |
| 11 | **Ambient movement** | ✅ **Deploy — exactly one** | The threshold breath (§3.2). One ambient loop on the entire site. The audit found 20+ concurrent radial glows on the current site; the difference between "alive" and "restless" is the count. |
| 12 | **Micro-interactions on every interactive element** | ✅ **Deploy — mandatory** | Every interactive element gets rest/hover/focus-visible/active feedback within `--d-micro`. Full state matrix is `05-interaction.md`'s deliverable; the *timing* contract is here: **≤120ms acknowledgment on every input, without exception.** An element with no hover state is a defect, not a style choice. |
| 13 | **Physics-based drag/throw/flick** | ➖ **N/A — nothing is draggable** | Recorded rather than silently skipped, per §4.1 of the brief. Nothing on this site is dragged, thrown, or flicked; the source switcher (§5) is a discrete 3-way control, correctly a set of buttons, not a slider. Inventing a draggable element to justify a spring would be decoration by definition. |

**The refusals, summarised as one sentence for the review panel:** *the site refuses every effect that would introduce a second light source or a second personality, and spends the whole budget on one device moving correctly.*

---

## 5 · The signature moment — full choreography

> **The Guardian, live in the hero.** The visitor causes a classification and watches the cascade resolve. Four seconds, their own agency, the whole thesis.

### 5.1 What is on screen at rest

```
┌─ CURRENT TASK ─────────────────────────────┐
│  Build the onboarding flow                 │   ← real task shape, brand §3.10 reproduction
├────────────────────────────────────────────┤
│  YOU OPEN…    [github.com] [docs.stripe.com] [youtube.com]   ← 3 buttons, none preselected
├────────────────────────────────────────────┤
│  1  hard rules            ·                │
│  2  your corrections      ·                │   ← 5 rows, all at rest (dim, dotted marker)
│  3  title keywords        ·                │
│  4  local model           ·                │
│  5  no match              ·                │
├────────────────────────────────────────────┤
│  (verdict area — empty at rest)            │
└────────────────────────────────────────────┘
```

**Nothing autoplays** (strategy §Beat 1: *"the visitor's own click drives the classification"*). At rest the component is legible and static; it is not a loop waiting to be interrupted. After 6s of no interaction, the first source button's threshold brightens once over `--d-base` — a single, non-repeating hint, not a pulse. It never fires twice.

### 5.2 The three paths — honest to `cascade.ts`

| Click | Stages traversed | Deciding stage | Verdict | `reason` shown (verbatim from source) |
|---|---|---|---|---|
| `github.com/lockinra/desktop` | 1 | **1 · hard rules** | `productive` | *allow-list match* |
| `docs.stripe.com/payments` | 1 → 2 | **2 · your corrections** | `productive` | *"matched 3 of your past corrections"* |
| `youtube.com` — *"F1 race highlights"* | 1 → 2 → 3 → 4 | **4 · local model** | `distracting` | *model verdict + a coach line* |

The rows a click *passes through* are visibly marked as **checked-and-passed** — a different state from both *resting* and *deciding*. This is what makes the diagram honest: the visitor can see that stage 3 exists and was consulted, even though it never decides on these three inputs. Stage 5 (`no match`) is drawn permanently and never lights; it is there because it is real, and its rest state says `silent — nothing shown to you`, which is itself a trust claim (the app does not nag when it doesn't know).

### 5.3 Frame-by-frame — the YouTube path (the long one)

Cumulative time from pointer-up. Every value is a token; nothing here is hand-picked.

| t | What moves | Property | Duration · curve |
|---:|---|---|---|
| 0 | Source pill commits to selected | `scale 1→0.96→1`, threshold +1 step | `--d-micro` · `--ease-commit` |
| 0 | **Acknowledgment complete** — see §5.5 | — | — |
| 90 | Row 1 marker: rest → **evaluating** | `opacity`, marker `scale 1→1.15` | `--d-fast` · `--ease-entrance` |
| 290 | Row 1 → **passed**; connector 1→2 fills | `clip-path` inset 100→0 | `--d-fast` · `--ease-move` |
| 430 | Row 2 evaluating (offset `--stagger-step` ×1 after connector) | as row 1 | `--d-fast` · `--ease-entrance` |
| 630 | Row 2 → **passed** (no correction clears 0.75); connector 2→3 | | `--d-fast` · `--ease-move` |
| 770 | Row 3 evaluating | | `--d-fast` · `--ease-entrance` |
| 970 | Row 3 → **passed** (no keyword signal); connector 3→4 | | `--d-fast` · `--ease-move` |
| 1110 | **Row 4 wakes.** Threshold on this row only, sweeping | `clip-path` + glow | `--d-slow` · `--ease-move` |
| 1110 | Row 4 label switches to `local model · working` | `opacity` cross-fade | `--d-fast` · `--ease-entrance` |
| 1630 | Verdict chip lands in the verdict area | `scale 0.9→1`, `opacity 0→1` | `--d-base` · `--ease-commit` |
| 1790 | Nudge card enters from the coach avatar edge | `translateY 12→0`, `scale .96→1`, `opacity` | `--d-fast` (per §2.2 worked example) · `--ease-entrance` |
| **1990** | **Resolved.** Nothing further moves. | | |

Total ≈ **2.0s** for the longest path; the `github.com` path resolves at **≈390ms** because it decides at stage 1. *That the fast path is visibly, dramatically faster is the point* — it is the performance argument (objection 1.5, "will it eat my battery") made without a single word, and it is the reason this beat also absorbs the deleted `performance` section (strategy §3, row 9).

**Replay:** clicking a different source resets rows to rest over `--d-micro` before the new run begins. Clicking the *same* source again replays. There is no cooldown and no lockout — a visitor who wants to watch it five times is the visitor we want.

### 5.4 The nudge — and the one thing the site must not imply

The nudge card shows a coach line in the **supportive** voice, labelled as such, alongside the two other voices the app ships (`dark_humor`, `drill` — verified in [`packages/ai/src/prompts.ts:131-135`](../../LockinRa/packages/ai/src/prompts.ts)).

**Hard rule: the line is pre-written and shipped as static text. The site must never imply that a model is running in the browser.** No typing effect, no streaming cursor, no "thinking…" spinner that implies inference. The demo depicts *the app's* behaviour; it does not simulate it. A typewriter effect here would be the motion-design equivalent of a fabricated testimonial — it manufactures the appearance of evidence — and it is banned for the same reason.

The card carries a `mono` micro-label reading `illustrative — the model runs on your machine, not on this page`, per brand §3.10's sourcing rule. Mono is correct here because it is system speech.

### 5.5 The acknowledgment contract

`--d-micro` (120ms) is the **hard ceiling from pointer-up to first pixel change**, and the pill commits at t=0 precisely so this is met regardless of anything downstream. The cascade choreography is a *narrative* that unfolds over 2s; the *interface* must feel instantaneous. Those are different clocks and conflating them is why "loading" animations feel slow even when they are fast.

### 5.6 Degradation — three honest floors

| Condition | Behaviour |
|---|---|
| **`prefers-reduced-motion: reduce`** | Identical information, zero tweening. Click → all five rows resolve to final state, verdict and nudge appear, in **one instant step**. The *sequence* survives as a static, numbered, fully-labelled trace (rows read `passed` / `decided`), because the sequence is information, not decoration. Total elapsed: 0ms. |
| **No JS** | Renders as a static three-row classified list showing all three verdicts at once, with their deciding stages named. **The information survives; only the interactivity is lost** (strategy §4). This is the markup's default state — the JS *removes* rows 2 and 3 to build the interactive version, so a failed script leaves the honest fallback rather than an empty box. |
| **Cold start honesty** | A footnote states that stage 2 is empty until you have corrected it a few times, and that behaviour then reduces to rules → keywords → model. Sourced to the comment in `cascade.ts:17-19`. Volunteering this costs nothing and is the same move that made the encryption disclosure the site's strongest sentence. |

---

## 6 · The engineering contract

### 6.1 Properties

**Animate `transform`, `opacity`, and `clip-path` only.**

`clip-path` is the one addition beyond the brief's stated pair, so it is justified rather than assumed: the threshold sweep and the cascade connector fill are both *"light travelling along a path"*, which cannot be expressed as transform+opacity without either a masking overlay in the section's background colour (which breaks the instant the section sits on any non-flat backdrop, and breaks under forced-colors) or a scaleX on a child (which distorts the hairline's end caps and its 1px stroke). `clip-path` on a composited layer is GPU-accelerated in all current engines and does not trigger layout or paint. **It is animated only on elements that are already promoted, and only on inset/polygon geometry — never on `path()`, which is not universally interpolatable.**

**Banned outright, in any scroll-linked or repeating context:** `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-width`, `box-shadow`, `filter`, `background-position`.

Two consequences worth stating because they will otherwise be violated by accident:
- **The threshold's glow is `box-shadow`, and `box-shadow` is banned.** Therefore the breath (§3.2) does **not** animate the shadow. The glow is rendered once on a dedicated absolutely-positioned layer with a fixed `--threshold` shadow, and the breath animates that layer's **`opacity` and `scale`**. Same perceived effect, zero repaints. *(The app's `lk-momentum-aura` animates `box-shadow` directly — acceptable at component scale in a desktop app, not acceptable in a scroll loop on a landing page. This is a deliberate, documented divergence from the inherited system.)*
- **The skeleton shimmer pattern from `motion.css` animates `background-position`** and is therefore not portable to this site. The site has no skeletons (§Phase 8 — everything above the fold is static HTML), so nothing is lost.

### 6.2 Scroll

**CSS-native first, JS fallback second.**

```css
@supports (animation-timeline: view()) {
  .beat-reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 15% cover 35%; }
}
```

The scroll-driven path runs entirely off the main thread. Where it is unsupported, a single shared `IntersectionObserver` adds a class; there is **exactly one observer instance for the whole page**, with elements registered into it, never one observer per element.

**Zero un-throttled scroll listeners. Zero `scroll` listeners of any kind** is the target and is achievable: the only scroll-*scrubbed* element is Beat 3's cascade, which uses `animation-timeline: view()` natively and a `requestAnimationFrame`-driven fallback that reads `getBoundingClientRect()` **once per frame, in the read phase, before any write.** No layout thrash: all reads batch, then all writes.

`will-change` is applied by the observer **on approach** (when the element enters the root margin) and removed in the `animationend`/`transitionend` handler. It is never present in a stylesheet's static declaration and never applied to more than ~6 elements at once. A blanket `will-change: transform` is a memory leak with good intentions.

### 6.3 Libraries — none, with the byte case written down

| Candidate | Compressed cost | What it would buy | Verdict |
|---|---:|---|---|
| GSAP core + ScrollTrigger | ~**34 KB** | Scroll scrubbing, timelines | ❌ The site has **one** scrubbed element and **one** timeline. 34 KB is 42% of the entire 80 KB JS budget for something `animation-timeline: view()` does natively at 0 KB. |
| Motion One | ~**5 KB** | A spring solver, WAAPI wrapper | ❌ Nothing on the site needs a spring (§2.1) and WAAPI needs no wrapper for the ~8 animations that are JS-driven at all. |
| Lenis (smooth scroll) | ~**3 KB** | Momentum scrolling | ❌ **Refused on correctness, not bytes.** The brief requires that smooth-scroll never break native anchor jumps, keyboard scrolling, Home/End, find-in-page, or reduced-motion. Scroll hijacking cannot guarantee find-in-page scroll-into-view under all engines, and this site has a skip-link, in-page anchors, and a keyboard contract. It also overrides the user's own OS scroll physics, which on a site whose thesis is *"nothing here is taken from you"* is a small hypocrisy. |

**Total animation library budget: 0 KB.** The complete motion runtime is one IntersectionObserver, one rAF loop that runs only while Beat 3 is in view, and the signature moment's state machine — estimated **< 4 KB compressed**, accounted in `07-performance.md`.

### 6.4 The 60fps contract — and how it is measured

*"60fps or it doesn't ship"* is only a real constraint if there is a method. Phase 10 verifies each section with:

1. **Frame timing** — a `requestAnimationFrame` delta histogram captured while programmatically scrolling the section at ~1000px/s. Recorded as **p50, p95, and worst frame**. Pass = p95 ≤ 18ms (≥55fps) and worst ≤ 33ms (no dropped-frame pair).
2. **Long tasks** — `PerformanceObserver` on `longtask` during that scroll. Pass = **zero entries > 50ms.** Any entry is a bug with a name, not a "feel" problem.
3. **Layer count** — DevTools layer inspection at each breakpoint. Pass = no unexpected promotions; the threshold layer, the nudge, and (transiently) whatever `will-change` is on.

Numbers get recorded in `07-performance.md`, per section, before/after. *"It feels smooth"* is not a measurement and is not accepted.

---

## 7 · The accessibility contract for motion

Non-negotiable, per §3 of the brief. The prior work in this codebase shipped animation that ignored `prefers-reduced-motion`; the app has since corrected it (`motion.css:284-381`) and the correction's *doctrine* — not merely its code — is inherited here.

### 7.1 The reduced-motion matrix

The inherited doctrine is that **functional motion survives, decorative motion stops** — the app deliberately keeps its spinner turning because a frozen spinner reads as broken. The site applies the same test, and it is stricter than a blanket kill because a blanket kill silently destroys information.

| Motion | Under `reduce` | Rationale |
|---|---|---|
| Parallax (threshold layer) | **Off** — layer is static | Vestibular. Non-negotiable. |
| Ambient breath | **Off** — glow holds at rest value | Infinite decorative loop; exactly what the query asks to quiet |
| 3D perspective on the glow layer | **Off** — `perspective: none` | Same class as parallax |
| Beat scroll reveals | **Instant** — content visible, no transition | The content is the information; the reveal is not |
| Word-by-word text reveal (Beat 2) | **Instant, whole sentence** | See §7.2 |
| Threshold sweep | **Instant** — line is simply lit | The lit state is the information |
| Cascade choreography | **Instant final state**, full static trace | **The sequence is information** — it is dropped to zero duration, never omitted |
| Micro-interactions (hover/focus/active) | **Instant, still present** | A state change that conveys state must still *change*. Removing feedback is a worse a11y outcome than animating it. |
| Focus ring | **Instant, always present** | Never conditional on anything |
| Magnetic / cursor / pointer-light | n/a | Refused for everyone (§4) |

The implementation is **one media query at the system level**, not a per-component patch (per §12 of the brief — reduced-motion is architectural):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Decorative layers stop entirely rather than snapping to a final frame. */
  .threshold__glow { animation: none !important; }
  .parallax-layer  { transform: none !important; }
  :root { --parallax-depth: 0; }
}
```

The `--parallax-depth: 0` line is the important one: it neutralises parallax *at the token level*, so a component added later inherits the correct behaviour without its author having to remember. That is the difference between a system and a patch.

**JS honours it too, and re-honours it on change:**
```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
reduced.addEventListener('change', applyMotionPolicy); // toggling the OS setting takes effect live
```

### 7.2 Split-text reveals must not shred the accessibility tree

Beat 2's word reveal is the only split text on the site, and it ships with this markup contract:

```html
<h2 class="reveal-words">
  <span aria-hidden="true">
    <span class="w">The</span> <span class="w">renegotiation</span> …
  </span>
  <span class="sr-only">The renegotiation: the quiet deal you make with yourself at 2pm.</span>
</h2>
```

- The visual layer is `aria-hidden` and contains the word spans.
- The screen reader gets **one uninterrupted sentence** from the `sr-only` node.
- **Whitespace between spans is real whitespace**, not `margin` — so text selection, find-in-page, and copy-paste produce a normal sentence with normal spaces. (Splitting with margins is the classic bug: the page *looks* right and copies as `Therenegotiationthequiet…`.)
- Under `reduce`, the spans render at full opacity with no transition; the sentence is simply there.

**Verification is mandatory and specific:** read the a11y tree in Phase 10 and confirm the heading exposes exactly one text node with the full sentence. If the tree shows 14 separate text nodes, the reveal is deleted rather than debugged — it is worth less than the heading.

### 7.3 The remaining floors

- **No flashing between 3 Hz and 55 Hz.** Nothing on this site flashes at all; the fastest repeating motion is the 4.5s breath (0.22 Hz), which is ~14× below the floor. Recorded so the claim is checkable rather than assumed.
- **No infinite motion adjacent to reading content.** The threshold breath is the only infinite animation, it lives on section boundaries, and its amplitude is ±18% of a glow's spread — not a moving element. No animated element sits within the measure of body text.
- **Motion never gates content.** Every revealed element's *resting* state is visible. The `IntersectionObserver` path adds a `is-revealed` class to elements that are **already at `opacity: 1`** in the no-JS stylesheet; the hiding rule lives inside a `.js` scope set by an inline script in `<head>`. If the observer never fires, if the script errors, if the class never lands — **the content is on screen.** This is the inverse of the common pattern (hide in CSS, reveal in JS), which turns any script failure into a blank page.
- **Scroll position is never hijacked**, so `Home`/`End`/`Space`/`PgDn`/find-in-page/anchor jumps all behave natively (§6.3).
- **`animation` is never load-bearing for a link, button, or download.** Every CTA is functional with CSS and JS both disabled.

---

## 8 · Phase 5 gate — motion review

Per §4.2 of the brief, the gate after the motion system is *"animation/motion MCP review of curves, timings, and choreography."*

**Tool status — corrected 2026-08-01.** The Phase 1 inventory recorded *Impeccable* and the *taste* skills as "not connected." That was wrong, and the error was searching for **MCP servers** when they are installed as **Skills**. `00-audit.md` §0 is amended. No animation-specific *MCP* exists (Higgsfield's `motion_control` is video motion transfer and cannot review an easing curve), but the capability was available all along and has now been used.

**Gate run: `impeccable` → `reference/animate.md`, applied to this document.**

Scope note, stated rather than glossed: the skill's full `critique` command mandates two isolated sub-agents, one of which runs a **deterministic markup detector**. There is no markup yet — Phase 10 has not started — so that assessment has nothing to scan and screenshots have nothing to capture. Running it now would produce an empty half of a report. `critique` is therefore **deferred to Phase 10/11**, where it has a real page, and this gate ran the motion playbook's review criteria directly. That is not a degraded `critique`; it is the correct instrument for a spec.

**Three defects found, all three fixed in this revision:**

| # | Sev | Finding | Fix |
|---|---|---|---|
| 1 | **P1** | **The beat reveal was a generic fade-and-rise.** `animate.md` names it explicitly: *"a generic fade-and-rise, hover lift, parallax layer, or scroll reveal is not a thesis."* The first draft specified `+16px Y, opacity 0→1` on all nine beats — motion that would be identical on any competitor's site, and a *second* motion idea competing with the one device | **§3.4 reveal-in-the-wake.** The threshold reveals the beat; content does not travel. Same two properties, same bytes, only expressible on a site that has a threshold |
| 2 | **P1** | **The ambient breath never stopped.** `animate.md`: *"any nonessential loop must stop when offscreen or hidden."* An infinite composite in a backgrounded tab — on a site whose Beat 8 answers *"will it eat my battery"* | **§3.2.** Paused by the existing IntersectionObserver on exit and by `visibilitychange`. Idle cost zero |
| 3 | **P2** | **Bounce by reflex on the press state.** `animate.md`: *"do not use bounce or elastic curves by reflex."* `--ease-commit`'s 1.56 overshoot was applied to the source pill's `:active` — but a press is an *acknowledgment*, not a commit; only the selection commits | `05-interaction.md` §2.2 ⑤: press decelerates (`--ease-entrance`), the selected-state transition keeps `--ease-commit` |

**Two findings assessed and deliberately not changed:**

- **The cascade shows 5 rows, above the ≤4 working-memory guidance.** It is not a decision point — the visitor chooses nothing among the rows — and the rows resolve *sequentially*, so simultaneous load is 1, not 5. Reducing to 4 would mean deleting a real stage, which §0.1 exists to prevent. Kept, with the sequencing as the mitigation.
- **`--d-base` at 320ms sits 20ms above the playbook's 150–300ms "routine state change" band.** It is inherited from the app and the divergence is imperceptible; breaking token parity with the product to save 20ms would cost more than it buys.

**Remaining self-assessed risks, carried into Phase 10/11:**

1. **The 2.0s signature moment is long for a hero.** Mitigations already in the design: nothing autoplays, so the clock only starts on the visitor's own click; the `github` path resolves in 390ms, so a visitor who clicks that first learns the interaction is fast; and the duration *is* the argument (the slow path is slow because the model is expensive, which is the point). **Watch item for Phase 11:** if the panel's UX researcher finds hesitation, the fix is to compress stages 2–3 to `--d-micro` markers rather than to cut the narrative.
2. **`--ease-commit`'s 1.56 overshoot is the riskiest inherited value.** On the verdict chip (a small, scale-only move) it reads as a decision landing. On anything larger it will read as broken. The ±32px size cap in §2.1 is the guard, and it needs enforcing in review, not just documenting.
3. **Beat 3's scrubbed cascade is the only scroll-scrubbed element and therefore the only real 60fps risk.** It is also the section most likely to be reached for on mobile, where the fallback path (rAF) runs instead of the native timeline in older Safari. Phase 10 measures this section **first**, not last.

---

## 9 · Open items this phase created

| # | Item | Owner |
|---|---|---|
| 1 | **Amend `02-strategy.md` §1.4/§4 and `01-research.md`**: "three-stage cascade" → four stages + silent fallback; "semantic match against task text" → "kNN over your own past corrections" | Phase 6 doc pass — **blocking for Beat 3 and Beat 1 copy** |
| 2 | Beat 3's diagram must show 5 rows, not 3 | `05-interaction.md` |
| 3 | Cold-start footnote copy (stage 2 empty until corrected) | `09-copy.md` |
| 4 | The nudge's coach line — written, static, labelled `supportive` | `09-copy.md` |
| 5 | Record the ±32px `--ease-commit` cap as a review-checklist line | `10-reviews/` |

---

## 10 · What a different engineer would need

Five invariants, in priority order. `03-brand.md` reproduces the look; these reproduce the feel.

1. **Every animation names its job.** If it cannot be assigned one of the five curves and one of the six durations, it does not ship.
2. **One glow, one ambient loop, one split text, one scrubbed section.** The counts are the system.
3. **`transform`, `opacity`, `clip-path`. Nothing else moves.**
4. **Enter from where you came from; leave toward where you're going; exit at 0.6× enter.**
5. **Reduced motion changes duration to zero — never information to zero.** The cascade still tells you it checked four stages.
