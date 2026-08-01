# Review round 1 — after the first full build

**Date:** 2026-08-01 · **Scope:** `index.html` (9 beats), `404`, `privacy`, `support`, `linux`
**Method:** adversarial panel (§14 of the brief) + `impeccable` deterministic detector + measured browser verification.
**Provenance, stated rather than glossed:** the panel ran **in-thread, not as isolated sub-agents**, and the **visual half of this review did not happen** — see §0. Scores below reflect what was actually verified.

---

## 0 · What this round could not assess

Screenshots fail in this session: `the Browser pane is not displayed, so the page is not compositing frames`. Everything below comes from computed styles, measured geometry, the accessibility tree and the detector — which is **stricter** than eyeballing for contrast, overflow and target size, and **useless** for optical balance, rhythm, and whether the page is beautiful.

So: **Design and Creativity are scored on structure and intent, not on appearance.** Those two scores are provisional and are the first thing round 2 must revisit with real pixels. Not claiming otherwise is the point.

---

## 1 · Scores

```
Design            7 /10   (provisional — composition unverified, §0)
Usability         9 /10
Creativity        7 /10   (provisional)
Content           9 /10
Mobile            8 /10
A11y              9 /10
Performance       9 /10
Motion            7 /10
Brand distinctive 8 /10
─────────────────────────
Overall           8.1/10
```

Exit criteria demand **every dimension ≥9 and overall ≥9.2**. This round does not pass. Three more rounds minimum, per §15.

---

## 2 · The panel

**The Apple HIG designer — 7/10.**
One clear idea per beat, and the volume alternation (▓░▓░) is real, not asserted. But **Beat 6 is four text cards in a grid**, which is exactly the "equal cards" failure the audit named — we cut 15 cards down to 4 and kept the shape. The strategy promised *"real cropped product captures, the Raycast principle."* We shipped words. That is the single biggest unfulfilled commitment in the build.

**The Linear engineer — 9/10.**
"Would I be proud to inherit this?" Yes. `@layer` makes the cascade predictable, the token boundary is greppable and clean, five modules under 80 lines each, every start has a stop. 24.5 KB critical path. The one thing I would push back on: `guardian.js`'s timing constants are a hand-rolled scheduler where a small timeline abstraction would read better — but at 80 lines, abstraction would cost more than it saves. Ship it.

**The Framer motion designer — 7/10.**
The reveal-in-the-wake idea is genuinely good and genuinely ownable: content appears *behind travelling light* instead of rising 16px like every other site. The cascade choreography earns its 2 seconds. **But almost none of it has been seen moving.** Frame timing is unmeasured, the ambient breath has never been watched, and reduced-motion has not been exercised under real emulation. A motion score that hasn't watched the motion caps at 7.

**The Awwwards judge — 7/10.**
*Three words?* "Honest, quiet, mechanical." That's specific, which beats most of the 400 sites I saw this month. The cascade is a real interaction with a real idea underneath, and the privacy disclosure is the most memorable paragraph on any product site I've read this quarter. What holds it at 7: the visual world is **restrained to the point of being under-designed in the middle**. Beats 5–8 are lists, a table and an accordion. The threshold is a 1px rule — a *concept* that is disciplined but may be too quiet to be recognisable from across a room, which was the entire argument for choosing direction B.

**The UX researcher — 9/10.**
Persona 1 gets a demonstration in the first screen and can cause it themselves. Persona 3 gets the disclosure at beat 4 and a devtools challenge they will actually run. Persona 2 gets "free, no card, runs on 8GB" before any RAM number can scare them. Where they hesitate: **Beat 6.** Having been shown a real mechanism in beats 1–4, they arrive at "here's a workspace" and get told rather than shown. That's the drop-off.

**The brand strategist — 8/10.**
Could a competitor swap their logo in? For beats 1, 3 and 4, no — those depend on facts only this product has. For beats 5–8, yes, mostly. The threshold device is ownable but is currently carried by one hairline per section; it deserves at least one moment where it does something only it could do.

**The accessibility auditor — 9/10.**
Line by line, no charity: one `h1` per page, no heading skips, all nine sections named, landmarks correct, zero `div[onclick]`, contrast computed in a live render in both schemes with the lowest text pair at 6.31:1, focus ring verified on real keyboard focus, roving tabindex correct, one announcement rather than eight. The `--border-control` fix is a genuine catch. **Withheld point:** the screen-reader read-through and forced-colors render have not been performed, and 400% zoom has not been exercised.

**The performance engineer — 9/10.**
92 KB → 24.5 KB critical path while *gaining* an interaction. JS at 7.8% of budget, CSS at 24%. Zero third-party bytes except the one disclosed beacon. CLS is zero by construction rather than by tuning. **Withheld point:** LCP, CLS and INP are predicted, not measured. A budget table with empty cells is an honest budget table, not a passing one.

**The skeptical target user — 9/10.**
*"Convince me without making me click."* The page tells me task titles are stored in plain text before I could find out myself, tells me the Linux build is three versions stale on the download page, and tells me it loads one analytics script and invites me to check. Nobody does that unless the rest is true. The one thing still nagging: the classification demo is illustrative and labelled as such — correct, but it means I still haven't seen the actual product running.

---

## 3 · Top flaws, ranked by damage to the visitor

