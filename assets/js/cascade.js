// Beat 3's scrubbed cascade — the JS half of 04-motion.md §6.2's contract:
// "CSS-native first, JS fallback second."
//
// Where `animation-timeline: view()` exists, the browser scrubs
// --cascade-progress off the main thread and THIS MODULE NEVER STARTS A
// FRAME. It exists only for engines without scroll-driven animation, and it
// writes the identical custom property, so there is one visual definition of
// the effect and no second implementation to drift out of sync.
//
// The rules it is written against, all from §6.2:
//   · Zero scroll listeners of any kind. rAF only.
//   · getBoundingClientRect() read ONCE per frame, in the read phase, before
//     any write. All reads batch, then all writes — no layout thrash.
//   · The loop runs only while the section is on screen and the tab is
//     visible. An animation nobody is watching is a battery cost, and this
//     page's Beat 8 answers "will it eat my battery".
//
// It also never has to fail safely, because it cannot fail unsafely: the
// property is registered with initial-value 1 (= fully drawn), so a module
// that never loads leaves the cascade lit rather than blank.

const NATIVE = typeof CSS !== 'undefined'
  && typeof CSS.supports === 'function'
  && CSS.supports('animation-timeline', 'view()');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Drive --cascade-progress on `list` from its scroll position.
 * Safe to call on any element; a no-op where the native timeline exists.
 */
export function scrub(list) {
  if (!list || NATIVE) return;

  const beat = list.closest('.beat') || list.parentElement;
  if (!beat) return;

  let running = false;
  let onscreen = false;
  let frame = 0;

  function tick() {
    frame = 0;

    // ── READ ──────────────────────────────────────────────────────────────
    const r = list.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 1;

    // Approximates `animation-range: entry 30% cover 55%`: the draw starts as
    // the list clears the lower fifth of the viewport and completes while the
    // whole list is still comfortably in view — never after the reader has
    // already passed it. Not a pixel-exact match to the native range, and it
    // does not need to be: no session sees both paths.
    const span = Math.max(1, r.height * 0.6 + vh * 0.25);
    const p = (vh * 0.85 - r.top) / span;

    // ── WRITE ─────────────────────────────────────────────────────────────
    list.style.setProperty('--cascade-progress', clamp01(p).toFixed(4));

    if (running) frame = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduced.matches || document.hidden) return;
    running = true;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  // reveal.js owns the page's ONE IntersectionObserver and announces the
  // boundary it already watches. Adding a second observer here to learn the
  // same fact would break §6.2's "exactly one observer instance".
  beat.addEventListener('beat:onscreen', (e) => {
    onscreen = !!(e.detail && e.detail.onscreen);
    if (onscreen) start(); else stop();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (onscreen) start();
  });

  // Toggling the OS setting mid-session takes effect live, in both
  // directions. Under reduce the stylesheet pins progress to 1 with
  // !important, which also overrides whatever inline value we last wrote.
  reduced.addEventListener('change', () => {
    if (reduced.matches) stop();
    else if (onscreen) start();
  });

  // Already on screen at load: start now rather than waiting for the
  // observer's first callback, which in a backgrounded tab may never arrive.
  const r = list.getBoundingClientRect();
  if (r.top < (window.innerHeight || 0) && r.bottom > 0) {
    onscreen = true;
    start();
  }
}

function clamp01(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
