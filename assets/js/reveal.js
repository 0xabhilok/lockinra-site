// The ONE IntersectionObserver on the page. Elements register into it; there
// is never one observer per element.
//
// Two jobs, deliberately on the same observer because they watch the same
// boundary: mark a beat revealed (once, permanent) and track whether it is
// on screen (continuous, so the ambient loop can pause — 04-motion.md §3.2).
//
// ── Why this module, and not the <head> script, owns the hiding class ──────
// Motion must never gate content (04-motion.md §7.3). The first build scoped
// the hiding rule to `.js`, which the head script sets unconditionally — so a
// module that failed to load, or an observer that never fired, left the page
// permanently invisible. That is failing CLOSED.
//
// The rule now: THE CODE THAT HIDES IS THE CODE THAT REVEALS. `.js-reveal` is
// set below, at module scope, so it only exists if this file actually ran.
// And anything already on screen at registration is revealed synchronously,
// so the observer is never on the critical path for above-the-fold content.

const observed = new WeakSet();

const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(onIntersect, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 })
  : null;

// Only now may the stylesheet hide anything.
document.documentElement.classList.add('js-reveal');

function onIntersect(entries) {
  for (const { target, isIntersecting } of entries) {
    // Continuous: gates the ambient breath's animation-play-state.
    target.classList.toggle('is-onscreen', isIntersecting);

    // Once, permanent. A beat does not un-reveal on scroll-up.
    if (isIntersecting) target.classList.add('is-revealed');
  }
}

/** True when any part of the element is already within the viewport. */
function inViewport(el) {
  const r = el.getBoundingClientRect();
  return r.top < (window.innerHeight || 0) && r.bottom > 0;
}

/**
 * Register an element. Safe to call twice on the same node.
 */
export function observe(el) {
  if (!el || observed.has(el)) return;
  observed.add(el);

  // No observer support: reveal now. Content always wins over choreography.
  if (!io) {
    el.classList.add('is-revealed', 'is-onscreen', 'is-instant');
    return;
  }

  // Above the fold at load: reveal WITHOUT the wake animation. Animating the
  // hero in would delay LCP by the animation's delay + duration for no gain —
  // the first screen should be present, not arrive.
  if (inViewport(el)) el.classList.add('is-revealed', 'is-onscreen', 'is-instant');

  io.observe(el);
}

export function disconnect() {
  io?.disconnect();
}
