// Motion policy. Reduced-motion is honoured in CSS at the token level
// (04-motion.md §7.1) — this module only handles what CSS cannot see:
// whether the document is visible at all.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Pause every ambient loop while the tab is hidden. An infinite animation
 * compositing in a backgrounded tab is a battery cost with no viewer — and
 * this page argues that the product does not eat your battery. The previous
 * site ran 14 infinite timelines off-screen for the life of the page.
 */
function applyVisibility() {
  document.documentElement.classList.toggle('is-hidden-tab', document.hidden);
}

/** Re-apply when the OS setting is toggled mid-session, not only on load. */
export function watch() {
  const onChange = () => document.documentElement.classList.toggle('is-reduced', reduced.matches);
  reduced.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', applyVisibility);
  onChange();
  applyVisibility();
}

export function prefersReduced() {
  return reduced.matches;
}
