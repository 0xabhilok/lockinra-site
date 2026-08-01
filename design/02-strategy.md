# 02 · Strategy — positioning, narrative, section architecture

**Date:** 2026-08-01 · **Status:** awaiting sign-off (Phase 3 gate)
**Inputs:** `00-audit.md` (18 sections, ~3,470 words, 4.2/10 baseline, 3 truth blockers), `01-research.md` (canon principles, verified competitive facts, 3 personas + 18 mapped objections).

---

## 1 · Positioning

### 1.1 The sentence no competitor could truthfully write

> **LockinRa reads what you're actually doing, compares it to what you said you'd do, and argues with you about the difference — using a model that runs on your own machine and has nowhere to send anything.**

Each clause is load-bearing, and each one disqualifies a category:

| Clause | Who it rules out |
|---|---|
| *reads what you're actually doing* | Todoist, Things, Motion — a list has no idea what you're doing |
| *compares it to what you said you'd do* | Freedom, Cold Turkey, Opal — a blocklist has no concept of your current task |
| *argues with you about the difference* | RescueTime, Rize — a tracker reports after the fact and never intervenes |
| *runs on your own machine, nowhere to send anything* | **every AI competitor without exception** |

No competitor can write this sentence today, and the last clause cannot be copied without rebuilding the company.

### 1.2 The category

**Proposed shelf: the focus guardian.**

The existing shelves are *task manager*, *blocker*, and *time tracker* — LockinRa is misfiled on all three and looks like a weak entry on each. "AI-first productivity operating system" (the current framing) is bloated, unfalsifiable, and sounds like every AI startup.

"Guardian" earns the category because:
- It is **already the product's own internal name** for the mechanism (`Focus Guardian`) — we are elevating a real thing, not inventing marketing language.
- It encodes the *behaviour* (stands watch, intervenes) rather than the *artifact* (list, blocker, tracker).
- A guardian is something you *authorise* to watch you — which reframes the surveillance objection as consent rather than intrusion. That is the single most valuable reframe available to us, given that "I don't want to be watched" is the shared objection across all three personas.
- No competitor uses it.

Full form: **the local-first focus guardian.**

### 1.3 The enemy

Not "distraction." Distraction is the symptom, and every competitor claims it.

> **The enemy is the renegotiation** — the quiet deal you make with yourself at 2pm to undo what you decided at 9am.

Why this is the right enemy:
- **It is specific and universally felt.** Everyone recognises the internal negotiation ("I'll just check one thing", "I'll make it up tonight"). Nobody recognises "distraction" as a lived moment.
- **It names an adversary that is *you*** — which is the only honest framing, and it explains why willpower-based solutions fail structurally rather than personally.
- **It directly motivates the product's real architecture.** Extend-only blocks, the reconcile watchdog, grace timers, and the anti-cheat model all exist *because the system assumes the 2pm user will try to betray the 9am user.* The enemy and the engineering are the same idea.
- It gives the coach voices a reason to exist: three different ways of refusing the renegotiation.

### 1.4 The proof stack — ranked by hardness-to-fake

1. **The offline test.** *Pull the network cable. It keeps working.* Unfakeable, self-administered, and it collapses the entire "local-first usually means local cache + cloud sync" objection (3.2) in one action. Its site-side analogue: **open devtools on this page** — one disclosed request. The site becomes a scale model of the product's thesis.
2. **The shipping record.** 8 releases in 8 weeks (v1.0.0 2026-06-19 → v1.6.0 2026-07-18) with real dates and real byte sizes, plus a **published Microsoft Store listing** (Product `9N6KKXPCV2JW`) that a visitor can verify *without installing anything*. External, third-party-attested, checkable in ten seconds.
3. **The honest architecture.** The cascade drawn accurately — four decision stages and a silent fallback (`04-motion.md` §0.1), including that the LLM is the *last* resort, not the headline — and a precise statement of what is encrypted and what is not. Volunteering that task titles are plaintext SQLite is the strongest credibility move on the page, because a liar wouldn't.

These three replace what the fabricated testimonials and the two unsourced statistics were pretending to do.

### 1.5 Voice — three words

**Measured · Protective · Dry**

- **Measured** — we state numbers we can source and limits we could have hidden. Where we removed a number (the 90%), we say what we know instead.
- **Protective** — the register of something standing at a door. Calm, on your side, slightly immovable. Never anxious, never pleading.
- **Dry** — understated. Occasionally funny, never zany. Humour arrives via precision, not via exclamation marks.

