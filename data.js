/* ==========================================================================
   WTOP-10 WATCH PAGE: CONTENT FILE
   This is the only file students need to edit to add shows and episodes.

   ADDING AN EPISODE
   1. In Panopto, set the video to "Public (unlisted)".
   2. Copy the ID from its link: ...Viewer.aspx?id=THIS-PART
   3. Copy an episode block below, paste it at the top of the episodes
      list, and change the details. Keep the commas between blocks.
   Thumbnails: leave "thumb" empty and the card shows the show's still.
   To use Panopto's thumbnail, paste its image address (see README).

   ADDING A HERO TRAILER
   Upload a short MP4 (15-30 sec, 1080p, H.264, no audio, under ~8 MB)
   to the trailers/ folder and put its file name in the show's "trailer".
   Leave "trailer" empty and the hero uses the still image instead.
   ========================================================================== */

window.WTOP = {
  panoptoHost: "https://oswego.hosted.panopto.com",

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
     featured: true puts the show in the rotating hero                      */
  shows: [
    {
      id: "morning-news",
      title: "Morning News",
      category: "News",
      tagline: "Campus and Oswego news from the WTOP-10 newsroom.",
      still: "",
      trailer: "",
      featured: true
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
      featured: true
    },
    {
      id: "hockey-night",
      title: "Hockey Night in Oswego",
      category: "Sports",
      tagline: "Laker men's hockey, home and away, live on WTOP-10.",
      still: "",
      trailer: "",
      featured: true
    }
  ],

  /* ---------- EPISODES ----------
     show:      must match a show "id" above
     date:      YYYY-MM-DD (newest episodes show first automatically)
     title:     optional; leave empty to use the date                     */
  episodes: [
    {
      show: "morning-news",
      title: "",
      date: "2026-09-18",
      panoptoId: "efbe645c-4f4f-4be9-b993-b4ca01655f60",
      thumb: "https://d2y36twrtb17ty.cloudfront.net/sessions/e932120c-89f2-4560-b7e8-b4ca01655f56/52e46cdd-daa0-4fe5-98b9-b4ca017fef9f_et/thumbs/slide12599839.jpg"
    },
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
  ]
};
