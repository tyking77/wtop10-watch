WTOP-10 WATCH PAGE

FILES
  index.html   The page itself. Nobody needs to edit this for day-to-day updates.
  data.js      Shows, Panopto folders and fixes. This is the file students edit.
  episodes.js  Episodes pulled from Panopto. Made automatically; don't edit.
  pages.js     The Donate and About Us pages (text you can edit).
  guide.html   The program guide (also shown on wtop10.com).
  guide-core.js  Guide rules: show categories and title spellings.
  schedule/    Cablecast CSV exports go here.
  schedule.js  The merged schedule. Made automatically; don't edit.
  scripts/     The program that builds episodes.js.
  assets/      The WTOP-10 logo.
  trailers/    Hero trailer MP4s go here.
  stills/      Hero still images go here.

PUTTING IT ON BLUEHOST
  1. In Bluehost, open File Manager and go to public_html.
  2. Create a folder called "watch".
  3. Upload everything in this folder (index.html, data.js, episodes.js
     and the assets, trailers and stills folders) into public_html/watch.
  4. The page is now live at yoursite.com/watch/
  WordPress ignores real folders, so this won't affect the rest of the site.
  Add a "Watch" link to your WordPress menu that points to /watch/.

ADDING AN EPISODE
  Upload the video to the show's semester folder in Panopto. That's all.
  Every 30 minutes the site checks the folders and adds new videos.
  Name it with the show and the air date, e.g. "Nightly News 9-24-26",
  or the show and episode number, e.g. "S5 Ep.1 Entertainment Breach".
  Numbered episodes show as "Episode 1" and run in order within a season.
  The page uses the air date from the title, and it cuts the show name,
  the date and any job number ("4309-1-") from the title. Anything left
  over becomes the episode title, e.g. "Senior Week Nightly News 5-5-26"
  shows as "Senior Week". No date in the title? It uses the upload date.
  The folder has to be public so the site can read it.

NEW SEMESTER OR SEASON
  1. Make the new folder in Panopto and make it public. Put the semester
     or season in its name, e.g. "NEWS Spring 2027" or
     "Laker Showdown: Season 5".
  2. Copy the folder's link from the address bar.
  3. Paste it at the top of panoptoFolders in data.js.
  Each folder becomes a season. A show's page opens on its newest season,
  and viewers pick older ones from the dropdown.

ADDING A SHOW
  Every current show is already in data.js. A show stays hidden until it
  has episodes, so usually you only need to add its Panopto folder.
  For a brand-new show, copy a show block and fill it in. "category" is
  the menu tab: "News", "Sports" or "Entertainment". Panopto titles that
  contain the show's title go to that show automatically. If the titles
  use a different name, list it in "match", e.g. match: ["Taskmaster"].

WHEN NEW EPISODES COME OUT
  Each show's "airs" in data.js shows on its tile and its page, e.g.
    airs: { day: "Thursday", time: "6:00 PM", weeks: "B" },
  weeks is "A" or "B" for shows that air every other week; leave it out
  for every week. Add live: true for shows that air live. Change it here
  when the production schedule changes.
  The show's page also gives the next date ("next Thu, Oct 1"). For that,
  weekA in data.js is a Monday that starts an A week. If the A/B cycle
  ever resets (a new semester), put the new A-week Monday there.

THE HERO (BIG BANNER AT THE TOP)
  It rotates the 4 shows with the newest episodes, on its own: across all
  shows on Home, and within the tab on News, Sports and Entertainment.
  To feature a show on Home anyway, list it in "hero" in data.js; it
  takes the first slot. Add dates to feature it for a while (both days
  included):
    { show: "joepardy", from: "2026-10-01", until: "2026-10-07" },
  Show ids are the "id" of each show block.

FIXING AN EPISODE
  In data.js, add a line to "overrides" using the video's Panopto ID
  (from its link: ...Viewer.aspx?id=THIS-PART):
    "PANOPTO-ID": { hide: true },
    "PANOPTO-ID": { title: "Election Night", date: "2026-11-03" },
    "PANOPTO-ID": { thumb: "stills/election-night.jpg" },
  Fixing the title in Panopto works too.

VIDEOS OUTSIDE THE FOLDERS
  A video that isn't in a listed folder can still go in the episodes list
  in data.js by hand: copy an episode block and change show, date, title
  and panoptoId. A hand-entered episode wins over the automatic copy.