**We never sound like this:**
- ❌ *"Supercharge your productivity with AI-powered focus!"* — hype, banned vocabulary, exclamation.
- ❌ *"We're on a mission to help you unlock your best self."* — mission-speak; makes it about us.
- ❌ *"Struggling to focus? You're not alone. 🧠✨"* — content-marketing empathy bait; emoji as design system.

---

## 2 · Narrative architecture — the scroll as a screenplay

Nine beats. The governing change from the current site: **the surveillance objection is answered at beat 4, not section 8.** All three personas share it; persona 3 has already opened the network tab by then.

The second governing change: **rhythm.** The current site runs 18 sections at one volume. Below, `▓` = dense/loud, `░` = sparse/quiet. Nothing is loud unless something adjacent is quiet.

---

**Beat 1 · HOOK** ░→▓
*Feeling:* "…wait, what is this?" · *Job:* stop the scroll by **demonstrating** intelligence, not describing it.
- **One idea:** it can tell the difference between your work and your escape.
- **Visual device:** the interactive guardian (see §4 — the signature moment). Real product surface, tightly cropped.
- **Motion device:** the visitor's own click drives the classification. Nothing autoplays.
- **Proof:** the cascade resolving live, with the deciding stage lit.
- **Objection killed:** 1.2 (blockers can't tell research from rabbit-holes).
- **Exit thought:** *"It knew. How did it know?"*

**Beat 2 · RECOGNITION** ░
*Feeling:* "that's literally me." · *Job:* name the enemy.
- **One idea:** the renegotiation. Focus isn't a willpower problem — it's a *negotiation* you lose at 2pm.
- **Visual device:** quiet, typographic, near-empty. The deliberate exhale after beat 1.
- **Proof:** none needed — this beat trades in recognition, not evidence.
- **Objection killed:** 1.1 (another blocker I'll disable by Tuesday) — because we name *why* they get disabled.
- **Exit thought:** *"So what would actually stop me?"*

**Beat 3 · REVELATION — the mechanism** ▓
*Feeling:* "oh — it's not guessing." · *Job:* make the invisible legible (the Stripe principle).
- **One idea:** perceive → understand → intervene → learn, with the staged cascade underneath.
- **Visual device:** an honest technical diagram. The one genuinely diagrammatic moment on the site.
- **Proof:** the cascade — hard rules first, then a vote over your *own past corrections*, then title keywords, and the LLM only for the genuinely ambiguous, with a silent fallback when nothing resolves. **This is what replaces "~90% accuracy."** (Amended from "three-stage / semantic match" — `04-motion.md` §0.1.)
- **Objection killed:** 1.5 (will it eat my battery) — the cascade *is* the efficiency answer.
- **Exit thought:** *"It's reading my screen, then."*

**Beat 4 · THE OBJECTION — answered structurally** ▓
*Feeling:* "…okay, I actually believe that." · *Job:* convert the strongest objection into the strongest proof.
- **One idea:** it never leaves. Not by policy — by architecture.
- **Visual device:** a data-flow diagram — what stays on disk, what is encrypted, what leaves only on explicit opt-in.
- **Proof:** the offline test, stated as an instruction the reader can perform. Precise encryption disclosure **including what is not encrypted.** Honest note that this page runs one cookieless analytics script.
- **Objections killed:** 1.3, 1.4, 2.4, 3.1, 3.2, 3.3, 3.4, 3.6 — **eight of eighteen.**
- **Exit thought:** *"Fine — but is this a real product or a side project?"*

**Beat 5 · IT SHIPS** ░
*Feeling:* "this is maintained." · *Job:* kill the abandonware risk.
- **One idea:** 8 releases in 8 weeks, and it's on the Microsoft Store.
- **Visual device:** the real changelog as a dated ladder. Restrained, factual, mono.
- **Proof:** proof-stack item 2 — externally verifiable without installing.
- **Objections killed:** 1.6, and Linux staleness disclosed here rather than hidden.
- **Exit thought:** *"What else is in it?"*

**Beat 6 · THE ROOM IT GUARDS** ▓
*Feeling:* "it's a whole workspace, not a widget." · *Job:* show breadth **without** the 15-card wall.
- **One idea:** the guardian guards a real workspace — tasks, notes, habits, analytics, capture.
- **Visual device:** real cropped product captures (the Raycast principle), grouped into 4 named clusters, not 15 equal cards.
- **Objection killed:** "is this just a blocker?"
- **Exit thought:** *"How is this different from what I already use?"*

**Beat 7 · WHY NOT THE OTHERS** ░
*Feeling:* "nothing else is this shape." · *Job:* place it on the new shelf.
- **One idea:** they each own one arc of the loop; this owns the loop, locally.
- **Visual device:** a real, semantic `<table>` — **now including Freedom and Cold Turkey**, which the current table conspicuously omits.
- **Proof:** verified pricing and positioning, dated, with a stated methodology.
- **Objection killed:** "I already pay for something."
- **Exit thought:** *"What does it cost me?"*

**Beat 8 · COST AND RISK** ░
*Feeling:* "there's nothing to lose here." · *Job:* remove every remaining barrier.
- **One idea:** free in beta, no account, light on the machine, one-time if you ever pay.
- **Proof:** the 8GB path stated *first*; CPU-only is fine; ~254 MB; five minutes to first session; one-time-not-subscription against a category that is 100% rented except Cold Turkey.
- **Objections killed:** 2.1, 2.2, 2.5, 1.7.
- **Exit thought:** *"Alright."*

**Beat 9 · DECISION** ▓
*Feeling:* "I want this now." · *Job:* frictionless download.
- **One idea:** one button. Platform-aware. Everything else subordinate.
- **Rule:** this is the only viewport on the site with a loud primary CTA and nothing competing.

---

## 3 · Section architecture — 18 → 10

| # | Current section | Verdict | Rationale |
|---:|---|---|---|
| — | `lk-intro` splash | ❌ **CUT** | Spends the entire 3-second comprehension budget on a logo; not keyboard-dismissible; blocks LCP |
| 1 | `top` hero | ♻️ **REBUILD** → Beat 1 | Becomes the interactive guardian. Real UI replaces the CSS drawing |
| 2 | `demo` 32 s film | 🔀 **MERGE** → Beats 1 + 3 | The ambition is right; an uncontrollable 32 s loop that hides ¾ of itself under reduced-motion is not. Its four scenes redistribute into the beats that need them |
| 3 | Stat band | ♻️ **REBUILD** → Beat 3 | Two of three numbers unsourced. Becomes the cascade |
| 4 | Problem → reframe | ♻️ **REBUILD** → Beat 2 | Good bones ("Focus isn't a willpower problem") sharpened to *the renegotiation* |
| 5 | `features` bento | 🔀 **MERGE** → Beat 6 | 6 cards |
| 6 | `toolkit` | 🔀 **MERGE** → Beat 6 | +9 cards. 15 equal cards → 4 named clusters with real captures |
| 7 | `made-for` personas | ❌ **CUT** | 5 cards × 38 words that neutralise no objection. The personas belong *inside* other beats' copy, not as a section. **Deletion is a design act** |
| 8 | `privacy` | ⬆️ **PROMOTE + REBUILD** → Beat 4 | Moves from position 8 to position 4. Badges → architecture. Kills 8 of 18 objections |
| 9 | `performance` | 🔀 **MERGE** → Beats 3 + 8 | The cascade *is* the performance story; splitting them weakened both |
| 10 | `how` | 🔀 **MERGE** → Beat 3 | The loop diagram is the mechanism, not a separate topic |
| 11 | Coach personalities | 🔀 **MERGE** → Beat 6 | Three voices = three refusals of the renegotiation. Ties to the enemy instead of floating free |
| 12 | `compare` | ♻️ **REBUILD** → Beat 7 | Real `<table>` semantics; add Freedom + Cold Turkey |
| 13 | **Testimonials** | ❌ **CUT** *(confirmed fabricated)* | Replaced by proof-stack items 2 and 3 |
| 14 | `roadmap` | ♻️ **REBUILD** → Beat 5 | Reframed from *promises* to *shipping record* — the past is the proof; the future is a short coda |
| 15 | `pricing` | ♻️ **REBUILD** → Beat 8 | Merged with the cost/requirements story |
| 16 | `faq` | ✅ **KEEP** → Beat 8 | The best-written thing on the site. Trimmed of duplication now handled by beats 3–5; its voice becomes the whole site's voice |
| 17 | `download` | ✅ **KEEP** → Beat 9 | |
| — | footer | ✅ KEEP | Re-systematised |
| — | — | ✨ **NEW** | **404 page** — currently absent; GitHub Pages serves its default |
| — | `linux/support/privacy.html` | ♻️ **REBUILD** | Brought into the system; fix `lockinra.app` → `.xyz`, disclose Linux v1.3.0 |

**Result: 18 sections → 9 beats + footer.** Roughly 3,470 → ~1,900 words. Four sections cut outright, six merged.

**Why fewer is correct here:** the audit's finding #4 is that twelve consecutive sections ask nothing and build nothing. Length was substituting for argument. Nine beats with one idea each, at varying volume, is a *structure* — and structure is what makes a stranger able to restate the product unprompted, which is the brief's success criterion.

---

## 4 · The signature moment

**The Guardian, live in the hero.**

The visitor sees a small, real LockinRa surface: a current task (*"Build the onboarding flow"*) and a row of three switchable sources — `docs.stripe.com`, `github.com/…`, `youtube.com`.

They click one. The classification runs in front of them:
- **`github.com`** → the *hard rule* stage lights. `Relevant`. Instant.
- **`docs.stripe.com`** → the *your corrections* stage lights — a recency-weighted kNN vote over corrections you have made before. `Relevant · on task`, reason: *"matched 3 of your past corrections."*
- **`youtube.com — "race highlights"`** → rules pass it through, no correction clears the similarity floor, the title lexicon finds no signal, **the local model wakes** — and the nudge fires with a real coach line.

Why this is the right signature moment:
- **It does the hero's hardest job**: it *proves* the intelligence rather than describing it, in about four seconds of the visitor's own agency.
- **It is honest** — it depicts the cascade the app actually implements, with the LLM genuinely last.
- **It is the whole thesis in one interaction**: perceive, understand, intervene — and the cheapness of the cascade is visible because most clicks never reach the model.
- **It is screenshot-and-post shaped.** The thing people will share is the moment the model wakes for YouTube and the coach says something dry.
- **It degrades honestly**: with reduced motion, states change instantly instead of animating. With no JS, it renders as a static three-row classified list showing all three verdicts at once — **the information survives, only the interactivity is lost.**

Full interaction spec in `05-interaction.md`; curves and choreography in `04-motion.md`.

---

## 5 · The three questions, answered for every beat

| Beat | Why does it exist? | Why here? | Strongest version not yet tried |
|---|---|---|---|
| 1 Hook | Proves intelligence in 3 s | Only position where a stranger is still deciding to stay | Let the visitor *cause* the classification, not watch it |
| 2 Recognition | Names the enemy so the product has something to defeat | Immediately after the hook, while they're leaning in | Near-empty screen; one sentence; make them supply the memory |
| 3 Mechanism | Converts "magic" into "system" — and replaces a fabricated statistic | Before the trust beat, because you can't evaluate privacy without knowing what it *does* | Draw the cascade so the LLM is visibly the last resort |
| 4 Privacy | Answers the objection all 3 personas share | **Position 4, not 8** — persona 3 leaves before 8 | Volunteer what *isn't* encrypted |
| 5 Ships | Kills abandonware risk | After belief, before breadth — "is it real" precedes "what else" | Real dates + byte sizes; disclose Linux lag |
| 6 Workspace | Shows it's not a single-trick blocker | After trust; breadth is worthless to a distrustful reader | 4 clusters with real crops, not 15 equal cards |
| 7 Compare | Places it on the new shelf | After they know what it is | **Add the competitors we currently omit** |
| 8 Cost | Removes the last barriers | Immediately before the ask | Lead with the 8GB path, not the 16GB recommendation |
| 9 Decision | The conversion | Last | One button, nothing competing |

Every section that survives neutralises at least one mapped objection. **Sections 7 (`made-for`) and 13 (testimonials) neutralise none — which is why they are cut.**

---

## 6 · Open decisions for sign-off

1. **Category name** — I recommend **"the local-first focus guardian."** It elevates the app's own internal feature name, encodes the mechanism, reframes surveillance as consent, and is unclaimed by any competitor.
2. **Enemy** — I recommend **"the renegotiation."**
3. **Cutting `made-for` (5 personas) outright.** The personas do real work — but as *copy inside other beats*, not as 190 words of their own section.
4. **Real product screenshots are required for Beats 1 and 6.** This is the one input I cannot generate honestly: capturing the running app is needed, or I frame these beats with faithful, clearly-styled UI recreations and label them as such. **This is the largest open dependency in the plan.**
