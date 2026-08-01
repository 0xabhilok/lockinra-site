// The signature moment: the visitor causes a classification and watches the
// cascade resolve.
//
// Honest to packages/embeddings/src/cascade.ts — FOUR decision stages and a
// silent fallback, in that order, with the `reason` strings taken verbatim
// from the source. The LLM is genuinely last, and the fast path is visibly
// faster because that is the performance argument made without words.
//
// The site NEVER implies a model runs in this page: the coach line is static
// text, there is no typing effect and no "thinking" spinner. A typewriter
// here would manufacture the appearance of evidence (04-motion.md §5.4).

import { prefersReduced } from './motion.js';

// Two name lists: one for the deciding clause ("decided BY the local model"),
// one for the checked list ("stages checked: …"). English, not a variable.
const DECIDED_BY = ['hard rules', 'your own past corrections', 'a title keyword', 'the local model'];
const CHECKED = ['hard rules', 'your corrections', 'title keywords', 'the local model'];

// `spoken` exists because the visible verdict uses a middle dot, which a
// screen reader renders as noise. Never announce a string that was written
// for the eye.
const PATHS = {
  github: {
    label: 'github.com', decidesAt: 1, tone: 'ok',
    verdict: 'Relevant', spoken: 'relevant', reason: 'allow-list match',
  },
  stripe: {
    label: 'docs.stripe.com', decidesAt: 2, tone: 'ok',
    verdict: 'Relevant · on task', spoken: 'relevant, and on task',
    reason: 'matched 3 of your past corrections',
  },
  youtube: {
    label: 'youtube.com, playing "F1 race highlights"', decidesAt: 4, tone: 'bad',
    verdict: 'Distracting', spoken: 'distracting', reason: 'the local model decided',
    nudge: "That's the third race video. The onboarding flow is still open in tab two.",
  },
};

// Per 04-motion.md §5.3. Stage 4 is deliberately the slowest step: the cost of
// the model is the thing being shown.
const T_FIRST_CHECK = 90;
const T_CHECK = 200;
const T_GAP = 140;
const T_MODEL = 520;
const T_VERDICT = 160;

export function mount(root) {
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = 'true';

  const pills = [...root.querySelectorAll('[data-src]')];
  const rows = [...root.querySelectorAll('.cascade__row')];
  const staticList = root.querySelector('[data-static]');
  const result = root.querySelector('[data-result]');
  const verdictEl = root.querySelector('[data-verdict]');
  const nudge = root.querySelector('[data-nudge]');
  const nudgeLine = root.querySelector('[data-nudge-line]');
  const announce = root.querySelector('[data-announce]');
  if (!pills.length || !rows.length) return;

  // The static three-verdict list is the no-JS truth. Now that JS is running,
  // the interactive version replaces it.
  staticList?.remove();

  let token = 0;              // invalidates timers from a superseded run
  let timers = [];

  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const at = (ms, fn) => { const mine = token; timers.push(setTimeout(() => { if (mine === token) fn(); }, ms)); };

  function reset() {
    rows.forEach((row) => {
      if (row.dataset.stage === '5') return;          // the fallback never runs
      delete row.dataset.status;
      row.querySelector('.cascade__state').textContent = 'waiting';
    });
    result.hidden = true;
    nudge.hidden = true;
  }

  function setRow(n, status, text) {
    const row = rows[n - 1];
    if (!row) return;
    row.dataset.status = status;
    row.querySelector('.cascade__state').textContent = text;
  }

  function finish(path) {
    verdictEl.textContent = path.verdict;
    verdictEl.className = `verdict verdict--${path.tone}`;
    result.hidden = false;

    if (path.nudge) {
      nudgeLine.textContent = path.nudge;
      nudge.hidden = false;
    }

    // ONE announcement at resolution, not one per row. Eight interruptions
    // over two seconds is unusable (05-interaction.md §5.2).
    const checked = CHECKED.slice(0, path.decidesAt - 1);
    announce.textContent =
      `${path.label} — classified ${path.spoken}, decided by ${DECIDED_BY[path.decidesAt - 1]}.` +
      (checked.length ? ` Stages checked first: ${checked.join(', ')}.` : '');

    root.dataset.state = 'resolved';
  }

  function run(key) {
    token += 1;
    clear();
    reset();
    const path = PATHS[key];
    if (!path) return;

    root.dataset.state = 'running';

    // Reduced motion: the same information, instantly. The sequence survives
    // as a static trace because the sequence IS information (04-motion §5.6).
    if (prefersReduced()) {
      for (let n = 1; n < path.decidesAt; n += 1) setRow(n, 'passed', 'passed');
      setRow(path.decidesAt, 'decided', path.reason);
      finish(path);
      return;
    }

    let t = T_FIRST_CHECK;
    for (let n = 1; n <= path.decidesAt; n += 1) {
      const isLast = n === path.decidesAt;
      const dwell = isLast && n === 4 ? T_MODEL : T_CHECK;

      at(t, () => setRow(n, 'checking', n === 4 ? 'local model · working' : 'checking…'));
      t += dwell;
      at(t, () => isLast ? setRow(n, 'decided', path.reason) : setRow(n, 'passed', 'passed'));
      if (!isLast) t += T_GAP;
    }
    at(t + T_VERDICT, () => finish(path));
  }

  // One delegated listener for all three pills — not three listeners, and not
  // one per row (08-architecture.md §6.2).
  root.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-src]');
    if (!pill) return;
    pills.forEach((p) => p.setAttribute('aria-checked', String(p === pill)));
    run(pill.dataset.src);
  });

  // Roving tabindex per the WAI radiogroup pattern: the group is ONE tab stop.
  pills.forEach((p, i) => { p.tabIndex = i === 0 ? 0 : -1; });
  root.addEventListener('keydown', (e) => {
    if (!e.target.matches('[data-src]')) return;
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const i = pills.indexOf(e.target);
    const next = pills[(i + dir + pills.length) % pills.length];
    pills.forEach((p) => { p.tabIndex = p === next ? 0 : -1; });
    next.focus();
    next.click();
  });

  // Returning to the tab never shows a half-drawn cascade.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || root.dataset.state !== 'running') return;
    const key = pills.find((p) => p.getAttribute('aria-checked') === 'true')?.dataset.src;
    if (!key) return;
    token += 1;
    clear();
    const path = PATHS[key];
    for (let n = 1; n < path.decidesAt; n += 1) setRow(n, 'passed', 'passed');
    setRow(path.decidesAt, 'decided', path.reason);
    finish(path);
  });
}
