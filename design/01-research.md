# 01 · Research — references, category, audience

**Date:** 2026-08-01
**Method:** reference study from direct knowledge of each site's construction, plus live verification of competitor pricing and positioning (sources at the foot of Part B). Personas synthesized using the `design:user-research` and `design:research-synthesis` framing.

---

## Part A · The canon — principles, not patterns

**The rule, restated so it binds:** we take the *transferable rule* and the *reason it works perceptually*. We refuse the surface element. A visitor who has seen these sites must not be able to name our source. If the outcome reads as "Linear but green," the site has told them the product is derivative — which is the opposite of the truth about LockinRa.

---

**Linear** — *the best in the world at making the marketing site itself the proof of engineering quality.*
- **Principle:** the site is a *specimen* of the product's craft standard, not an advertisement for it. Quality is transmitted by construction, not by adjectives.
- **Mechanism:** obsessive frame budget, hand-tuned easing, no jank anywhere, type and spacing on a strict scale, hardware-accelerated everything.
- **Why it works:** competence is inferred from *cues you can't fake* — a site that never stutters implies an app that never stutters. It bypasses claim-evaluation entirely.
- **For LockinRa:** our version of "site as specimen" is **not** smoothness — it is *provable restraint*. LockinRa's promise is a quiet, cheap, local, private system. So the site must be **demonstrably cheap and private**: essentially no JS, one third-party origin (disclosed), instant paint, works offline once cached, nothing to inspect in the network tab. Our proof-by-construction is the *devtools panel*, where Linear's is the *frame graph*. Same principle, different organ.
- **Explicitly NOT copying:** the dark-violet palette, the glow-gradient hero, the sidebar-app chrome aesthetic, the "keyboard-first" copy register.

**Apple** — *the best in the world at holding one idea long enough for it to land.*
- **Principle:** one idea per viewport, given enough space and time that the visitor completes the thought themselves.
- **Mechanism:** enormous negative space, a single focal object, scroll pacing that gives each claim a full screen.
- **Why it works:** comprehension is serial. Two competing ideas in a viewport means the reader resolves neither and remembers neither.
- **For LockinRa:** the current site's worst structural failure is 18 sections at one volume (audit §3.3). We adopt the *discipline*, not the aesthetic: fewer beats, each owning a full screen, each with one job. Where Apple isolates a physical object in white space, we isolate **a single moment of the software behaving** in dark space.
- **Explicitly NOT copying:** centred giant type on white, the product-photography language, the "Pro / Max" typographic swagger.

**Stripe** — *the best in the world at making an invisible system legible.*
- **Principle:** diagrammatic clarity. When the product is an invisible process, *draw the process* — make the abstract concrete and inspectable.
- **Mechanism:** precise, restrained technical illustration; annotated flows; real code and real data rather than decorative approximations.
- **Why it works:** understanding a mechanism converts far better than trusting a claim about it. Comprehension *is* the trust.
- **For LockinRa:** this is the most valuable transfer available to us. Our core mechanism — **perceive → understand → intervene → learn**, and the *staged cascade* underneath it (hard rules → your own past corrections → title keywords → LLM only when genuinely ambiguous, then a silent fallback) — is genuinely interesting and completely unillustrated today. **Amended 2026-08-01** from "three-stage … semantic match" after reading `packages/embeddings/src/cascade.ts`; see `04-motion.md` §0.1. Drawing the cascade honestly does the work that "~90% accuracy" was faking (audit §3.1).
- **Explicitly NOT copying:** the pastel-gradient ribbon, the multi-product nav, the developer-docs typographic voice.

**Nothing (Nothing Phone)** — *the best in the world at constraint as identity.*
- **Principle:** commit to exactly one visual device and execute it with total discipline. Recognisability comes from *refusal*, not from richness.
- **Mechanism:** one device (the dot-matrix / transparency motif), applied everywhere, with almost nothing else permitted.
- **Why it works:** memorability is a function of *distinctiveness × repetition*. One device repeated beats five devices used once — which is precisely the current site's problem (137 colors, 41 type sizes).
- **For LockinRa:** we need **one organising device** carried through the whole site. Candidate developed in `02-strategy.md` / `03-brand.md`: **the locked door / the quiet room** — a single, consistent treatment of *what is inside the block* vs *what is outside it*.
- **Explicitly NOT copying:** dot-matrix type, the red accent, the transparency/hardware motif.

