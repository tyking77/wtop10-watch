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
     from the address bar. Each folder is one season: name it with the
     semester ("NEWS Fall 2026") or the season ("Laker Showdown: Season 4").
     Order doesn't matter.                                                 */
  panoptoFolders: [
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=e07377de-feb9-4d66-8296-b4ac012d34b8", // News Fall 2026
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=2615918c-73fc-4e9d-b9a1-b48e0004ad09", // News Spring 2026
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=86493e33-edad-416d-8a2e-b48e000748e6", // Entertainment Breach: Season 5
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=46a1e32c-8723-45dc-8e04-b48e001b838d", // Be Kind and Rewind: Season 4
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=48ca2c81-3f79-4488-b14a-b48e00160917", // Laker Showdown: Season 4
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=e8424436-2f24-4182-b517-b48e0007826d", // Laker Connections: Season 25
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=5f417599-7dcc-4c9f-b42b-b48e001ba19e", // Oswegolazo: Season 2
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=511da271-62ba-4fb1-b244-b48e00075028", // Hockey Talk: Season 3
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=0d3771a4-5497-4ca2-acce-b48e00078e18"  // Oh Boy: Season 4
  ],

  /* ---------- LIVE ----------
     The Live tab plays the 24/7 YouTube stream. If the stream is ever
     restarted, YouTube gives it a new video ID: copy it from the new link
     (youtube.com/watch?v=THIS-PART) into "youtube". Games stream on their
     own; during a live game the Live tab links to gamesUrl.              */
  live: {
    youtube: "2pDkDTtbGRY",
    channel: "UCbb2fiQ8Z174AhIlWx-gDiA",
    gamesUrl: "https://www.youtube.com/@WTOP10TV/streams"
  },

  /* ---------- HERO ----------
     The big rotating banner on the home page, in this order. List a show
     id, or add dates to feature a show for a while (both dates included):
       { show: "joepardy", from: "2026-10-01", until: "2026-10-07" }
     A show with no episodes yet is skipped.                              */
  hero: [
    "nightly-news",
    "morning-news",
    "storm-team-10",
    "hockey-night"
  ],

  /* ---------- SHOWS ----------
     category: the top menu tab: "News", "Sports" or "Entertainment".
               Tabs appear in the order shows are listed here.
     still:    wide image for the hero (1920x1080 JPG works best)
     trailer:  optional MP4 for the hero, e.g. "trailers/morning-news.mp4"
     A show stays hidden until it has episodes.
     match:    extra words in a Panopto title that mean "this show" (the
               show's title always counts). When two shows match, the
               longer phrase wins. Optional.
     thumbAt:  seconds into each episode to grab its thumbnail (default 45).
               Pick a moment that usually shows the anchors on set.
     useStill: true always uses "still" instead of episode thumbnails     */
  shows: [
    {
      id: "nightly-news",
      title: "Nightly News",
      category: "News",
      tagline: "The day's news from campus and Oswego, weeknights on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Nightly News", "WTOP News", "WTOP-10 News"]
    },
    {
      id: "morning-news",
      title: "Morning News",
      category: "News",
      tagline: "Campus and Oswego news from the WTOP-10 newsroom.",
      still: "",
      trailer: "",
      match: ["Morning News"],
      thumbAt: 90
    },
    {
      id: "storm-team-10",
      title: "Storm Team 10 Live",
      category: "News",
      tagline: "Join Storm Team 10 in its first weather-focused original production.",
      /* Panopto's thumbnail for this show is a black first frame, so it
         uses its own still. Save a frame grab as stills/storm-team-10.jpg.
         Until that file exists, a navy title card shows instead. */
      still: "stills/storm-team-10.jpg",
      trailer: "",
      useStill: true,
      match: ["Storm Team"]
    },
    {
      id: "hockey-night",
      title: "Hockey Night in Oswego",
      category: "Sports",
      tagline: "Laker sports broadcasts, live on WTOP-10.",
      still: "",
      trailer: "",
      match: ["HNIO"]
    },
    {
      id: "hockey-talk",
      title: "Hockey Talk",
      category: "Sports",
      tagline: "You like hockey? Talking hockey is what we do here.",
      still: "",
      trailer: "",
      thumbAt: 120
    },
    {
      id: "laker-connections",
      title: "Laker Connections",
      category: "Sports",
      tagline: "The go-to television program for Laker sports.",
      still: "",
      trailer: ""
    },
    {
      id: "batting-practice",
      title: "Batting Practice",
      category: "Sports",
      tagline: "Join Joshua Matteson and Connor Saingas as they discuss all things baseball. From Oswego to the major leagues, they break down stats and plays.",
      still: "",
      trailer: ""
    },
    {
      id: "oswegolazo",
      title: "Oswegolazo",
      category: "Sports",
      tagline: "Nick Stetter and Sam Brewer talk everything soccer.",
      still: "",
      trailer: ""
    },
    {
      id: "stick-to-sports",
      title: "Stick to Sports",
      category: "Sports",
      tagline: "From hockey to football and even basketball, these four lads talk about it all.",
      still: "",
      trailer: ""
    },
    {
      id: "unofficial-sports-show",
      title: "The Unofficial Sports Show",
      category: "Sports",
      tagline: "Lorenz Guzman and Logan Weingartener take on all kinds of sports.",
      still: "",
      trailer: "",
      match: ["Unofficial Sports"]
    },
    {
      id: "tapped-out",
      title: "Tapped Out",
      category: "Sports",
      tagline: "A show about pro wrestling: news, rumors, updates, match ratings and anything new in the wrestling world.",
      still: "",
      trailer: ""
    },
    {
      id: "full-court-press",
      title: "Full Court Press",
      category: "Sports",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "laker-night-life",
      title: "Laker Night Life",
      category: "Sports",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "laker-showdown",
      title: "Laker Showdown",
      category: "Entertainment",
      tagline: "Two contestants face off in a game of categories.",
      still: "",
      trailer: "",
      match: ["Laker Showdown"]
    },
    {
      id: "entertainment-breach",
      title: "Entertainment Breach",
      category: "Entertainment",
      tagline: "Chris DeLuca and Austin Claus host WTOP-10's entertainment show.",
      still: "",
      trailer: "",
      match: ["Entertainment Breach"]
    },
    {
      id: "be-kind-and-rewind",
      title: "Be Kind and Rewind",
      category: "Entertainment",
      tagline: "Join Blake Blodgett and Owen Miles as they review your favorite movie franchises.",
      still: "",
      trailer: "",
      match: ["Be Kind and Rewind", "Be Kind Rewind"]
    },
    {
      id: "joepardy",
      title: "Joepardy",
      category: "Entertainment",
      tagline: "Joe Seidman hosts an Oswego version of the popular game show.",
      still: "",
      trailer: ""
    },
    {
      id: "this-or-that",
      title: "This or That",
      category: "Entertainment",
      tagline: "Hosts Rowan Astorino and Kaden Nagel weigh in on which they like more, one category at a time.",
      still: "",
      trailer: ""
    },
    {
      id: "game-night",
      title: "Game Night",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "oswego-taskmaster",
      title: "Oswego Taskmaster",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Taskmaster"]
    },
    {
      id: "girls-night-out",
      title: "Girls Night Out",
      category: "Entertainment",
      tagline: "A group of college girls take on small challenges and explore their college town, bringing you into their daily lives.",
      still: "",
      trailer: "",
      match: ["Girls Night"]
    },
    {
      id: "late-night-lebones",
      title: "Late Night w/ Lebones",
      category: "Entertainment",
      tagline: "A late-night talk show with your host with the most: Lebones.",
      still: "",
      trailer: "",
      match: ["Lebones", "Labones"]
    },
    {
      id: "ta-time",
      title: "TA Time",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "oh-boy",
      title: "OH BOY",
      category: "Entertainment",
      tagline: "Four guys do skits, bits and all sorts of shenanigans.",
      still: "",
      trailer: ""
    },
    {
      id: "oswego-foodies",
      title: "Oswego Foodies",
      category: "Entertainment",
      tagline: "Join James Zepp as he tastes and reviews restaurants across the Oswego region.",
      still: "",
      trailer: "",
      match: ["Foodies"]
    },
    /* Older shows from the program guide. Hidden until they have episodes. */
    {
      id: "cooked",
      title: "Cooked",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "cooked-live",
      title: "Cooked! Live",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "no-alternative",
      title: "No Alternative",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["No Alterntive"]
    },
    {
      id: "dk-experience",
      title: "The DK Experience",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["DK Experience"]
    },
    {
      id: "borealis-booklight",
      title: "Borealis Booklight",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Borealis Book Light", "Borealis Book Talk"]
    },
    {
      id: "not-for-primetime",
      title: "Not for Primetime",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "ten-point-two",
      title: "Ten Point Two",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "connection-terminated",
      title: "Connection Terminated",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "the-bigger-picture",
      title: "The Bigger Picture",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Bigger Picture"]
    },
    {
      id: "dah-boys-talk",
      title: "Dah Boys Talk about DWTS",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Dah Boys Talk"]
    },
    {
      id: "ross-berry-live",
      title: "Ross Berry Live",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "storm-and-tell",
      title: "Storm and Tell",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "fitzcalpine",
      title: "Fitzcalpine",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "amateurs-live",
      title: "Amateurs Live",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
    },
    {
      id: "shut-the-chuck-up",
      title: "SHUT THE CHUCK UP!",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Shut the Chuck Up"]
    },
    {
      id: "ooo-girl",
      title: "OOO Girl",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: ""
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
