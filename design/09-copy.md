# 09 · Copy — every word on the site, with reasoning

**Date:** 2026-08-01 · **Status:** written
**Voice:** Measured · Protective · Dry (`02-strategy.md` §1.5)
**Method:** `design:ux-copy` skill. Every factual claim carries a source column; anything that could not be sourced was cut rather than hedged.

---

## 0 · The rules this deck is held to

**Banned outright** (brief §10): *seamless, effortless, revolutionize, supercharge, game-changing, unleash, empower, reimagine.* Extended from the audit and the persona research: *10x, productivity hacks, unlock your potential, mission, journey, delightful, magical, simply, just, easy, powerful, robust, cutting-edge, next-generation, AI-powered.*

**Four tests every line must pass:**

1. **Could only be about LockinRa.** If a competitor could paste the line onto their site unchanged, it is deleted. Applied literally — §7 records the lines that failed it.
2. **Verbs over nouns.** *"It reads your ticket"* beats *"intelligent task awareness."*
3. **Numbers over adjectives.** *"8 releases in 8 weeks"* beats *"actively maintained."* Every number carries a source.
4. **Read it aloud.** If it sounds like a press release, it is rewritten.

**One rule specific to this product:** every claim about what the software does was checked against the source at `D:\coding\start\LockinRa`. Where the check changed the copy, the change is noted. This happened five times; one changed a headline (§0.1) and one caught a number the audit itself had wrong (§0.2).

### 0.2 The model count was 21 in the audit. It is 24.

Re-counted at this phase rather than inherited: `MODEL_REGISTRY` (`packages/ai/src/models.ts:43–310`) holds **24** entries, all language models, with no `hidden`/`beta` field that would exclude any of them. `00-audit.md` §3's "21" was a miscount and is corrected there.

The lesson is worth recording because it will recur: **a number verified once is not verified forever, and a number inherited from your own earlier document is an unverified number.** Every figure in this deck was counted at the time it was written, not copied from `00-audit.md`.

### 0.1 The claim that did not survive its own check

The strategy doc's persona-1 conversion sentence was:

> ❌ *"It knows Stack Overflow is research and Reddit isn't, because it read your ticket."*

It is a good sentence and it is **not accurate**. Stage 1 is a domain allow/block list — it does not "know" anything about your ticket. The stage that uses your task text is stage 2, and it matches against *your own past corrections*, not against the ticket directly (`04-motion.md` §0.1). The honest version is narrower and, for persona 1, better, because it describes a mechanism rather than a claim:

> ✅ **"It read your task, then your tab, then decided — and it only wakes the model when the first three stages can't."**

---

## 1 · Global chrome

| Element | Copy | Reasoning |
|---|---|---|
| Skip link | `Skip to content` | Convention. Never cute — this string is read by people who need it to work |
| Wordmark (alt/aria) | `LockinRa — home` | Names the destination, not the image |
| Nav CTA | `Download` | One word. It is secondary until Beat 9 (`05-interaction.md` §3.2) and secondary copy does not argue |
| Footer tagline | `The local-first focus guardian.` | The category, stated once, at the bottom, where a visitor who scrolled everything gets the summary they can repeat |
| Footer nav | `Privacy` · `Support` · `Linux` · `Releases` · `Microsoft Store` | Destinations named. No "click here", no "learn more" |
| Footer legal | `© 2026 LockinRa. Free while in beta.` | The one commercial fact, where people look for it |
| Footer disclosure | `This page loads one cookieless analytics script from Cloudflare. Nothing else. Open devtools and check.` | The site's own thesis, applied to the site. Persona 3 *will* check; saying it first converts an audit into a confirmation |

---

## 2 · Beat 1 — HOOK