**Raycast** — *the best in the world at showing dense software without making it look busy.*
- **Principle:** show real UI, cropped tightly to the one interaction that matters, at a size where the text is actually legible.
- **Mechanism:** tight crops of genuine product surfaces; never a full-window screenshot shrunk to fit; consistent framing, lighting and radius.
- **Why it works:** a full app window at 40% scale communicates "complicated." One legible panel communicates "I could use this."
- **For LockinRa:** directly fixes audit finding #3 — *nothing on the page is the actual product*. We show **real, tightly-cropped captures** of the intervention popup, the coach card, the cascade, the analytics ring. Never the whole window shrunk down.
- **Explicitly NOT copying:** the light-mode pastel gradients, the command-palette-as-hero composition, the extension-store grid.

**Obsidian / Tailscale / Proton** — *the best in the world at making a technical trust claim believable.*
- **Principle:** trust is earned by **falsifiability**, not by assertion. Say the specific thing a skeptic could go and check, and invite them to check it.
- **Mechanism:** name the mechanism precisely; state the limits unprompted; publish what *isn't* covered.
- **Why it works:** volunteering a limitation is the strongest available credibility signal, because a liar wouldn't. It converts the skeptic's own scrutiny into evidence for you.
- **For LockinRa:** this is our **entire wedge**, and today it is six badge-pills (audit §3.11). The rebuilt privacy section must name what is encrypted and what is not, state that the marketing site uses one cookieless analytics script, and say plainly that Linux is three versions behind. **Stating the limits is the strategy.**
- **Explicitly NOT copying:** the security-audit-badge wall, the purple/lavender trust palette, the enterprise-compliance register.

**Also studied, briefly, for specific transfers:**
| Brand | Transferable rule | Our expression |
|---|---|---|
| **Vercel** | Monospace as a *system* signal, not decoration | Mono reserved strictly for measured values and system speech — never for headings |
| **Arc** | Motion that explains a spatial model | Motion only where it shows the drift→catch causality |
| **Warp** | Dark UI that stays legible at small sizes | Fixes our 3 contrast failures at their root |
| **Cal.com / Resend** | Honest open-source-adjacent register; changelog as proof | The 8-release history becomes real social proof |
| **Craft / Read.cv** | Editorial typography and generous measure | Our one existing typographic strength — keep and systematise |
| **Perplexity / OpenAI** | Restraint around AI claims; show output, don't adjective it | Show the coach's actual sentence, never "powerful AI" |
| **Framer / Spline** | Interaction as the demo itself | The signature moment (`04-motion.md`) |

---

## Part B · Category and competitive study

### B.1 What every productivity site does identically — the clichés to refuse

Catalogued across Todoist, Things, Sunsama, Motion, Reclaim, Rize, RescueTime, Freedom, Cold Turkey, Opal, Serene, Amie, Akiflow:

1. A centred headline, a subhead, and two buttons — with a shrunken app screenshot beneath.
2. A three-column "Capture / Organise / Achieve" feature triptych with line icons.
3. Blue-to-purple gradients and soft floating glass cards.
4. "Trusted by" logo rows, frequently with logos representing individual users, not customers.
5. Vague AI language: "intelligent", "supercharge", "effortless", "seamless".
6. Aspirational stock photography, or an illustrated calm-person-at-desk.
7. Claimed productivity multipliers ("get 30% more done") with no methodology.
8. A pricing table with a highlighted middle tier.

**The current LockinRa site avoids 3, 4, 6 and 8 — and commits 1, 2, 5 and 7.** Item 7 is the audit's finding #1.

### B.2 What none of them do — the opening

- **None show the moment of failure.** Every site depicts success — a tidy list, a clean calendar. Not one depicts *the 2pm drift*, which is the actual lived experience and the actual product trigger.
- **None run the intelligence locally.** Every AI competitor is cloud-inference. This is a structural, not a feature, difference — and it cannot be copied without rebuilding the company.
- **None close the loop.** Each owns one arc: list (Todoist, Things), schedule (Motion, Reclaim, Sunsama), block (Freedom, Cold Turkey, Opal), measure (RescueTime, Rize). **Nobody perceives, understands, intervenes *and* learns.**
- **None make the privacy property inspectable.** Even the privacy-positioned ones assert rather than demonstrate.

