// Shared-chrome drift checker.
//
// Five pages share a <head>, a header and a footer. The previous site kept
// them in sync by hand and drifted — it shipped `lockinra.app` on some pages
// and `lockinra.xyz` on others.
//
// We rejected a build step (08-architecture.md §5): the committed HTML should
// stay the served HTML, and GitHub Pages should keep working if this file is
// deleted. So the duplication is mechanical and MARKED, and drift is caught by
// a test with a diff instead of by a human noticing.
//
//   node tools/sync-chrome.mjs --check   → exit 1 + diff on drift (CI)
//   node tools/sync-chrome.mjs --write   → copy canonical blocks from index.html
//
// Per-page <title>, description, canonical and OG tags live OUTSIDE the marked
// blocks, so the checker never fights legitimate variation.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const CANONICAL = 'index.html';
const PAGES = ['404.html', 'linux.html', 'mac.html', 'privacy.html', 'support.html'];
const BLOCKS = ['head', 'header', 'footer'];

const mode = process.argv.includes('--write') ? 'write' : 'check';

/** Extract the text between a block's start and end markers. */
function extract(html, block) {
  const start = new RegExp(`<!--\\s*#chrome:${block} start[\\s\\S]*?-->`);
  const end = new RegExp(`<!--\\s*#chrome:${block} end\\s*-->`);
  const s = html.match(start);
  const e = html.match(end);
  if (!s || !e) return null;
  const from = s.index + s[0].length;
  const to = e.index;
  if (to < from) return null;
  return { body: html.slice(from, to), from, to };
}

const norm = (s) => s.replace(/\r\n/g, '\n').trimEnd();

const canonicalHtml = await readFile(join(ROOT, CANONICAL), 'utf8');
const canonical = {};
for (const b of BLOCKS) {
  const got = extract(canonicalHtml, b);
  if (!got) {
    console.error(`✗ ${CANONICAL} is missing the #chrome:${b} markers — nothing to sync from.`);
    process.exit(2);
  }
  canonical[b] = got.body;
}

let drifted = 0;
let missing = 0;

for (const page of PAGES) {
  let html;
  try {
    html = await readFile(join(ROOT, page), 'utf8');
  } catch {
    console.error(`… ${page} does not exist yet — skipped.`);
    missing += 1;
    continue;
  }

  let next = html;
  for (const b of BLOCKS) {
    const got = extract(next, b);
    if (!got) {
      console.error(`✗ ${page} is missing the #chrome:${b} markers.`);
      drifted += 1;
      continue;
    }
    if (norm(got.body) === norm(canonical[b])) continue;

    drifted += 1;
    if (mode === 'check') {
      console.error(`\n✗ ${page} — #chrome:${b} has drifted from ${CANONICAL}.`);
      const a = norm(canonical[b]).split('\n');
      const c = norm(got.body).split('\n');
      for (let i = 0; i < Math.max(a.length, c.length); i += 1) {
        if (a[i] === c[i]) continue;
        if (a[i] !== undefined) console.error(`   - ${CANONICAL}: ${a[i].trim()}`);
        if (c[i] !== undefined) console.error(`   + ${page}: ${c[i].trim()}`);
      }
    } else {
      next = next.slice(0, got.from) + canonical[b] + next.slice(got.to);
    }
  }

  if (mode === 'write' && next !== html) {
    await writeFile(join(ROOT, page), next);
    console.log(`✓ ${page} — chrome synced from ${CANONICAL}.`);
  }
}

if (mode === 'check') {
  if (drifted) {
    console.error(`\n${drifted} chrome block(s) drifted. Run: node tools/sync-chrome.mjs --write`);
    process.exit(1);
  }
  console.log(`✓ chrome is identical across ${PAGES.length - missing} page(s)${missing ? ` (${missing} not built yet)` : ''}.`);
}