| Element | Copy |
|---|---|
| Overline (mono) | `LOCKINRA · THE LOCAL-FIRST FOCUS GUARDIAN` |
| **H1** | **One of these is the work. It can tell which.** |
| Lede | You said you'd build the onboarding flow. Then you opened a tab. Pick one and watch it decide — the same four stages that run on your machine, in the same order. |
| Task label | `Current task` |
| Task value | `Build the onboarding flow` |
| Switch label | `You open…` |
| Options | `github.com/…` · `docs.stripe.com` · `youtube.com` |
| Stage rows | `Hard rules` · `Your corrections` · `Title keywords` · `Local model` · `No match` |
| Row states | `waiting` · `checking` · `passed` · `decided` · (row 5 at rest) `silent — you see nothing` |
| Verdicts | `Relevant` · `Relevant · on task` · `Distracting` |
| Reasons (verbatim from source) | `allow-list match` · `matched 3 of your past corrections` · `title keyword signal` |
| Nudge, `supportive` voice | **"That's the third race video. The onboarding flow is still open in tab two."** |
| Nudge label (mono) | `coach · supportive — two other voices ship` |
| Honesty note (mono) | `Illustrative. The model runs on your machine, not on this page.` |
| Replay | `Run it again` |
| Cold-start note | `Stage 2 is empty until you've corrected it a few times. Until then it goes rules → keywords → model.` |

**Reasoning.**

- **H1.** Six words, then four. It is a claim *and* an instruction — "one of these" points at the three buttons directly below it, so the headline and the interaction are the same sentence. It could not appear on a blocker's site (a blocker has no idea what the work is) or a tracker's (a tracker reports afterwards). It contains no adjective.
- **"It can tell which"** rather than "it knows which": *tell* implies discrimination between similar things, which is the actual capability. *Know* implies omniscience, which is the claim we deleted.
- **The nudge line** is dry, specific, and countable ("the third"), and it references the real task rather than scolding in general. It follows the app's own supportive-voice constraints: 1–2 sentences, no emoji, gentle but honest, no guilt-tripping (`packages/ai/src/prompts.ts:134`). It does not say "you're procrastinating" — it states two facts and lets the reader draw the conclusion, which is the Dry half of the voice.
- **`silent — you see nothing`** is the most under-rated string on the page. It says the software shuts up when it doesn't know, which is the single behaviour that separates a guardian from a nag, and it is sourced to `cascade.ts`'s `FALLBACK` being explicitly silent.

**Alternatives considered for the H1:**

| | Copy | Why not |
|---|---|---|
| A | *"It knows the difference between research and a rabbit hole."* | Strong, but "research vs rabbit hole" is persona-1 jargon and the metaphor is a category cliché — a blocker could write it |
| B | *"Your blocker doesn't know what you're working on. This does."* | Names a competitor category in the first sentence, which makes the page about them. Beat 7 is where comparison belongs |
| C | *"It read your task. Then it read your tab."* | Excellent rhythm; loses to the winner because it does not invite the click, and Beat 1's job is to be *caused* by the visitor |

---

## 3 · Beat 2 — RECOGNITION

| Element | Copy |
|---|---|
| **H2** (word-reveal) | **At 9am you decided. At 2pm you renegotiate.** |
| Body | Focus isn't a willpower problem. It's a negotiation you lose to yourself, quietly, in the fifteen seconds before you open the tab. Nothing that runs on willpower survives that conversation — which is why a blocker you can switch off gets switched off. |

**Reasoning.** The whole beat is two sentences on a near-empty screen (`05-interaction.md` §3.1 — this is the only beat with no loudest element because it has one element). The H2 is the site's single split-text reveal (`04-motion.md` §4 row 5): the word-by-word pacing enacts the negotiation. Present tense on *renegotiate* against past tense on *decided* does the work of a paragraph — the decision is over, the argument is now.

*"in the fifteen seconds before you open the tab"* is the line that makes a reader recognise themselves. It is specific about a moment nobody else describes. It is also the beat's only unsourced number — and it is a **description of an experience, not a measurement**, which is a distinction the page can afford to make once. It is phrased so it cannot be read as a statistic.

---

## 4 · Beat 3 — THE MECHANISM

