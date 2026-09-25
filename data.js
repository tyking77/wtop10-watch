/* ==========================================================================
   WTOP-10 WATCH PAGE: CONTENT FILE
   This is the only file students need to edit.

   ADDING AN EPISODE
   Upload it to the show's Panopto folder. That's it. The page checks
   the folders below every 30 minutes and adds new videos by itself.
   Put the air date in the Panopto title (e.g. "Nightly News 9-24-26").

   NEW SEMESTER
   Make the new public folder in Panopto, then paste its link at the top
   of panoptoFolders below. Each folder becomes a season on the page.

   FIXING AN EPISODE
   Use "overrides" at the bottom of this file (hide it, retitle it, etc.).

   ADDING A HERO TRAILER
   Upload a short MP4 (15-30 sec, 1080p, H.264, no audio, under ~8 MB)
   to the trailers/ folder and put its file name in the show's "trailer".
   Leave "trailer" empty and the hero uses the still image instead.
   ========================================================================== */

window.WTOP = {
  panoptoHost: "https://oswego.hosted.panopto.com",

  /* ---------- PANOPTO FOLDERS ----------
     Public Panopto folders to pull episodes from. Paste the folder's link
     from the address bar. Newest semester at the top.                    */
  panoptoFolders: [
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=e07377de-feb9-4d66-8296-b4ac012d34b8", // News Fall 2026
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=2615918c-73fc-4e9d-b9a1-b48e0004ad09"  // News Spring 2026
  ],

  /* Flip "on" to true when a live broadcast is running. */
  live: {
    on: false,
    title: "Morning News",
    panoptoId: ""
  },

  /* ---------- SHOWS ----------
     category: used for the top menu (News, Weather, Sports, etc.)
     still:    wide image for the hero (1920x1080 JPG works best)
     trailer:  optional MP4 for the hero, e.g. "trailers/morning-news.mp4"
     featured: true puts the show in the rotating hero
     match:    words in a Panopto title that mean "this show". When two
               shows match, the longer phrase wins.
     useStill: true always uses "still" instead of Panopto's thumbnails
               (for shows whose videos open on a black frame)             */
  shows: [
    {
      id: "nightly-news",
      title: "Nightly News",
      category: "News",
      tagline: "The day's news from campus and Oswego, weeknights on WTOP-10.",
      still: "",
      trailer: "",
      featured: true,
      match: ["Nightly News", "WTOP News", "WTOP-10 News"]
    },
    {
      id: "morning-news",
      title: "Morning News",
      category: "News",
      tagline: "Campus and Oswego news from the WTOP-10 newsroom.",
      still: "",
      trailer: "",
      featured: true,
      match: ["Morning News"]
    },
    {
      id: "storm-team-10",
      title: "Storm Team 10 Live",
      category: "Weather",
      tagline: "Forecasts and weather coverage from the WTOP-10 Storm Team.",
      /* Panopto's thumbnail for this show is a black first frame, so it
         uses its own still. Save a frame grab as stills/storm-team-10.jpg.
         Until that file exists, a navy title card shows instead. */
      still: "stills/storm-team-10.jpg",
      trailer: "",
      featured: true,
      useStill: true,
      match: ["Storm Team"]
    },
    {
      id: "hockey-night",
      title: "Hockey Night in Oswego",
      category: "Sports",
      tagline: "Laker men's hockey, home and away, live on WTOP-10.",
      still: "",
      trailer: "",
      featured: true,
      match: ["Hockey"]
    }
  ],

  /* ---------- EPISODES ----------
     Episodes from the Panopto folders appear on their own. Only list one
     here if it lives outside those folders. An episode listed here wins
     over the automatic copy of the same video.
     show:      must match a show "id" above
     date:      YYYY-MM-DD (newest episodes show first automatically)
     title:     optional; leave empty to use the date                     */
  episodes: [
    {
      show: "storm-team-10",
      title: "",
      date: "2026-09-15",
      panoptoId: "50f7b3dd-585b-408c-b871-b4c60140b130",
      thumb: ""
    },
    {
      show: "hockey-night",
      title: "Oswego at Hobart: SUNYAC Championship",
      date: "2026-03-07",
      panoptoId: "cc9f3eb6-0d9b-4a98-b66e-b499005ee56b",
      thumb: "https://d2y36twrtb17ty.cloudfront.net/sessions/75cf486e-845d-455d-8bcd-b499005ee55b/6af8c514-8a14-4f26-a156-b499007630f5_et/thumbs/slide0.jpg"
    }
  ],

  /* ---------- OVERRIDES ----------
     Fix an episode without touching Panopto. Key it by the Panopto ID
     (from ...Viewer.aspx?id=THIS-PART). Use any of:
       hide: true        take it off the page
       title: "..."      replace the title
       thumb: "..."      replace the thumbnail (image address)
       date: "YYYY-MM-DD" fix the air date
     Example:
       "33937c68-6e2e-4cad-9876-b4d0000472d6": { title: "Election Night" },  */
  overrides: {
  }
};