**The opening is therefore: be the only site in the category that shows the drift, draws the loop, and proves the locality.**

### B.3 Verified competitive facts (August 2026)

| Product | Shape | Pricing (verified) | Where the AI runs |
|---|---|---|---|
| **Opal** | Phone/app blocker | **$19.99/mo or $99.99/yr** | n/a |
| **Freedom** | Cross-device blocker | **$8.99/mo, $3.33/mo annual, $199 lifetime** | n/a |
| **Cold Turkey** | Hard desktop blocker | **~$45 one-time** | n/a |
| **Rize** | AI time tracker | **$9.99/mo Standard, $23.99/mo Pro**, limited free tier | Cloud |
| **RescueTime** | Time tracker | Subscription | Cloud |
| **Todoist** | Task list | Free tier + subscription | Cloud |
| **Motion** | AI scheduler | Subscription | Cloud |

**Two strategic consequences.**

1. **The current comparison table omits Freedom and Cold Turkey** — the two most credible blockers — while including Todoist and Motion, which are not really competing for the same job. That reads as a favourable-matchup selection to anyone who knows the category. Adding Freedom and Cold Turkey is *both more honest and still favourable*, because neither has any idea what you are working on. **Fixing this strengthens the argument.**
2. **Cold Turkey is the only one-time purchase in the category.** Every other tool is a rented subscription. LockinRa's "one-time, never a subscription" future-Pro stance is therefore a genuine, verifiable differentiator — and it pairs naturally with the local-first argument: *you own the software and you own the data; nothing about this is rented.* That is a single coherent worldview, not two separate features.

### B.4 How trust-heavy products prove things — the rigour to steal

Studied: Proton, Signal, Obsidian, Tailscale, 1Password.

| Device | What it does | Our version |
|---|---|---|
| **Name the mechanism** | "end-to-end encrypted with X" beats "secure" | "Activity URLs and titles are encrypted with an OS-keychain-derived key (DPAPI/Keychain)" |
| **Volunteer the limit** | Signal documents what metadata it does hold | "Task titles are stored in plain SQLite on your disk. Here's why, and what that means." |
| **Make it checkable** | Obsidian: "your notes are local files — go look" | "Pull your network cable. The app keeps working. Open devtools on this page." |
| **Show the shape of the data** | Tailscale diagrams what crosses the wire | Diagram: what stays on disk, what is encrypted, what leaves only if you opt in |
| **Refuse the easy win** | Proton declines to claim what it can't prove | We removed two unsourced statistics rather than hedge them |

**The insight that should govern the whole rebuild:** for this audience, *admitting a limit is a conversion event.* The visitor is looking for a reason to disbelieve. Handing them the strongest available objection, unprompted, and answering it, removes their reason to keep looking.

---

## Part C · Audience

Three primary personas. Each carries an **objection ledger** — every reason they bounce — mapped to the section that must neutralise it. **A section that neutralises no objection and creates no desire has no reason to exist**; this mapping is the input to the section architecture in `02-strategy.md`.

### Persona 1 — "The builder who loses afternoons" *(primary)*
Mid-to-senior software engineer, 26–40, works from home ≥3 days/week, 40+ browser tabs.

- **Their day:** strong until ~13:30. A blocked task triggers a "quick" search; forty minutes later they are in a YouTube tab with the original ticket still open. Ships, but with a nagging sense the day was ~40% recoverable.
- **The moment they search:** the evening after a day where they closed nothing. Query: *"app that blocks distractions while coding"* or *"why do I lose focus after lunch"*.
- **Sentence that converts:** *"It knows Stack Overflow is research and Reddit isn't, because it read your ticket."*
- **Sentence that loses them:** anything with "supercharge", "10x", or "productivity hacks" — reads as content-marketing, closes the tab.

| # | Objection | Neutralised by |
|---|---|---|
| 1.1 | "Another blocker I'll disable by Tuesday." | Anti-cheat beat — extend-only blocks, reconcile watchdog |
| 1.2 | "Blockers can't tell research from rabbit-holes." | The cascade diagram — the core mechanism |
| 1.3 | "I'm not letting an app watch my screen." | Privacy beat — local, encrypted, inspectable |
| 1.4 | "AI feature = cloud = my code in someone's logs." | Privacy beat + zero-third-party site as demonstration |
| 1.5 | "Will it eat RAM/CPU/battery?" | Cost beat — cascade + on-demand model loading |
| 1.6 | "Is this abandonware?" | 8 real releases in 8 weeks, dated |
| 1.7 | "Setup will take an evening." | "First deep session in under five minutes"; no terminal |