| Element | Copy |
|---|---|
| Overline | `HOW IT DECIDES` |
| **H2** | **Four stages. The expensive one runs last.** |
| Lede | Every classification starts cheap and stops as soon as it's sure. Most never reach the model at all. |
| Stage 1 | **Hard rules** — a domain and app list. Instant, deterministic, no model involved. |
| Stage 2 | **Your corrections** — the times you've said "no, that was work." Nearest-match vote, weighted toward recent ones, and it only counts if the matches agree. |
| Stage 3 | **Title keywords** — a cheap read of the page or window title. |
| Stage 4 | **The local model** — reached only when the first three can't resolve it. This is the one that costs you power, and it's the one that runs least. |
| Fallback | **No match** — it stays quiet. An app that guesses out loud is worse than one that says nothing. |
| Loop caption | `perceive → understand → intervene → learn` |
| Source note (mono) | `packages/embeddings/src/cascade.ts` |

**Reasoning.** The H2 is the replacement for the deleted "~90% accuracy," and it is a *better* claim because it is checkable, structural, and impossible for a cloud competitor to copy without moving inference onto the device. It leads with a number that is real.

Stage 2's copy is the hardest string in the deck. The mechanism is a recency-weighted kNN vote with a 0.75 similarity floor and a 60% agreement threshold — accurate, unreadable. *"the times you've said 'no, that was work'"* is what that mechanism **is** from the user's side, and the two qualifiers that follow ("weighted toward recent," "only counts if the matches agree") preserve the two properties that matter without the arithmetic. The precise version lives one click away in the source note.

Stage 4's second sentence — *"this is the one that costs you power, and it's the one that runs least"* — is where this beat absorbs the deleted performance section. It answers objection 1.5 without a benchmark, which is fortunate, because we do not have one.

---

## 5 · Beat 4 — PRIVACY

| Element | Copy |
|---|---|
| Overline | `WHAT LEAVES` |
| **H2** | **Nothing leaves. Not by policy — by architecture.** |
| Lede | There is no account, no sync, and no server to send anything to. You can prove it in about four seconds: pull your network cable and keep working. |
| Diagram: stays | `Tasks, notes, habits, activity, embeddings — a SQLite file on your disk` |
| Diagram: encrypted | `Activity URLs and window titles · semantic memory · integration tokens · vaulted notes — encrypted with an OS-keychain key (DPAPI on Windows)` |
| Diagram: leaves | `Only what you explicitly connect: Google, Outlook, GitHub, Slack. Off by default.` |
| **The disclosure** | **What isn't encrypted: your task titles and task notes.** They're stored as plain text in that SQLite file. Anyone with your unlocked machine and a SQLite viewer can read them — the same as your notes app, your calendar, and most of your disk. We could have said "encrypted at rest" and let you assume it covered everything. This page said that until August 2026. It was wrong, and it's fixed. |
| This-page note | This page loads one script: cookieless analytics from Cloudflare. Four origins became one. Open devtools — that's the whole list. |

**Reasoning.** This beat moved from position 8 to position 4 because all three personas share this objection and persona 3 leaves before section 8 (`02-strategy.md` §2).

**The disclosure is the most important paragraph on the site.** Its structure is deliberate: state the limit → say exactly who could exploit it → normalise it against things the reader already accepts → **admit the site itself was wrong.** The last move is the one that converts. A vendor who corrects their own marketing in their own marketing is making a claim about their character that cannot be faked, and it costs nothing because the underlying product is unchanged. Per `01-research.md` §B.4: *for this audience, admitting a limit is a conversion event.*

*"Not by policy — by architecture"* is the beat's thesis in four words: policies are promises and architecture is a constraint, and the difference is the entire product.

**Sources:** `packages/db/migrations/0001_tasks_projects_tags.sql:39–53` (plaintext `title`/`notes`); `safeStorage` coverage per the audit's §3 verification.

---

## 6 · Beats 5–9

### Beat 5 — IT SHIPS

