---
name: wtop-add-panopto-folder
description: Add one or more Panopto folders to the WTOP-10 watch page (this repo) and get their episodes live. Use whenever Tyler pastes oswego.hosted.panopto.com folder links ("here are more shows", "sport folders below", "folder for the new season"), asks to add a show, season or sport, or asks why a show's episodes aren't showing up. Covers checking folder names and titles (including empty folders), mapping titles to shows, match words for misspellings, new show entries, seasons, thumbnail checks, making sure no existing episode changed, and pushing and verifying the GitHub Action.
---

# Add Panopto folders to the WTOP-10 watch page

Read `CLAUDE.md` in this repo first; it explains the data model, seasons, title
cleanup and working rules. This skill is the checklist. Work from the repo root
(`D:\Claude Code\WTOP Website`). Edit files with the Edit tool or a script saved
to the scratchpad, never inline `node -e` with quotes (see Working rules).

## 1. Look before adding

```bash
node scripts/folder-tools.mjs probe <link-or-id> [<link-or-id> ...]
```

For each folder note: its name (works even when empty), its parent, and every
title, length and upload date. Then decide, per folder:

- **Which show?** Titles route by the show's `title` or `match` words; the
  longest phrase wins (`showFor` in `scripts/build-episodes.mjs`). Check every
  title will match, including typos ("Unoffical", "Womens Soccer", "Stick 2
  Sports", "W/"). Missing variants go in that show's `match` array; include the
  full misspelled title (e.g. "The Unoffical Sports Show") so the cleanup strips
  all of it, not just part.
- **New show?** Most shows already have hidden entries in `data.js`. If not,
  copy a similar block. Naming rules Tyler set: sports are "Oswego [Sport]",
  except hockey: "Hockey Night in Oswego" (men's) and "Hockey Night in Oswego
  (W)". Game broadcasts get `thumbAt: 1800, thumbFind: "game"`. News shows are
  Nightly News and Rise and Shine Oswego (formerly Morning News, also "RASO").
- **Season label?** From the folder name: "Fall 2026", "Season 5", a year range
  ("2026-27"), or "Classics". A sports folder with no years uses each game's
  date (Aug–Jul), so one folder can hold two seasons; that's fine.
- **Empty folder?** Add it anyway: the build names it through GetFolderInfo
  and the show page says "Season N coming soon". An empty folder and a
  non-public one look identical; say so if episodes are expected.
- **Flag, don't fix silently:** wrong years in titles (fix with `overrides`
  in `data.js`, and tell Tyler), very short or very long recordings, titles
  whose date contradicts the air day.

## 2. Add and build

Add each folder link to `panoptoFolders` in `data.js` with a `// Name` comment
(group new-semester folders under a comment). Then:

```bash
node scripts/build-episodes.mjs --report
```

Read the report for the new folders only: show, "shown as" title, season, date.
Titles should drop the show name, job numbers ("4309-1-"), dates and, for games,
"SUNY Oswego" and the sport ("vs. Cortland: SUNYAC Semifinal"). Packed date
codes ("9826", "91926") are read automatically. Any `! No show matches` line
means a missing match word. If a title is wrong, fix the rule in the build
script, not the output. HTTP 429 means Panopto rate-limited you: wait a minute
and rerun; don't loop.

## 3. Check nothing else moved

```bash
node scripts/folder-tools.mjs diff
```

Expect only new episodes: "0 changed field(s) on existing episodes, 0 gone". If
anything existing changed, find out why before going on (a new match word can
steal titles from another show; a date rule can re-date old episodes).

## 4. Check the thumbnails

```bash
node scripts/folder-tools.mjs sheet <show-id> [...] --out <scratchpad>/sheet.jpg
```

Read the image. Good: hosts on set, game action. Bad: black, a slate, the same
title graphic on several episodes, pregame desk for games. Fixes: change the
show's `thumbAt` (seconds), delete that show's files in `thumbs/`, rebuild.
Games use `thumbFind: "game"` (bright floor or field, darker stands). Red tiles
mean no frame was saved.

## 5. Look at it

Start the `wtop-watch` preview (from `D:\Claude Code\.claude\launch.json`) and
open `?show=<id>`: the season rows are right, titles read well, "Upcoming on
WTOP-10" matches the guide, and there are no console errors. For sports, check
the tab's row dropdown when a show has two seasons.

## 6. Document, commit, push, verify

- Update README.txt or CLAUDE.md only when a rule changed (new match rule,
  naming decision, new season format), not for every folder.
- Commit with a message naming the folders, ending with the Co-Authored-By
  line. Then `git fetch`, `git rebase origin/main`; on an `episodes.js` or
  `schedule.js` conflict keep the local copy (`git checkout --theirs`), rebuild,
  `git add`, `git rebase --continue`. Push.
- Watch both runs with `"C:\Program Files\GitHub CLI\gh.exe" run watch <id>
  --exit-status -R tyking77/wtop10-watch`, then confirm the new show is in the
  live `episodes.js` on https://tyking77.github.io/wtop10-watch/.

## 7. Report back

A short table of folder → show → episodes/season, what's live, and anything to
fix in Panopto (typos, bad years, odd lengths), plus shows still waiting on
episodes.
