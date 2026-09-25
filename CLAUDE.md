# WTOP-10 Watch Page

A streaming-style video page for WTOP-10, SUNY Oswego's student TV station, built to look like ICTV's site (ictv.org) and Netflix: a rotating hero at the top, then horizontal rows of episode cards. Playback comes from Panopto embeds. The video itself is hosted by Panopto (the university account has unlimited storage), so this project hosts nothing but the page.

Owner: Tyler King, WTOP-10 faculty advisor. Students will maintain the content, so anything they touch has to stay simple.

## Where it runs

- Demo: GitHub Pages at https://tyking77.github.io/wtop10-watch/ (public repo github.com/tyking77/wtop10-watch)
- Final home: `public_html/watch/` on wtop10.com, a WordPress site on Bluehost. WordPress ignores real folders, so the page sits beside it with no plugin or theme involved. The main menu gets a "Watch" link pointing to `/watch/`.

## Files

- `index.html`: the page. All CSS and JS is inline. No build step, no framework, no npm.
- `data.js`: all hand-edited content (`window.WTOP = {...}`): Panopto host, folder list, live switch, shows, hand-entered episodes, overrides. Students edit this file and nothing else.
- `episodes.js`: generated (`window.WTOP_EPISODES = [...]`). Never edit by hand.
- `scripts/build-episodes.mjs`: builds `episodes.js` from Panopto. Node 18+, no dependencies. `--report` prints raw and clean titles.
- `.github/workflows/episodes.yml`: runs the build every 30 min, on manual dispatch and on push to main; commits `episodes.js` only when it changed.
- `thumbs/`: generated episode frames, `<panoptoId>.jpg`, 960x540. Committed by the Action; each is grabbed once.
- `assets/wtop10-logo.png`: official logo, web-sized (400x115). The 800x229 original is `assets/wtop10-logo-full.png` (local only).
- `stills/`: 1920x1080 hero stills. `trailers/`: hero MP4s.
- `guide.html`: the program guide (split out of `../Program Guide/wtop10-schedule.html`). Shown in the Live tab and, via `wordpress-guide-embed.html`, on the wtop10.com homepage. Reports its height to the parent with postMessage (`wtopScheduleHeight`, `wtopScrollTo`). Its old admin tools (CSV import, category dropdowns, WordPress snippet export) are hidden and unused.
- `guide-core.js`: the guide's settings, CATEGORY_RULES, CANONICAL_TITLES and Cablecast CSV parser, with no DOM access. Loaded by guide.html, index.html and scripts/build-schedule.mjs (as a CommonJS module). Edit rules here, once.
- `schedule/`: Cablecast X-List CSVs, uploaded through GitHub's web uploader. `scripts/build-schedule.mjs` merges them into `schedule.js` (`window.WTOP_SCHEDULE_CSV`): per day, the most recently committed file wins (the Action checks out full history for this); days before yesterday are dropped. "Off Air" rows have no end time and are skipped by design. Cablecast's API isn't reachable until the new Live service (early 2027); then the build should read it instead of CSVs.
- `wordpress-guide-embed.html`: the tiny Custom HTML block for wtop10.com that iframes guide.html. Not used by the page.
- `README.txt`: plain-language instructions for students. Keep it in sync with any change to how content is added.