| Element | Copy |
|---|---|
| Overline | `THE RECORD` |
| **H2** | **Eight releases in eight weeks.** |
| Lede | The roadmap is the part anyone can promise. This is the part they can check. |
| Ladder | `v1.6.0 · 18 Jul 2026` … `v1.0.0 · 19 Jun 2026` — each with what shipped, in four words |
| Store | `Published on the Microsoft Store — product 9N6KKXPCV2JW. You can verify that without installing anything.` |
| Linux disclosure | `Linux is behind. The newest AppImage is v1.3.0, from July. It works; it's three versions old, and we'd rather say so than point you at a download that doesn't exist.` |
| Coda | `What's next is on the roadmap. What shipped is above it.` |

*Reasoning:* the section was "promises" and is now "record" — the past tense is the proof. The Linux disclosure is the second-strongest trust move on the site for the same reason as §5: nobody volunteers a stale build.

### Beat 6 — THE ROOM IT GUARDS

| Element | Copy |
|---|---|
| Overline | `AROUND THE GUARDIAN` |
| **H2** | **It guards a workspace, not a timer.** |
| Cluster 1 | **Do the work** — tasks, projects, an outliner with backlinks, block references |
| Cluster 2 | **Capture it** — voice to text, quick capture, notes that feed the model's memory |
| Cluster 3 | **See it honestly** — screen time by app and site, habits, streaks, a daily recap |
| Cluster 4 | **Be argued with** — three coach voices: supportive, dark humour, drill sergeant. Three ways of refusing the same 2pm deal |
| Models note | `24 models in the catalog, or bring your own. Nothing is downloaded until you choose one.` |

*Reasoning:* four clusters, no loudest — flatness is the answer to breadth (`05-interaction.md` §3.1). Cluster 4's second sentence ties the coach voices back to the enemy so they read as a mechanism rather than a personality gimmick.

### Beat 7 — WHY NOT THE OTHERS

| Element | Copy |
|---|---|
| Overline | `THE SHELF` |
| **H2** | **They each own one arc. This owns the loop, locally.** |
| Method note (mono) | `Pricing verified August 2026 from each vendor's own page.` |
| Row labels | `Knows your current task` · `Intervenes in the moment` · `Runs without an account` · `AI runs on your machine` · `One-time purchase` |
| Honest row | `Cold Turkey is the only other one-time purchase in the category.` |

*Reasoning:* the table now includes Freedom and Cold Turkey, which the current site omits — *"adding them is both more honest and still favourable"* (`01-research.md` §B.3). Naming Cold Turkey's genuine advantage in its own row is what makes the other rows credible.

### Beat 8 — COST AND RISK

| Element | Copy |
|---|---|
| Overline | `WHAT IT COSTS` |
| **H2** | **Free while it's in beta. No account, no card.** |
| Requirements | `Runs on 8GB. 16GB is more comfortable. No GPU required — the small models are CPU-only and that is a supported path, not a fallback.` |
| Size | `~254 MB installed on Windows.` |
| Time | `Five minutes to your first session. No terminal.` |
| Later | `If it's ever paid, it's one-time. Not a subscription.` |
| FAQ heading | `The questions you're about to ask` |

*Reasoning:* the 8GB path leads, because persona 2 reads "16GB recommended" as "not for me" and closes the tab (`01-research.md` §C). "That is a supported path, not a fallback" removes the implication that CPU-only users are second-class.

### Beat 9 — DECISION

| Element | Copy |
|---|---|
| **H2** | **Set one task. See if it can tell.** |
| Primary CTA | `Download for Windows — 254 MB` |
| Secondary | `Linux (v1.3.0)` · `Microsoft Store` |
| Reassurance | `No account. No card. Uninstall is a normal uninstall.` |

*Reasoning:* the H2 is a callback to Beat 1's H1 — the page closes the loop it opened, and the ask is framed as a *test the reader can run*, which is the same move as "pull the cable." The CTA states the byte size so the click has no surprise behind it. *"Uninstall is a normal uninstall"* answers an objection nobody says out loud about software that watches your screen.

---

## 7 · The lines that failed the tests

Recorded because the discipline is only real if it has casualties.

