WTOP-10 WATCH PAGE

FILES
  index.html   The page itself. Nobody needs to edit this for day-to-day updates.
  data.js      Shows, Panopto folders and fixes. This is the file students edit.
  episodes.js  Episodes pulled from Panopto. Made automatically; don't edit.
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

THE HERO (BIG BANNER ON THE HOME PAGE)
  The "hero" list in data.js sets which shows rotate there, in order.
  To feature a show for a set time, add dates (both days included):
    { show: "joepardy", from: "2026-10-01", until: "2026-10-07" },
  Show ids are the "id" of each show block. A show with no episodes yet
  is skipped.

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
  For the hero, a proper 1920x1080 still in the stills/ folder looks
  sharpest, e.g. still: "stills/morning-news.jpg"

HERO TRAILERS
  Length 15-30 seconds, 1920x1080 (1280x720 is fine), H.264 MP4, audio
  removed, 3-8 MB. Keep the lower-left of the frame fairly plain, since
  the show title and buttons sit there. Cut it so the end flows back to
  the start. Put the file in trailers/ and set the show's trailer, e.g.
  trailer: "trailers/morning-news.mp4"
  Shows without a trailer use their still image with a slow zoom.

LIVE
  In data.js, set live.on to true and paste the webcast's Panopto ID into
  live.panoptoId. A red LIVE button and banner appear. Set it back to
  false when the broadcast ends.

SHARING AN EPISODE
  Opening an episode changes the address bar to watch/?v=PANOPTO-ID.
  That link opens the site with that episode in the player.
