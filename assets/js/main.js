// Entry point. Wires the modules and nothing else.
//
// Every module fails open: a throw here leaves the page in its no-JS state,
// which is fully functional. A script error must never hide content.

import { observe } from './reveal.js';
import { mount } from './guardian.js';
import { promote } from './platform.js';
import { watch } from './motion.js';
import { scrub } from './cascade.js';

function init() {
  try { watch(); } catch { /* motion policy is an enhancement */ }

  // Before observe(), so the listener is attached in this same synchronous
  // tick — the observer's first callback lands on the next frame.
  try {
    document.querySelectorAll('[data-cascade]').forEach(scrub);
  } catch { /* the cascade is drawn at full progress by default */ }

  try {
    document.querySelectorAll('.beat').forEach(observe);
  } catch { /* beats are visible by default; losing the reveal costs nothing */ }

  try {
    document.querySelectorAll('[data-guardian]').forEach(mount);
  } catch { /* the static three-verdict list remains in the DOM */ }

  try {
    document.querySelectorAll('[data-download]').forEach(promote);
  } catch { /* all platforms stay listed */ }
}

// `type="module"` is deferred, so the DOM is already parsed. The guard is for
// the case where this module is imported again — init is idempotent anyway.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