| Rejected | Failed | Replacement |
|---|---|---|
| *"Focus, finally."* | Test 1 — any focus app could write it | Beat 2's H2 |
| *"Privacy-first by design."* | Test 1 and 3 — a badge, not a claim | *"Nothing leaves. Not by policy — by architecture."* |
| *"Powerful local AI, right on your device."* | Banned vocabulary; test 2 (noun pile) | *"Four stages. The expensive one runs last."* |
| *"Get started in minutes."* | Test 3 — "minutes" is an adjective wearing a number | *"Five minutes to your first session. No terminal."* |
| *"It knows Stack Overflow is research and Reddit isn't."* | **Not true of stage 1** (§0.1) | *"It read your task, then your tab, then decided."* |
| *"Trusted by developers who value their privacy."* | Truth — no such evidence exists | Deleted; Beat 5's release record does this job honestly |

---

## 8 · Accessibility strings

These are read aloud to people who cannot see the design, so they get the same care as the headlines.

| Context | String |
|---|---|
| Cascade resolution (`aria-live`, fires **once**) | `youtube.com — classified distracting by the local model. Stages checked: hard rules, your corrections, title keywords.` |
| Beat 2 split-text `sr-only` twin | `At 9am you decided. At 2pm you renegotiate.` |
| Source radiogroup label | `Choose what you open next` |
| Comparison table region label | `Comparison of LockinRa with seven alternatives — scrollable` |
| Threshold divider | *(decorative — `aria-hidden="true"`, no string)* |
| Outbound link glyph | *(decorative — destination is in the link text)* |
| OG image alt | `LockinRa — the local-first focus guardian` |
| 404 heading | `That page isn't here.` |
| 404 body | `It may have moved, or it may never have existed. The download is on the home page.` |
| 404 CTA | `Back to the home page` |

**One rule:** no `aria-label` on this site contradicts or replaces visible text. Where a control has a visible label, the accessible name **is** that label.

---

## 9 · Meta, SEO, and structured data

| Field | Copy |
|---|---|
| `<title>` (home) | `LockinRa — the local-first focus guardian` |
| Meta description | `It reads what you're working on, compares it to what you're actually doing, and argues with you about the difference. The AI runs on your machine. Free while in beta.` |
| OG title | `One of these is the work. It can tell which.` |
| OG description | `A focus guardian that runs entirely on your machine. Four decision stages; the model runs last.` |
| `linux.html` title | `LockinRa for Linux (v1.3.0 · beta)` |
| `privacy.html` title | `Privacy — what stays on your disk` |
| `support.html` title | `Support — LockinRa` |
| 404 title | `Not found — LockinRa` |

**🚨 JSON-LD blocker.** The current `FAQPage` schema repeats the false encryption claim in machine-readable form, where it can be indexed and surfaced as an answer. **Every JSON-LD block is rewritten from this deck**, and the FAQ entry becomes:

> **Q:** Is my data encrypted?
> **A:** Activity URLs, window titles, semantic memory, integration tokens and vaulted notes are encrypted with an OS-keychain-derived key. Task titles and task notes are not — they are stored as plain text in a local SQLite file on your own disk. Nothing is uploaded.

A structured-data answer is the one place a false claim keeps circulating after the page is fixed. It is fixed here first.

---

## 10 · Localisation notes

The site ships in English only. Recorded for anyone who later translates it:

- **"The renegotiation"** is the brand's central metaphor and is not idiomatic in most languages. It needs a *concept* translation (the deal you make with yourself), not a word one. Do not translate literally.
- **"Lock in"** is a pun on the product name and will not survive. Prefer the mechanism over the pun.
- German and Finnish expand ~30%; the H1 and the CTA are the two strings with no slack. Both are measure-capped rather than width-capped, so expansion wraps rather than overflows.
- **Never translate the mono strings** — file paths, `9N6KKXPCV2JW`, version numbers, and the verbatim `reason` strings are identifiers, not prose.
- Dates render as `18 Jul 2026` (unambiguous in every locale); never `07/18/2026`.
