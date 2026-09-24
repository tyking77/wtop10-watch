# WTOP-10 Watch Page

A streaming-style video page for WTOP-10, SUNY Oswego's student TV station, built to look like ICTV's site (ictv.org) and Netflix: a rotating hero at the top, then horizontal rows of episode cards. Playback comes from Panopto embeds. The video itself is hosted by Panopto (the university account has unlimited storage), so this project hosts nothing but the page.

Owner: Tyler King, WTOP-10 faculty advisor. Students will maintain the content, so anything they touch has to stay simple.

## Where it runs

- Demo: GitHub Pages (public repo `wtop10-watch`)
- Final home: `public_html/watch/` on wtop10.com, a WordPress site on Bluehost. WordPress ignores real folders, so the page sits beside it with no plugin or theme involved. The main menu gets a "Watch" link pointing to `/watch/`.

## Files

- `index.html`: the page. All CSS and JS is inline. No build step, no framework, no npm.
- `data.js`: all content (`window.WTOP = {...}`): Panopto host, live switch, shows, episodes. Students edit this file and nothing else.
- `assets/wtop10-logo.png`: official logo, 800x229.
- `stills/`: 1920x1080 hero stills. `trailers/`: hero MP4s.
- `README.txt`: plain-language instructions for students. Keep it in sync with any change to how content is added.

Hard rule: the page must keep working when `index.html` is double-clicked from disk (file://). That is why content loads through a `<script src="data.js">` tag rather than `fetch()` of JSON. Any generated content file has to follow the same pattern (e.g. `episodes.js` setting a global).

## Data model (data.js)

- `shows[]`: `id`, `title`, `category` (drives the top menu), `tagline`, `still`, `trailer`, `featured` (in hero rotation).
- `episodes[]`: `show` (a show id), `date` (YYYY-MM-DD, sorted newest first), `title` (optional; the date is used if empty), `panoptoId`, `thumb`.
- `live`: `{ on, title, panoptoId }`. When on, a red LIVE pill and banner appear.

Image fallback order: hero uses `show.still`, then the latest episode's `thumb`, then a navy gradient card. Episode cards use `ep.thumb`, then `show.still`, then a navy card with the show name. Broken images remove themselves so the fallback shows. Panopto's auto thumbnail is the recording's first frame, which is black for shows that open on black (Storm Team 10 Live). Those shows need a still.

## Behavior to preserve

- Hero trailers: muted, `playsinline`, `preload="none"`. Only the active slide's trailer loads. A slide with a trailer advances when the clip ends, and a still-only slide advances after 9 s. If a trailer is missing, blocked (iPhone Low Power Mode) or errors, the still stays up. `prefers-reduced-motion` disables trailers and the still's slow zoom.
- Trailers must be H.264 MP4 for Safari/iOS. Panopto embeds are never used in the hero.
- Player: `<dialog>` with an iframe to `/Panopto/Pages/Embed.aspx?id=...&autoplay=true&offerviewer=false&showtitle=false&showbrand=false&captions=false&interactivity=none`. Closing it resets the iframe to about:blank.
- `?v=<panoptoId>` in the URL opens that episode, and opening an episode writes it to the address bar.
- Rows: "Latest episodes", "Shows", then one row per show once that show has 2+ episodes. The menu filters by category. A show tile filters to that show.
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
2. Next: pull episodes automatically from each show's public Panopto folder. See HANDOFF.md.
3. Later: move to Bluehost at wtop10.com/watch/.