THUMBNAILS
  The site makes its own. For each new episode it grabs a frame 45 seconds
  in (set "thumbAt" on a show to change that; Morning News uses 90). If
  that frame is black or a dark slate, it tries later points in the video.
  The frames are saved in the thumbs/ folder.
  Don't like one? In data.js overrides, point it at your own image:
    "PANOPTO-ID": { thumb: "stills/sep-24-election.jpg" },
  If a video has no frame yet (Panopto still processing it), the card
  shows a WTOP-10 title card with the air date until the next check.
  To make every episode of a show use the show's still image instead,
  set useStill: true on the show.
  Game broadcasts (Hockey Night in Oswego) use thumbFind: "game", which
  looks through the game for a frame of the rink or court instead of the
  pregame desk or an intermission graphic.

GAME BROADCASTS (HOCKEY NIGHT IN OSWEGO)
  Each sport has its own public Panopto folder, named like
  "Oswego Women's Hockey". Its show page has one row per folder, labeled
  from the name: "Hockey", "Hockey (W)", "Basketball (W)" and so on.
  Game titles get the same labels: "Hockey (W) vs. Cortland".
  Next season, name the new folders with the years so the rows stay
  apart, e.g. "Oswego Women's Hockey 2026-27".
  For the hero, a proper 1920x1080 still in the stills/ folder looks
  sharpest, e.g. still: "stills/morning-news.jpg"

HERO TRAILERS
  Length 15-30 seconds, 1920x1080 (1280x720 is fine), H.264 MP4, audio
  removed, 3-8 MB. Keep the lower-left of the frame fairly plain, since
  the show title and buttons sit there. Cut it so the end flows back to
  the start. Put the file in trailers/ and set the show's trailer, e.g.
  trailer: "trailers/morning-news.mp4"
  Shows without a trailer use their still image with a slow zoom.

UPDATING THE PROGRAM GUIDE
  1. Export the X-List report from Cablecast as CSV. Don't open or edit it.
  2. Go to https://github.com/tyking77/wtop10-watch/upload/main/schedule
  3. Drag the CSV in and click "Commit changes".
  In a couple of minutes the guide updates on the watch page's Live tab
  and on wtop10.com. When two exports cover the same day, the newer one
  wins. Old days drop off by themselves.
  To check it worked: open the repo's Actions tab, click the latest
  "Update episodes" run and read the "Build schedule.js" step. It lists
  any rows it skipped and any show it didn't know the category of.
  A show in the wrong category, or spelled two ways? Fix it once in
  guide-core.js (CATEGORY_RULES and CANONICAL_TITLES).

LIVE
  The Live tab plays the 24/7 YouTube stream with the program guide
  under it. Link straight to it with watch/?live
  If the 24/7 stream is ever restarted, YouTube gives it a new video ID.
  Copy it from the new link (youtube.com/watch?v=THIS-PART) into
  live.youtube in data.js.
  During a live game, the Live tab shows a banner linking to the game's
  own stream. That comes from the schedule; nothing to switch on.

DONATE AND ABOUT US PAGES
  Their text is in pages.js, between the backticks. Formatting:
    ## Heading   ### Smaller heading   - List item   > Big callout line
    **bold**     [link text](https://...)
  Leave a blank line between paragraphs. Don't type a backtick inside.
  "menu" at the top of pages.js sets the menu: a single page, or a group
  that becomes a dropdown. To add a page, copy one, give it a new name,
  and add that name to the menu.
  Photos and videos for these pages go in assets/pages/ (videos as
  H.264 MP4). A dropdown can also hold a link to another site, like
  Member Resources (the member app at wtop10.web.app).

LINKS AND THE BACK BUTTON
  Every view has its own address, so the browser's Back button works and
  any view can be linked or shared:
    watch/                          Home
    watch/?live                     Live tab
    watch/?tab=sports               a menu tab (news, sports, entertainment)
    watch/?show=hockey-talk         a show (the id from data.js)
    watch/?show=nightly-news&season=Spring 2026   an older season
    watch/?page=donate              Donate (also ?page=about,
                                    ?page=constitution, ?page=contact)
  Opening an episode adds &v=PANOPTO-ID, and that link opens the episode
  in the player. Back closes the player.