| # | Flaw | Root cause | Fix | Expected movement |
|---|---|---|---|---|
| 1 | **No visual verification at all** | The Browser pane isn't compositing | Display the pane, screenshot all 7 breakpoints, both schemes | Design/Creativity become real scores |
| 2 | **Beat 6 shows nothing** — 4 text cards where the strategy promised real cropped product surfaces | Built the cheap version first | Build 2–3 live HTML product reproductions from tokens, cropped tight to one interaction each | Design +1, Creativity +1, Brand +1 |
| 3 | **Motion unwatched** | Same as #1, plus no frame measurement | rAF histogram per section; watch the breath and the sweep | Motion +2 |
| 4 | **CWV predicted, not measured** | Needs throttled emulation | Run the §6 protocol; fill `07-performance.md` §7 | Performance +1 |
| 5 | **Reduced-motion never exercised** | Cannot emulate the media query here | Force it and re-run the cascade; confirm instant + full trace | A11y +0.5, Motion +0.5 |
| 6 | **Screen-reader read-through missing** | Deferred from Phase 7 | Run it; record verbatim in `06-accessibility.md` §8 | A11y +1 |
| 7 | **The threshold is too quiet** | Discipline over-applied | Give it one moment of real presence — likely the Beat 4 data-flow | Brand +1, Design +0.5 |
| 8 | **Beats 5–8 are structurally generic** | List, ladder, table, accordion | At minimum, make the comparison table's LockinRa column feel authored | Design +0.5 |
| 9 | **`.guardian__static` is removed rather than replaced** | Simplest correct no-JS story | Reasonable as-is; revisit only if #2 changes the component | — |
| 10 | **Store link returns 403 to automated checks** | Microsoft bot filter | Verify in a real browser before shipping; do not claim verified until then | Content integrity |

---

## 4 · The one thing that would most improve this site

> **Build Beat 6 as real product surfaces.**

Beats 1–4 *show*. Beats 5–9 *tell*. The page spends its first half earning the right to be believed and its second half asking to be taken at its word — and Beat 6 is exactly where a reader who now trusts the mechanism wants to see the room. The brand doc already specifies how (live HTML reproductions from real tokens, identical framing, cropped to the one interaction that matters, never a shrunken window). The instrument exists; it has been used once.

Everything else on the list is verification. This is the only item that is *design*.

---

## 5 · Detector

`impeccable/scripts/detect.mjs --json` over all five pages.

| Run | Findings |
|---|---|
| First | **3** — em-dash saturation (21 in `index.html`, 13 in `privacy.html`), aphoristic cadence (3 constructions) |
| After copy pass | **0** |

Both were real. 21 em-dashes is a cadence tell that directly undercuts a voice specified as *dry and measured*; most were doing work a colon, semicolon or full stop does better. Now 6. The aphoristic run included Beat 9's foot repeating Beat 8's headline nearly verbatim — genuine redundancy, not just rhythm.

**Recorded so it is not mistaken for a clean first pass:** the detector was deferred from the Phase 5 gate because it scans markup and no markup existed. It found copy defects on its first real run that eight rounds of human-style review had not.

---

## 6 · Fixed within this round

**Flaw #2 — Beat 6 shows nothing — is resolved.** Each of the four clusters now carries a real product surface, reproduced in HTML from the app's own tokens: a task list with a completed row and an `[#A]` priority chip, a capture waveform with the utterance beneath it, a screen-time bar strip with the day's real split, and a coach line labelled with its voice. Framing is identical across all four — same radius, same inset, same inner padding, cropped to the one interaction that matters — because inconsistency in framing is where perceived quality leaks (`03-brand.md` §3.10). All four are `aria-hidden`: the surrounding copy already carries the meaning, and a decorative waveform read aloud is noise.

**A cascade collision was found by measuring, not by reading.** `.cluster-card p` (0,1,1) out-specified `.surface__cap` and `.surface__quote` (0,1,0), silently flattening the reproduction's internal hierarchy — caption and quote were computing to the *same* colour. Narrowed to `.cluster-card > p`. Verified after: caption at 5.90:1, quote at 15.41:1, cluster copy still muted. This is precisely the failure mode a specificity-flat architecture is supposed to prevent, and it still happened; the guard is measurement, not discipline.

**Re-scored after the fix:**

```
Design            8 /10   (was 7 — still provisional, §0)
Creativity        8 /10   (was 7 — still provisional)
Brand distinctive 9 /10   (was 8)
Mobile            8 /10
Usability         9 /10   Content 9   A11y 9   Performance 9   Motion 7
─────────────────────────
Overall           8.4/10  (was 8.1)
```

Still short of the 9.2 exit bar, and **the gap is now almost entirely verification rather than design**: Motion at 7 and the provisional Design/Creativity scores all resolve the moment the Browser pane composites and the frame histogram, screen-reader read-through, forced-colors render, 400% zoom and Core Web Vitals runs can actually happen. Round 2 is a verification round, not a redesign.

**Budget after the additions** — Beat 6's four surfaces cost 695 B of HTML and 1,029 B of CSS, gzipped:

| | Before round 1 | After |
|---|---:|---:|
| `index.html` gzip | 8,563 | 9,258 |
| `site.css` gzip | 9,722 | 10,751 |
| JS gzip | 6,262 | 6,262 |
| **Critical path** | 24,547 | **26,271** |

Still **71% below** the 92 KB baseline, with CSS at 27% of budget and JS at 8%.
