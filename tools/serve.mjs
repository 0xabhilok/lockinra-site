// Dev-only static server. Zero dependencies, mirrors GitHub Pages' behaviour
// closely enough to verify against (extensionless -> .html, / -> index.html,
// unknown path -> 404.html with a real 404 status).
//
// Not part of the deployed site. Run: node tools/serve.mjs [port]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const PORT = Number(process.argv[2] ?? 8899);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function resolve(pathname) {
  // Block traversal before touching the filesystem.
  const rel = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
  if (rel.includes('..')) return null;

  const candidates = rel === '' || rel.endsWith('/')
    ? [join(rel, 'index.html')]
    : [rel, `${rel}.html`, join(rel, 'index.html')];

  for (const c of candidates) {
    const full = join(ROOT, c);
    try {
      const s = await stat(full);
      if (s.isFile()) return full;
    } catch { /* try the next candidate */ }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  const file = await resolve(pathname);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    try {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      res.end(await readFile(notFound));
    } catch {
      res.writeHead(404, { 'content-type': TYPES['.txt'] });
      res.end('404');
    }
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',   // always see the edit you just made
  });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
