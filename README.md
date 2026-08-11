# lockinra-site

The public website for **LockinRa** — [lockinra.xyz](https://lockinra.xyz) — and the home of its public
releases. The app itself lives in a private repo; every downloadable build is published here under
[Releases](https://github.com/0xabhilok/lockinra-site/releases).

## Downloads

**231 total downloads** across every channel, as of 2026-08-11.

| Channel | Downloads |
| --- | ---: |
| GitHub Releases (Windows, macOS, Linux) | 129 |
| [Microsoft Store](https://apps.microsoft.com/detail/9N6KKXPCV2JW) (Windows) | 102 |
| **Total** | **231** |

By platform:

| Platform | Downloads |
| --- | ---: |
| Windows (GitHub 84 + Store 102) | 186 |
| Linux | 26 |
| macOS | 19 |

By release (GitHub only — macOS and Linux arrived at different points, so the mix shifts):

| Release | Date | Downloads |
| --- | --- | ---: |
| v1.7.0 — first macOS build, Linux brought current | 2026-08-04 | 51 |
| v1.6.0 | 2026-07-18 | 7 |
| v1.5.1 | 2026-07-17 | 1 |
| v1.5.0 | 2026-07-17 | 2 |
| v1.4.0 | 2026-07-11 | 7 |
| v1.3.0 | 2026-07-03 | 13 |
| v1.2.0 | 2026-06-27 | 25 |
| v1.1.0 | 2026-06-24 | 15 |
| v1.0.0 | 2026-06-19 | 8 |

Counting notes: GitHub numbers are installer assets only (`.exe`, `.msi`, `.appx`, `.dmg`, `.zip`,
`.AppImage`, `.deb`, `.rpm`) — the four downloads of `SHA256SUMS.txt` are excluded. The Microsoft Store
figure is read from Partner Center and has to be updated by hand. GitHub counts every fetch of a file,
so re-downloads and mirrors are in there too.

To refresh the GitHub side:

```bash
gh api repos/0xabhilok/lockinra-site/releases --paginate --jq '[.[].assets[] | select(.name != "SHA256SUMS.txt") | .download_count] | add'
```

## The site

Static HTML, no build step — GitHub Pages serves this directory as-is at the domain in `CNAME`.

| File | Page |
| --- | --- |
| `index.html` | Landing page |
| `download.html` | Downloads hub — all three platforms |
| `mac.html` / `linux.html` | Platform-specific install guides |
| `support.html`, `support.js` | Support page |
| `privacy.html` | Privacy policy |
| `sitemap.xml`, `robots.txt`, `site.webmanifest` | Site metadata |