### Persona 2 — "The student fighting phone gravity"
18–24, exam cycles, high phone dependence, low budget, often a modest laptop.

- **Their day:** intends 4 hours, achieves 90 minutes across 6 sittings. Guilt, not analysis.
- **Moment they search:** the night before a deadline. *"free app to stop procrastinating"*.
- **Converts:** *"Free while it's in beta. No card, no account."* plus the streak/Drill-Sergeant framing.
- **Loses them:** any pricing ambiguity, any signup wall, or "16GB RAM recommended" read without the 8GB fallback.

| # | Objection | Neutralised by |
|---|---|---|
| 2.1 | "I can't pay for this." | Pricing beat — genuinely free, no card |
| 2.2 | "My laptop is weak." | Cost beat — 8GB path stated first, CPU-only fine |
| 2.3 | "I'll ignore it like every other timer." | Coach voices — Drill Sergeant as the differentiator |
| 2.4 | "I don't want a permanent record of my slacking." | Privacy beat — local-only, PIN-gated surfaces |
| 2.5 | "Too complicated to set up before tomorrow." | Five-minute claim, one-click model install |

### Persona 3 — "The privacy-hardline professional"
30–50. Lawyer, clinician, journalist, security engineer, or a developer under NDA. Runs uBlock/PiHole. **Will open devtools on this page.**

- **Their day:** structurally similar to persona 1, but *any* telemetry is disqualifying, not merely annoying. Screen-watching software is presumptively hostile.
- **Moment they search:** after rejecting RescueTime/Rize on privacy grounds. *"local-only time tracker no cloud"*, *"offline focus app"*.
- **Converts:** *"Pull the cable. It keeps working."* — and a network tab that corroborates it.
- **Loses them instantly:** one unexpected third-party request, one unfalsifiable claim, one weasel word. **This persona detected the current site's contradiction between "0 bytes leave your device" and four third-party origins.**

| # | Objection | Neutralised by |
|---|---|---|
| 3.1 | "Screen-watching software is spyware by default." | Privacy beat — architecture, not promises |
| 3.2 | "'Local-first' usually means 'local cache, cloud sync'." | Offline demonstration; no account exists to sync to |
| 3.3 | "What exactly is encrypted, and what isn't?" | **Precise disclosure — including that task titles are plaintext** |
| 3.4 | "Your site is already tracking me." | One disclosed cookieless script, named in the privacy copy |
| 3.5 | "Closed source — why would I trust the binary?" | Named, honest limitation + the offline test they can run themselves |
| 3.6 | "What leaves if I enable Google Calendar?" | Integrations stated as explicitly opt-in, scoped |

### C.1 Cross-persona synthesis

- **All three share objection 1.3 / 2.4 / 3.1** — *"I don't want to be watched."* This is **the** objection. It must be answered structurally and early, not deferred to section 8 as it is today.
- **The order that works for all three:** recognise the problem → show the mechanism → *immediately* answer the surveillance objection → prove it ships → remove cost/risk → close.
- **Trust must precede capability.** The current site spends sections 5–7 (655 words) on features before addressing privacy in section 8. For persona 3 that is 655 words too late; they have already opened the network tab.

---

**Sources (verified this session):** [Rize pricing — Findstack](https://findstack.com/products/rize/pricing) · [Rize pricing — SaaSworthy](https://www.saasworthy.com/product/rize-io/pricing) · [Opal alternatives / pricing — Habit Doom](https://habitdoom.com/blog/opal-alternatives) · [Best distraction blockers — TechCrunch](https://techcrunch.com/2025/12/25/the-best-distraction-blockers-to-jumpstart-your-focus-in-the-new-year) · [Best distraction blockers for Mac — Timing](https://timingapp.com/blog/best-distraction-blocker-mac/) · GitHub Releases API for `0xabhilok/lockinra-site` (8 releases, v1.0.0 → v1.6.0).
