# Handoff: automatic episodes from Panopto folders

Paste the prompt below into a new Claude Code session opened in `D:\Claude Code\WTOP Website`. Read CLAUDE.md first. It covers the project, the data model and the design rules.

---

The WTOP-10 watch page (CLAUDE.md) currently lists episodes by hand in `data.js`. Each WTOP-10 show has its own public folder in Panopto (oswego.hosted.panopto.com), and I want new uploads to show up on the page automatically so students don't have to edit code every week.

Approach, already evaluated:

- Every public Panopto folder publishes an RSS feed (the RSS icon at the top right of the folder, "Subscribe to RSS"). A browser page can't read it directly because of cross-origin rules, so a scheduled GitHub Action fetches the feeds and commits the result. GitHub Pages then redeploys.
- Don't use the Panopto REST API. It needs an API key registered by a Panopto admin.

Steps:

0. This folder is not a git repo yet. The same files are live at github.com/tyking77/wtop10-watch (GitHub Pages: https://tyking77.github.io/wtop10-watch/). Run `gh auth login` if needed, connect this folder to that repo, and make sure local and remote match before changing anything. `assets/wtop10-logo-full.png` is the full-size original and stays local; don't commit it.
1. Ask me for one show folder's RSS URL. Fetch it and report exactly what each item contains: title, pubDate, guid/link, enclosure, and whether the Panopto session ID and a thumbnail are present. Stop and show me before building anything.
2. Add a `panoptoFolder` field (feed URL or folder ID) to each show in `data.js`.
3. Write `scripts/build-episodes.mjs` (Node, no dependencies if possible). For each show with a folder, it fetches the feed and outputs `episodes.js`, which sets `window.WTOP_EPISODES = [...]` in the same shape as `data.js` episodes. It must be a script, not JSON, so the page still works from file://.
   - Session ID: taken from the feed. If the feed lacks it, derive it from the item link.
   - Thumbnail: the feed image if present. Otherwise read the `og:image` meta tag on the session's `Viewer.aspx?id=` page.
   - Title cleanup: raw Panopto titles look like `4591-1-Storm Team 10 Live 91526` and `Morning News 9/18/2026`. Strip the leading job number and the trailing date code, and don't repeat the show name in the episode title. Show me the before/after for every current item.
   - Date: pubDate, in America/New_York.
4. Load `episodes.js` in `index.html` after `data.js`. Merge generated episodes with any hand-entered ones in `data.js`. The same `panoptoId` counts once, and the hand-entered version wins.
5. Add an `overrides` object in `data.js` keyed by panoptoId, supporting `hide: true`, `title`, `thumb` and `date`, so a bad upload can be fixed without touching Panopto.
6. `.github/workflows/episodes.yml`: runs every 30 minutes, on manual dispatch, and on push to main. It commits `episodes.js` only when it changed. If a feed fails, it keeps the last good data for that show rather than wiping it.
7. Update README.txt for students. Adding a show means adding its folder link. Adding an episode means uploading to the Panopto folder, nothing else.

Keep the no-build, single-page setup described in CLAUDE.md. Test at 390 px wide and from file://.
