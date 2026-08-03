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

// ── The failsafe ──────────────────────────────────────────────────────────
// An observer can exist and still never fire: a tab that loads while
// backgrounded does not run intersection callbacks in some engines, and a
// page that was hidden at load would stay blank below the fold FOREVER.
// Verified in-browser during Phase 10 — seven beats sat at opacity 0 after a
// full-page scroll.
//
// So: if no callback has arrived shortly after load, the reveal system is
// treated as broken and switched off entirely by dropping `.js-reveal`. Every
// hiding rule is scoped to that class, so the page reverts to plain, visible
// HTML. The cost is losing the scroll choreography for that session. The
// alternative is an invisible page, and content always wins.
let fired = false;
const FAILSAFE_MS = 1200;

setTimeout(() => {
  if (!fired) document.documentElement.classList.remove('js-reveal');
}, FAILSAFE_MS);

function onIntersect(entries) {
  fired = true;
  for (const { target, isIntersecting } of entries) {
    // Continuous: gates the ambient breath's animation-play-state.
    target.classList.toggle('is-onscreen', isIntersecting);

    // Announce the boundary rather than letting other modules observe it
    // again. cascade.js needs exactly this fact to gate its rAF loop, and
    // §6.2 permits ONE observer instance on the page.
    target.dispatchEvent(new CustomEvent('beat:onscreen', {
      detail: { onscreen: isIntersecting },
    }));

    // Once, permanent. A beat does not un-reveal on scroll-up.
    if (isIntersecting && !target.classList.contains('is-revealed')) {
      promote(target);
      target.classList.add('is-revealed');
    }
  }
}

/**
 * Hint the compositor for the duration of the wake, and withdraw the hint the
 * moment it is spent.
 *
 * 04-motion.md §6.2 asks for this "on approach". It is applied here instead,
 * one class-change before the animation, which buys the same head start for
 * free: the wake is delayed by --d-wake-lag (180ms), so the promotion lands
 * well before the first animated frame. Adding a second, wider-margin
 * observer to be literal about "approach" would cost the page its
 * one-observer guarantee to save nothing measurable.
 *
 * A hint that is never withdrawn is a memory leak with good intentions, so
 * there are two ways out and both are taken.
 */
function promote(beat) {
  // Instant beats have no animation to promote for.
  if (beat.classList.contains('is-instant')) return;

  const content = beat.querySelector('.beat__content');
  if (!content) return;

  content.style.willChange = 'opacity, clip-path';
  const clear = () => { content.style.willChange = ''; };
  content.addEventListener('animationend', clear, { once: true });
  // Belt and braces: if the animation is suppressed (reduced motion pins the
  // duration to 0.01ms and animationend may be missed), drop it anyway.
  setTimeout(clear, 2000);
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
