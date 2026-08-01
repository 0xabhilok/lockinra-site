// The platform-aware download CTA.
//
// Degrades by COLLAPSING alternates, never by inserting a promoted link —
// so it removes height rather than adding it and cannot cause layout shift
// (07-performance.md §4.1). If detection fails it does nothing, which lands
// on the no-JS state: all platforms listed, Windows first. There is no
// scenario in which a visitor sees zero download links.

/** Never a UA-string regex. Returns 'windows' | 'linux' | 'mac' | null. */
function detect() {
  const p = navigator.userAgentData?.platform ?? navigator.platform ?? '';
  const s = p.toLowerCase();
  if (s.includes('win')) return 'windows';
  if (s.includes('linux') || s.includes('android')) return 'linux';
  if (s.includes('mac')) return 'mac';
  return null;
}

export function promote(root) {
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = 'true';

  const platform = detect();
  if (!platform) return;                       // no guessing

  const match = root.querySelector(`[data-platform="${platform}"]`);
  if (!match) return;                          // e.g. macOS: no build exists, so show everything

  root.dataset.promoted = platform;
}
