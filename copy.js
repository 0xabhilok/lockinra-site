/* Copy buttons for every terminal command on the site.
 *
 * Loaded by download.html, mac.html and linux.html. The controls are built here
 * rather than written into the pages, so with JavaScript off the commands read
 * exactly as they did before instead of sitting next to a button that does
 * nothing.
 *
 * Two shapes get enhanced:
 *   .cmd            — a block command. Gets a toolbar with a Copy button,
 *                     reusing the caption bar the page already wrote if there
 *                     is one.
 *   code.cmd-inline — a command inside a sentence. Becomes click-to-copy.
 *
 * Any <pre> that was never wrapped in .cmd is wrapped here too, so a block
 * added later is copyable whether or not somebody remembers the wrapper.
 */
(function () {
  'use strict';

  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_DONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  var RESET_MS = 1800;

  // ---- clipboard ----------------------------------------------------------

  // What lands on the clipboard is exactly what is on screen, minus the
  // trailing newline. Copying the newline too would make a pasted command run
  // itself before the reader has looked at it, which is a worse default than
  // asking them to press Enter.
  function commandOf(el) {
    return el.textContent.replace(/\s+$/, '');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  // The async clipboard is unavailable over plain http and inside some in-app
  // browsers. A hidden textarea still works there.
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
      document.body.appendChild(ta);

      var sel = document.getSelection();
      var previous = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }

      document.body.removeChild(ta);
      if (previous && sel) { sel.removeAllRanges(); sel.addRange(previous); }

      if (ok) resolve(); else reject(new Error('copy unavailable'));
    });
  }

  // Exposed so the rest of the site reuses one clipboard implementation rather
  // than growing a second one — index.html's footer uses it for the email
  // fallback. Resolves on success, rejects if even the textarea path is refused.
  window.lkCopy = copyText;

  // Last resort: leave the command selected so Ctrl/⌘+C still gets it.
  function selectNode(el) {
    try {
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) { /* nothing useful left to try */ }
  }

  // ---- feedback -----------------------------------------------------------

  // One polite live region for the page: a tick that only changes colour says
  // nothing to a screen reader, and a single region keeps repeat copies from
  // stacking up announcements.
  var live = null;
  function announce(message) {
    if (!live) {
      live = document.createElement('div');
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      live.style.cssText = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;';
      document.body.appendChild(live);
    }
    // Clearing first, then setting on a later task, is what makes an identical
    // second copy get read out at all.
    live.textContent = '';
    window.setTimeout(function () { live.textContent = message; }, 30);
  }

  // ---- block commands -----------------------------------------------------

  function enhanceBlock(box) {
    var pre = box.querySelector('pre');
    if (!pre || box.querySelector('.cmd-copy')) return;

    var bar = box.querySelector('.cmd-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'cmd-bar';
      box.insertBefore(bar, box.firstChild);
    }

    var caption = bar.querySelector('.cmd-label');
    var name = caption ? caption.textContent.trim() : '';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cmd-copy';
    btn.innerHTML = ICON_COPY + '<span>Copy</span>';
    btn.setAttribute('aria-label', name ? 'Copy command: ' + name : 'Copy command');
    bar.appendChild(btn);

    var timer;
    function restore() {
      btn.classList.remove('done');
      btn.innerHTML = ICON_COPY + '<span>Copy</span>';
    }

    btn.addEventListener('click', function () {
      copyText(commandOf(pre)).then(function () {
        btn.classList.add('done');
        btn.innerHTML = ICON_DONE + '<span>Copied</span>';
        announce(name ? 'Copied the ' + name + ' command' : 'Command copied');
        window.clearTimeout(timer);
        timer = window.setTimeout(restore, RESET_MS);
      }, function () {
        selectNode(pre);
        btn.innerHTML = ICON_COPY + '<span>Press Ctrl+C</span>';
        announce('Copying is blocked in this browser. The command is selected — press Ctrl or Command and C.');
        window.clearTimeout(timer);
        timer = window.setTimeout(restore, 4000);
      });
    });
  }

  // ---- commands inside a sentence ----------------------------------------

  function enhanceInline(el) {
    // Read the command before anything is attached. The icon is a CSS
    // pseudo-element precisely so it can never end up in this string.
    var text = commandOf(el);

    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Copy command: ' + text);
    el.title = 'Click to copy';

    var timer;
    function copy() {
      copyText(text).then(function () {
        el.classList.add('done');
        announce('Copied: ' + text);
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { el.classList.remove('done'); }, RESET_MS);
      }, function () {
        selectNode(el);
        announce('Copying is blocked in this browser. The command is selected — press Ctrl or Command and C.');
      });
    }

    el.addEventListener('click', copy);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        copy();
      }
    });
  }

  // ---- wiring -------------------------------------------------------------

  function init() {
    var pres = document.querySelectorAll('pre');
    for (var i = 0; i < pres.length; i++) {
      var pre = pres[i];
      if (pre.hasAttribute('data-no-copy') || pre.closest('.cmd')) continue;
      var box = document.createElement('div');
      box.className = 'cmd';
      pre.parentNode.insertBefore(box, pre);
      box.appendChild(pre);
    }

    var blocks = document.querySelectorAll('.cmd');
    for (var j = 0; j < blocks.length; j++) enhanceBlock(blocks[j]);

    var inline = document.querySelectorAll('code.cmd-inline');
    for (var k = 0; k < inline.length; k++) enhanceInline(inline[k]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
