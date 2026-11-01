# lockinra-site

The public website for **LockinRa** — [lockinra.xyz](https://lockinra.xyz) — and the home of its public
releases. The app itself lives in a private repo; every downloadable build is published here under
[Releases](https://github.com/0xabhilok/lockinra-site/releases).

---

## Downloads

**362 total downloads** across every channel, as of 2026-11-01.

| Channel | Downloads | Share |
| --- | ---: | ---: |
| GitHub Releases (Windows, macOS, Linux) | 260 | 72% |
| [Microsoft Store](https://apps.microsoft.com/detail/9N6KKXPCV2JW) (Windows) | 102 | 28% |
| **Total** | **362** | |

### Over time

```mermaid
xychart-beta
    title "GitHub downloads — per release (bars) and running total (line)"
    x-axis ["Jun 19", "Jun 24", "Jun 27", "Jul 3", "Jul 11", "Jul 17", "Jul 18", "Aug 4", "Aug 14", "Aug 22"]
    y-axis "Downloads" 0 --> 270
    bar [8, 15, 25, 13, 7, 3, 7, 52, 22, 108]
    line [8, 23, 48, 61, 68, 71, 78, 130, 152, 260]
```

Read this as *downloads attributed to the release published on that date*, not downloads that happened
on that date — GitHub reports one lifetime counter per file and no timestamps, so a v1.0.0 download
could have happened yesterday. Jul 17 combines v1.5.0 and its same-day hotfix v1.5.1. The Microsoft
Store's 102 is a single lifetime figure with no date breakdown, so it can't be plotted here.

### By release

| Release | Date | Windows | macOS | Linux | Total |
| --- | --- | ---: | ---: | ---: | ---: |
| v1.9.0 — Glass Notes, lock-in that actually blocks, and capture from anywhere | 2026-08-22 | 36 | 39 | 33 | **108** |
| v1.8.0 — macOS you can actually open, and Notes that think with you | 2026-08-14 | 8 | 9 | 5 | 22 |
| v1.7.0 — first macOS build, Linux brought current | 2026-08-04 | 17 | 19 | 16 | **52** |
| v1.6.0 | 2026-07-18 | 7 | — | — | 7 |
| v1.5.1 — same-day hotfix | 2026-07-17 | 1 | — | — | 1 |
| v1.5.0 | 2026-07-17 | 2 | — | — | 2 |
| v1.4.0 | 2026-07-11 | 7 | — | — | 7 |
| v1.3.0 | 2026-07-03 | 7 | — | 6 | 13 |
| v1.2.0 | 2026-06-27 | 23 | — | 2 | **25** |
| v1.1.0 | 2026-06-24 | 12 | — | 3 | 15 |
| v1.0.0 | 2026-06-19 | 8 | — | — | 8 |

42% of all GitHub downloads belong to v1.9.0 (108 downloads), the flagship multi-platform release. Windows was the only
platform available for the first two releases and again for v1.4.0–v1.6.0, so the platform totals below
are not a like-for-like comparison — see the multi-platform releases (v1.7.0–v1.9.0) for like-for-like adoption across OSes.

### By platform

| Platform | GitHub | Store | Total | Share |
| --- | ---: | ---: | ---: | ---: |
| Windows | 128 | 102 | **230** | 64% |
| macOS | 67 | — | 67 | 19% |
| Linux | 65 | — | 65 | 18% |

On GitHub alone, macOS (67) and Linux (65) together outpace Windows (132 vs 128). Across v1.7.0–v1.9.0 — the
releases offered on all three platforms simultaneously — macOS leads with 67 downloads, followed by
Windows (61) and Linux (54).

### By installer format

| Format | Platform | Downloads | Share |
| --- | --- | ---: | ---: |
| `.exe` (NSIS) | Windows | 114 | 44% |
| `.dmg` | macOS | 56 | 22% |
| `.AppImage` | Linux | 46 | 18% |
| `.deb` | Linux | 12 | 5% |
| `.zip` | macOS | 11 | 4% |
| `.msi` | Windows | 8 | 3% |
| `.rpm` | Linux | 7 | 3% |
| `.appx` | Windows | 6 | 2% |

The `.exe` is what the site's Windows download button points to, which is a large part of why it
dominates; `.dmg` and `.AppImage` lead on macOS and Linux. The 6 `.appx` downloads are the
store package pulled straight from GitHub — separate from the 102 the Store counts itself.

### Bandwidth

**67.0 GB** (62.4 GiB) served from Releases across 44 installer assets. Individual installers run
189–363 MB, median 272 MB.

---

## Release cadence

| | |
| --- | ---: |
| Releases published | 11 |
| First → latest (v1.0.0 → v1.9.0) | 64 days |
| Average gap between releases | 6.4 days |
| Longest gap | 17 days (v1.6.0 → v1.7.0, the macOS + Linux release) |
| Shortest gap | same day (v1.5.0 → v1.5.1 hotfix) |
| Installer assets published | 44 |

## Repo traffic

Rolling 14-day window, as of 2026-11-01 — GitHub keeps no longer history, and reading it needs push
access on the repo.

| | Total | Unique |
| --- | ---: | ---: |
| Clones | 13 | 10 |
| Views | 11 | 5 |

Top referrer: `github.com` (3 views, 1 unique).

---

## Counting notes

- GitHub numbers are **installer assets only** — the five downloads of `SHA256SUMS.txt` are excluded.
  Including it, the raw asset total is 265.
- GitHub counts every fetch of a file, so re-downloads, mirrors and bots are in there too. There is no
  unique-downloader figure and no per-day breakdown.
- The **Microsoft Store** figure is read from Partner Center and has to be updated by hand — there is no
  API behind it here. It is lifetime installs, undated.
- Percentages are rounded, so columns may not total exactly 100.
- The site itself ships no analytics, so there are no visitor numbers to report.

### Refreshing these numbers

```bash
gh api repos/0xabhilok/lockinra-site/releases --paginate --jq '[.[].assets[] | select(.name != "SHA256SUMS.txt") | .download_count] | add'
```

Per release:

```bash
gh api repos/0xabhilok/lockinra-site/releases --paginate --jq '.[] | "\(.tag_name)\t\(.published_at[0:10])\t\([.assets[] | select(.name != "SHA256SUMS.txt") | .download_count] | add // 0)"'
```

Traffic:

```bash
gh api repos/0xabhilok/lockinra-site/traffic/clones --jq '{total: .count, unique: .uniques}'
```

---

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