Hard rule: the page must keep working when `index.html` is double-clicked from disk (file://). That is why content loads through a `<script src="data.js">` tag rather than `fetch()` of JSON. Any generated content file has to follow the same pattern (e.g. `episodes.js` setting a global).

## Data model (data.js)

- `panoptoFolders[]`: public Panopto folder links. Each folder is a season on the page; the season name comes from the folder name ("NEWS Fall 2026" gives "Fall 2026", "Laker Showdown: Season 4" gives "Season 4"). News folders are per semester and hold several shows; entertainment and sports folders are per show per season.
- Categories (menu tabs): News, Sports, Entertainment. Hockey Night in Oswego (HNIO) is the brand for Laker sports broadcasts, not a hockey-only show; its match is `HNIO`, not `Hockey`, so Hockey Talk keeps its own episodes. Tabs appear in show order and only when a show in them has episodes. Weather was folded into News.
- `hero[]`: home-page hero rotation, in order. Each entry is a show id or `{ show, from, until }` (YYYY-MM-DD, inclusive, viewer's local date). Shows without episodes are skipped. Category and show views ignore it and use every matching show. Replaced the old per-show `featured` flag. A Google-login admin page to edit it (plus the live switch and overrides) is planned for the Bluehost move, where PHP can verify sign-ins; GitHub Pages can't.
- `shows[]`: all 22 WTOP-10 shows, listed ahead of their folders; a show is hidden until it has episodes. `id`, `title`, `category` (drives the top menu), `tagline`, `still`, `trailer`, `match` (extra title phrases; the show's own title always counts; longest match wins), `thumbAt` (seconds into each episode for its auto thumbnail, default 45), `useStill` (always use `still` instead of episode thumbnails).
- `episodes[]`: `show` (a show id), `date` (YYYY-MM-DD, sorted newest first), `title` (optional; the date is used if empty), `panoptoId`, `thumb`. Generated episodes also carry `duration` (seconds), `season`, `folder`, and when relevant `episode` (number parsed from "S5 Ep.1", "Episode 3") and `undated: true` (no air date in the title, so `date` is only the upload date and is never shown). Numbered episodes display as "Episode N", run 1, 2, 3 within a season (specials after), and "Play latest" picks the highest number. Numbered seasons sort by number. In "Latest" rows an undated episode sorts by its season's newest upload date, then episode number descending. Hand-entered episodes get a season from their date (Jan–May Spring, Jun–Jul Summer, Aug–Dec Fall).
- `overrides`: keyed by panoptoId; `hide`, `title`, `thumb`, `date`.
- `live`: `{ youtube, channel, gamesUrl }`. `youtube` is the 24/7 stream's video ID; the channel-live embed is only a fallback because game streams run on the same channel at the same time. WTOP-10 doesn't use Panopto webcasts, so the old Panopto live switch is gone.

Merge order in the page: `episodes.js`, then hand-entered `data.js` episodes (non-empty fields win), then overrides.

Image fallback order: hero uses `show.still`, then the newest episode that has a `thumb`, then a navy gradient card. Episode cards use `ep.thumb` (skipped when the show has `useStill`), then `show.still`, then a branded placeholder (logo, big air date, show name, red swoosh). Broken images remove themselves so the fallback shows. `ep.thumb` priority: override or hand-entered thumb, then the build's own frame in `thumbs/`, then Panopto's first-frame thumbnail (dropped when it is black).

Auto thumbnails: the build gets each episode's MP4 from `/Panopto/Pages/Viewer/DeliveryInfo.aspx` (public for public sessions, `Delivery.PodcastStreams[0].StreamUrl`), and ffmpeg grabs a frame at `thumbAt`, then +30 s, then 15/30/45/60% of the runtime. A frame passes when ffmpeg `signalstats` gives YLOW >= 3 and YAVG >= 50 (black frames measure 1/1, slates 1/33, a black frame with only a lower third 1/20, a dim studio couch shot 5/85). If none pass, the brightest is kept only if YAVG >= 25; otherwise no file is written and the next run retries. Some recordings are black for the first 5+ minutes (Sept 24, 2026). Without ffmpeg the build falls back to Panopto thumbnails.

## Panopto source

Panopto retired folder RSS (the podcast URL returns 403). The build POSTs to `/Panopto/Services/Data.svc/GetSessions` with a `folderID`, the same undocumented JSON the folder page uses. It works without a login for public folders; listing a folder's subfolders does not, so every semester folder must be listed. Use `DeliveryID` as the panoptoId (it is what Embed.aspx takes), not `SessionID`. `StartTime` is the upload time, so the air date is parsed from the title. `ThumbUrl` redirects to a CloudFront JPG; a pure-black first frame is about 2 KB, so the build drops thumbs under 4 KB. If a folder fails, its episodes from the previous `episodes.js` are kept. When every folder loads, frames in `thumbs/` that no episode uses are deleted. A video being renamed or reprocessed can vanish from the folder listing for a few minutes (seen with Sept 24, 2026); it comes back on the next run with the same ID. Panopto's own frame grabber ignores timestamp parameters, which is why the build uses ffmpeg on the MP4.

## Live tab

Nav order: Home, Live (pulsing red dot), then categories. `?live` or `#live` opens it, and entering it writes `?live` to the address bar. It hides the hero and shows the YouTube player, an "On now / Up next" strip (with a link to a show's past episodes when a watch-page show title matches the listing), a game banner, then guide.html in an auto-height iframe. The home page gets a "Live" row above Latest episodes with one card (YouTube's `hqdefault_live.jpg` of the stream, on-now and next) that opens the Live tab. The game banner shows only while a Live Sports listing is airing for the first time on its own date (later airings that day are replays) and links to `live.gamesUrl`. On-now text refreshes every 30 s.

## Behavior to preserve

- Hero trailers: muted, `playsinline`, `preload="none"`. Only the active slide's trailer loads. A slide with a trailer advances when the clip ends, and a still-only slide advances after 9 s. If a trailer is missing, blocked (iPhone Low Power Mode) or errors, the still stays up. `prefers-reduced-motion` disables trailers and the still's slow zoom.
- Trailers must be H.264 MP4 for Safari/iOS. Panopto embeds are never used in the hero.
- Player: `<dialog>` with an iframe to `/Panopto/Pages/Embed.aspx?id=...&autoplay=true&offerviewer=false&showtitle=false&showbrand=false&captions=false&interactivity=none`. Closing it resets the iframe to about:blank.
- `?v=<panoptoId>` in the URL opens that episode, and opening an episode writes it to the address bar.
- Rows: "Latest episodes", "Shows", then one row per show (its newest season) once that season has 2+ episodes. The menu filters by category. A show tile filters to that show, which opens on its newest season with a season dropdown when there is more than one. Cards show run time when known.
- Must work at 390 px wide with no horizontal page scroll.

## Design

The WTOP-10 brand is navy and red. Do not use SUNY Oswego green/gold here (that palette is for Tyler's course materials only). Colors and fonts match the Program Guide project (`../Program Guide/wtop10-schedule.html`):

- Ground `#080e22`, surface `#0b1733`, surface-2 `#16295c`, navy `#0f2050`, line `#2c3e6b`
- Red `#e5322f` for actions, show names and the active menu item; deep red `#a3121a`
- Ink `#eeeef0`, muted `#b7b9c2`
- Oswald for display, Inter for body (Google Fonts)

Dark-only by design. No green, gold or purple accents.

## Related projects in D:\Claude Code

- `Program Guide`: on-air schedule for wtop10.com, built from Cablecast X-List exports. Source of the palette.
- `Equipment Signout App`, `Studio Booking`, `Sports Scheduling`: other WTOP-10 tools.

## Roadmap

1. Done: static prototype with 3 real Panopto sessions.
2. Done: episodes pulled automatically from public Panopto semester folders, with seasons.
3. Done: our own thumbnails via ffmpeg, plus a branded placeholder.
4. Later: move to Bluehost at wtop10.com/watch/.
