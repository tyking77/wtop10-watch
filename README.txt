WTOP-10 WATCH PAGE

FILES
  index.html   The page itself. Nobody needs to edit this for day-to-day updates.
  data.js      Shows and episodes. This is the file students edit.
  assets/      The WTOP-10 logo.
  trailers/    Hero trailer MP4s go here.
  stills/      Hero still images go here.

PUTTING IT ON BLUEHOST
  1. In Bluehost, open File Manager and go to public_html.
  2. Create a folder called "watch".
  3. Upload everything in this folder (index.html, data.js and the assets,
     trailers and stills folders) into public_html/watch.
  4. The page is now live at yoursite.com/watch/
  WordPress ignores real folders, so this won't affect the rest of the site.
  Add a "Watch" link to your WordPress menu that points to /watch/.

ADDING AN EPISODE
  1. In Panopto, set the video to "Public (unlisted)".
  2. Copy the ID from the video's link: ...Viewer.aspx?id=THIS-PART
  3. In data.js, copy an existing episode block, paste it at the top of
     the episodes list, and change show, date, title and panoptoId.
  4. Save and re-upload data.js.

THUMBNAILS
  Leave "thumb" empty and the card uses the show's still image.
  To use Panopto's own thumbnail: open the Panopto link, right-click the
  preview image, copy the image address, and paste it into "thumb".
  Panopto's thumbnails are small, so for the hero use a proper 1920x1080
  still saved in the stills/ folder, e.g. still: "stills/morning-news.jpg"
  Panopto makes its thumbnail from the first frame, so a show that opens
  on black (like Storm Team 10 Live) needs its own still.

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
