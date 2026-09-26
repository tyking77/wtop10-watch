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
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=0d3771a4-5497-4ca2-acce-b48e00078e18", // Oh Boy: Season 4
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=f45e89e2-ab05-4333-be0b-b48e0007658b", // Joepardy: Season 2
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=7ad4485e-20da-4e0a-be43-b48e0010de55", // Late Night With Lebones: Season 1
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=f42527d9-9be2-4581-a235-b48e0015cbc4", // Stick 2 Sports: Season 10
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=7ac2fa0c-2643-4b09-b440-b48e006e9dea", // Oswego Men's Hockey
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=d2e779ca-e891-4d85-bee0-b48e006ea6d1", // Oswego Women's Hockey
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=05ed34a2-3407-4837-890c-b48e006f4c47", // Oswego Men's Basketball
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=a8a301be-88c9-4bf2-a055-b48e006f5672", // Oswego Women's Basketball
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=c8b455bf-08de-4d24-80c1-b48e0015e024", // This or That: Season 1
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=794b1d5e-6733-4211-bbed-b48e0015f828", // The Unofficial Sports Show: Season 1
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=869d2ffd-7a9b-4e1d-a9da-b48e006ed868", // Oswego Women's Soccer
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=d27d5f75-c551-4e8a-9392-b48e006eb10c", // Oswego Men's Soccer
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=47c62cbd-20c5-4834-a9cc-b48e006f21fb", // Oswego Women's Volleyball
    "https://oswego.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx?folderID=78eac15f-827e-488b-b53b-b48e006f0602"  // Oswego Field Hockey
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

  /* ---------- A AND B WEEKS ----------
     A Monday that starts an A week. Weeks alternate from there, so the
     page can show each show's next new-episode date.                     */
  weekA: "2026-09-21",

  /* ---------- HERO ----------
     The big rotating banner shows the 4 shows with the newest episodes,
     on its own. To feature a show on the home page anyway, list it here;
     it takes the first slot. Add dates to feature it for a while (both
     dates included):
       { show: "joepardy", from: "2026-10-01", until: "2026-10-07" }     */
  hero: [
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
     useStill: true always uses "still" instead of episode thumbnails
     airs:     when new episodes come out, shown on the show tile and page:
                 { day: "Thursday", time: "6:00 PM", weeks: "B" }
               weeks is "A" or "B" for every-other-week shows; leave it out
               for every week. Add live: true for shows that air live.   */
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
      id: "rise-and-shine",
      title: "Rise and Shine Oswego",
      category: "News",
      tagline: "Campus and Oswego news to start your Friday, from the WTOP-10 newsroom.",
      still: "",
      trailer: "",
      /* Panopto titles may say Rise and Shine Oswego, RASO or Morning News */
      match: ["Rise and Shine Oswego", "Rise and Shine", "RASO", "Morning News"],
      thumbAt: 90,
      airs: { day: "Friday", time: "9:30 AM" }
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
      match: ["Storm Team"],
      airs: { day: "Tuesday", time: "10:00 AM", weeks: "B", live: true }
    },
    /* Game broadcasts. Each sport has one Panopto folder per season; put
       the years in the folder name, e.g. "Oswego Men's Hockey 2026-27".
       A folder with "Classics" in its name (e.g. "Hockey Night in Oswego
       Classics") becomes a Classics season, listed after the others.
       thumbFind: "game" picks a frame of the rink or court. */
    {
      id: "hockey-night",
      title: "Hockey Night in Oswego",
      category: "Sports",
      tagline: "Laker men's hockey, home and away, on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Men's Ice Hockey", "Men's Hockey", "HNIO"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "hockey-night-w",
      title: "Hockey Night in Oswego (W)",
      category: "Sports",
      tagline: "Laker women's hockey, home and away, on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Women's Ice Hockey", "Women's Hockey"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "mens-basketball",
      title: "Oswego Men's Basketball",
      category: "Sports",
      tagline: "Laker men's basketball on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Men's Basketball"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "womens-basketball",
      title: "Oswego Women's Basketball",
      category: "Sports",
      tagline: "Laker women's basketball on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Women's Basketball"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "volleyball",
      title: "Oswego Volleyball",
      category: "Sports",
      tagline: "Laker volleyball on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Women's Volleyball", "Volleyball"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "mens-soccer",
      title: "Oswego Men's Soccer",
      category: "Sports",
      tagline: "Laker men's soccer on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Men's Soccer"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "womens-soccer",
      title: "Oswego Women's Soccer",
      category: "Sports",
      tagline: "Laker women's soccer on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Women's Soccer", "Womens Soccer"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "field-hockey",
      title: "Oswego Field Hockey",
      category: "Sports",
      tagline: "Laker field hockey on WTOP-10.",
      still: "",
      trailer: "",
      match: ["Field Hockey"],
      thumbAt: 1800,
      thumbFind: "game"
    },
    {
      id: "hockey-talk",
      title: "Hockey Talk",
      category: "Sports",
      tagline: "You like hockey? Talking hockey is what we do here.",
      still: "",
      trailer: "",
      thumbAt: 120,
      airs: { day: "Thursday", time: "6:00 PM", weeks: "B" }
    },
    {
      id: "laker-connections",
      title: "Laker Connections",
      category: "Sports",
      tagline: "The go-to television program for Laker sports.",
      still: "",
      trailer: "",
      airs: { day: "Thursday", time: "7:30 PM", live: true }
    },
    {
      id: "batting-practice",
      title: "Batting Practice",
      category: "Sports",
      tagline: "Join Joshua Matteson and Connor Saingas as they discuss all things baseball. From Oswego to the major leagues, they break down stats and plays.",
      still: "",
      trailer: "",
      airs: { day: "Thursday", time: "5:30 PM", weeks: "B" }
    },
    {
      id: "oswegolazo",
      title: "Oswegolazo",
      category: "Sports",
      tagline: "Nick Stetter and Sam Brewer talk everything soccer.",
      still: "",
      trailer: "",
      airs: { day: "Thursday", time: "5:00 PM", weeks: "B" }
    },
    {
      id: "stick-to-sports",
      title: "Stick to Sports",
      category: "Sports",
      tagline: "From hockey to football and even basketball, these four lads talk about it all.",
      still: "",
      trailer: "",
      match: ["Stick 2 Sports"],
      airs: { day: "Thursday", time: "6:30 PM" }
    },
    {
      id: "unofficial-sports-show",
      title: "The Unofficial Sports Show",
      category: "Sports",
      tagline: "Lorenz Guzman and Logan Weingartener take on all kinds of sports.",
      still: "",
      trailer: "",
      match: ["Unofficial Sports", "The Unofficial Sport Show", "The Unoffical Sports Show", "Unofficial Sport Show", "Unoffical Sports Show"],
      airs: { day: "Thursday", time: "7:00 PM", weeks: "A" }
    },
    {
      id: "tapped-out",
      title: "Tapped Out",
      category: "Sports",
      tagline: "A show about pro wrestling: news, rumors, updates, match ratings and anything new in the wrestling world.",
      still: "",
      trailer: "",
      airs: { day: "Friday", time: "2:00 PM", weeks: "A" }
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
      match: ["Laker Showdown"],
      airs: { day: "Monday", time: "3:00 PM", weeks: "B" }
    },
    {
      id: "entertainment-breach",
      title: "Entertainment Breach",
      category: "Entertainment",
      tagline: "Chris DeLuca and Austin Claus host WTOP-10's entertainment show.",
      still: "",
      trailer: "",
      match: ["Entertainment Breach"],
      airs: { day: "Monday", time: "1:30 PM", weeks: "A" }
    },
    {
      id: "be-kind-and-rewind",
      title: "Be Kind and Rewind",
      category: "Entertainment",
      tagline: "Join Blake Blodgett and Owen Miles as they review your favorite movie franchises.",
      still: "",
      trailer: "",
      match: ["Be Kind and Rewind", "Be Kind Rewind"],
      airs: { day: "Monday", time: "6:00 PM", weeks: "B" }
    },
    {
      id: "joepardy",
      title: "Joepardy",
      category: "Entertainment",
      tagline: "Joe Seidman hosts an Oswego version of the popular game show.",
      still: "",
      trailer: "",
      airs: { day: "Monday", time: "10:00 AM" }
    },
    {
      id: "this-or-that",
      title: "This or That",
      category: "Entertainment",
      tagline: "Hosts Rowan Astorino and Kaden Nagel weigh in on which they like more, one category at a time.",
      still: "",
      trailer: "",
      airs: { day: "Tuesday", time: "2:00 PM", weeks: "A" }
    },
    {
      id: "game-night",
      title: "Game Night",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      airs: { day: "Saturday", time: "8:00 PM", weeks: "A" }
    },
    {
      id: "oswego-taskmaster",
      title: "Oswego Taskmaster",
      category: "Entertainment",
      tagline: "",
      still: "",
      trailer: "",
      match: ["Taskmaster"],
      airs: { day: "Wednesday", time: "2:00 PM", weeks: "B" }
    },
    {
      id: "girls-night-out",
      title: "Girls Night Out",
      category: "Entertainment",
      tagline: "A group of college girls take on small challenges and explore their college town, bringing you into their daily lives.",
      still: "",
      trailer: "",
      match: ["Girls Night"],
      airs: { day: "Friday", time: "8:30 PM", weeks: "B" }
    },
    {
      id: "late-night-lebones",
      title: "Late Night w/ Lebones",
      category: "Entertainment",
      tagline: "A late-night talk show with your host with the most: Lebones.",
      still: "",
      trailer: "",
      match: ["Late Night With Lebones", "Lebones", "Labones"],
      airs: { day: "Monday", time: "1:00 PM", weeks: "B" }
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
      title: "Oh Boy!",
      category: "Entertainment",
      tagline: "Four guys do skits, bits and all sorts of shenanigans.",
      still: "",
      trailer: "",
      airs: { day: "Monday", time: "4:00 PM", weeks: "A" }
    },
    {
      id: "oswego-foodies",
      title: "Oswego Foodies",
      category: "Entertainment",
      tagline: "Join James Zepp as he tastes and reviews restaurants across the Oswego region.",
      still: "",
      trailer: "",
      match: ["Foodies"],
      airs: { day: "Friday", time: "12:00 PM", weeks: "A" }
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
    // Titled "January 16th, 2025"; the game was in 2026
    "49a03c52-0d52-48f7-86b0-b4960160d312": { date: "2026-01-16" },
    "cfb5e834-9464-4449-a1ea-b4970153dffc": { date: "2026-01-16" }
  }
};
