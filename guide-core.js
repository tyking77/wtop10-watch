/* WTOP-10 program guide core: settings, category rules, title fixes and the
   Cablecast CSV parser. Shared by guide.html (the full guide, also embedded on
   wtop10.com), index.html (the Live tab and home-page Live card) and
   scripts/build-schedule.mjs (checks each upload). Edit rules and title fixes
   here, once. No DOM access in this file. */
(function(){
  'use strict';

  /* =====================================================================
     CONFIG - the blocks a staff member is most likely to need to edit.
     ===================================================================== */

  // All station times are Eastern. Everything below works in station
  // wall-clock time, never the viewer's clock.
  var STATION_TZ = 'America/New_York';

  // Filler slates ("Regular Scheduled Programming Will Return Soon") stay in
  // the timeline so gaps are not mistaken for dead air, but are not listed.
  var HIDE_FILLER = true;
  var FILLER_RE = /regular scheduled programming will return soon/i;

  // A program is "featured" (large card) at this length or longer. Head-to-head
  // events are always featured regardless of length.
  var FEATURED_MIN_MINUTES = 90;

  // How far forward the rolling "On Now" tab looks, in hours.
  var ROLLING_WINDOW_HOURS = 24;

  // How many programs the hero lists under "Up next".
  var UP_NEXT_COUNT = 3;

  // Show "Airs again ..." on a card when the same episode repeats later in the
  // loaded schedule. Set to 'livesports' to limit it to game broadcasts, or
  // false to switch it off.
  var SHOW_AIRS_AGAIN = 'all';


  /* RULES_START */
  // Categories are derived from the normalized title. First match wins.
  // Admin mode writes staff choices back into the top of this table keyed by
  // exact normalized title, and "Copy updated data" prints the whole table
  // so it can be pasted back over this block.
  var CATEGORY_RULES = [
    // Live game broadcasts. Title normalization rewrites the Cablecast event
    // titles to "Oswego State <Sport> vs./: <Opponent>", so this one rule
    // catches every game we carry.
    { match: /^oswego state /i, cat: 'livesports' },
    { match: /hockey talk/i, cat: 'sports' },
    { match: /full court press/i, cat: 'sports' },
    { match: /unofficial sports show/i, cat: 'sports' },
    { match: /stick to sports/i, cat: 'sports' },
    { match: /laker night life/i, cat: 'sports' },
    { match: /laker connections/i, cat: 'sports' },
    { match: /oswegolazo/i, cat: 'sports' },
    { match: /\b(volleyball|basketball|soccer|lacrosse|hockey|baseball|softball|football|tennis|swimming|track)\b/i, cat: 'sports' },
    { match: /wtop-10 news/i, cat: 'news' },
    { match: /^nightly news/i, cat: 'news' },
    { match: /^(morning news|rise and shine|raso)/i, cat: 'news' },
    { match: /storm team/i, cat: 'news' },
    { match: /regular scheduled programming will return soon/i, cat: 'community' },
    { match: /bulletin|community calendar|public affairs/i, cat: 'community' },
    { match: /joepardy/i, cat: 'entertainment' },
    { match: /oswego taskmaster/i, cat: 'entertainment' },
    { match: /game night/i, cat: 'entertainment' },
    { match: /^cooked/i, cat: 'entertainment' },
    { match: /laker showdown/i, cat: 'entertainment' },
    { match: /be kind and rewind/i, cat: 'entertainment' },
    { match: /borealis booklight/i, cat: 'entertainment' },
    { match: /entertainment breach/i, cat: 'entertainment' },
    { match: /no alternative/i, cat: 'entertainment' },
    { match: /dk experience/i, cat: 'entertainment' },
    { match: /late night with lebones/i, cat: 'entertainment' },
    { match: /ta time/i, cat: 'entertainment' },
    { match: /not for primetime/i, cat: 'entertainment' },
    { match: /oh boy/i, cat: 'entertainment' },
    { match: /this or that/i, cat: 'entertainment' },
    { match: /ten point two/i, cat: 'entertainment' },
    { match: /connection terminated/i, cat: 'entertainment' },
    { match: /the bigger picture/i, cat: 'entertainment' },
    { match: /dah boys talk/i, cat: 'entertainment' },
    { match: /ross berry live/i, cat: 'entertainment' }
  ];
  var DEFAULT_CAT = 'entertainment';
  /* RULES_END */

  // Spelling and casing fixes, keyed by the lowercased title. Anything not
  // listed keeps the casing Cablecast sent. Two titles are only merged here
  // when they are certainly the same show.
  var CANONICAL_TITLES = {
    'be kind and rewind':'Be Kind and Rewind',
    'borealis book light':'Borealis Booklight',
    'borealis book talk':'Borealis Booklight',
    'borealis booklight':'Borealis Booklight',
    'community bulletin board':'Community Bulletin Board',
    'connection terminated':'Connection Terminated',
    'cooked':'Cooked',
    'dah boys talk about dwts':'Dah Boys Talk about DWTS',
    'cooked! live':'Cooked! Live',
    'dk experience':'The DK Experience',
    'the dk experience':'The DK Experience',
    'entertainment breach':'Entertainment Breach',
    'fitzcalpine':'Fitzcalpine',
    'full court press':'Full Court Press',
    'hockey talk':'Hockey Talk',
    'joepardy':'Joepardy',
    'laker connections':'Laker Connections',
    'laker night life':'Laker Night Life',
    'laker showdown':'Laker Showdown',
    'late night with lebones':'Late Night With Lebones',
    'morning news':'Rise and Shine Oswego',
    'raso':'Rise and Shine Oswego',
    'rise and shine':'Rise and Shine Oswego',
    'rise and shine oswego':'Rise and Shine Oswego',
    'no alternative':'No Alternative',
    'no alterntive':'No Alternative',
    'not for primetime':'Not for Primetime',
    'oh boy':'Oh Boy!',
    'oh boy!':'Oh Boy!',
    'oswegolazo':'Oswegolazo',
    'oswgolazo':'Oswegolazo',
    'regular scheduled programming will return soon':'Regular Scheduled Programming Will Return Soon',
    'ross berry live':'Ross Berry Live',
    'stick to sports':'Stick To Sports',
    'storm and tell':'Storm and Tell',
    'ta time':'TA Time',
    'ten point two':'Ten Point Two',
    'the bigger picture':'The Bigger Picture',
    'the unoffical sports show':'The Unofficial Sports Show',
    'the unofficial sport show':'The Unofficial Sports Show',
    'the unofficial sports show':'The Unofficial Sports Show',
    'unofficial sports show':'The Unofficial Sports Show',
    'this or that':'This or That',
    'wtop-10 news':'WTOP-10 News'
  };

  // Where a show's card should link, keyed by normalized title. Empty for now:
  // fill one entry per show as the stream pages and show pages go live.
  // Resolution order is program.url, then SHOW_LINKS[title], then no link.
  var SHOW_LINKS = {
    // 'WTOP-10 News': 'https://wtop10.com/news/'
  };

  // Show logos, keyed by normalized title the same way. Every card and the
  // on-air hero already reserve a square for one; an entry here fills it.
  // Use a URL or a data: URI. Empty for now.
  var SHOW_LOGOS = {
    // 'WTOP-10 News': 'https://wtop10.com/wp-content/uploads/news-logo.png'
  };

  var CAT_LABELS = {
    livesports:"Live Sports", sports:"Sports", news:"News",
    entertainment:"Entertainment", community:"Community"
  };
  var CAT_ORDER = ['livesports','sports','news','entertainment','community'];
  var DAYPARTS = [
    {key:"overnight", label:"Overnight", range:"12:00 AM – 6:00 AM", from:0, to:360},
    {key:"morning", label:"Morning", range:"6:00 AM – 12:00 PM", from:360, to:720},
    {key:"afternoon", label:"Afternoon", range:"12:00 PM – 5:00 PM", from:720, to:1020},
    {key:"prime", label:"Prime Time", range:"5:00 PM – 10:00 PM", from:1020, to:1320},
    {key:"late", label:"Late Night", range:"10:00 PM – Midnight", from:1320, to:1440}
  ];
  var DAY_NAMES_LONG = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var DAY_NAMES_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  /* =====================================================================
     TIME - station wall clock, collapsed to a sortable YYYYMMDDHHMM key.
     No Date arithmetic on station times, so DST and midnight are non-events.
     ===================================================================== */

  var stationFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: STATION_TZ, year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
  });

  function stationNowParts(){
    var p = {};
    stationFmt.formatToParts(new Date()).forEach(function(part){
      if(part.type !== 'literal') p[part.type] = part.value;
    });
    var hour = parseInt(p.hour, 10);
    if(hour === 24) hour = 0; // some ICU builds report midnight as hour 24
    return { y:+p.year, m:+p.month, d:+p.day, h:hour, mi:+p.minute, s:+p.second };
  }

  function keyOf(y,m,d,h,mi){
    return y*100000000 + m*1000000 + d*10000 + h*100 + mi;
  }
  function keyParts(key){
    return {
      y: Math.floor(key/100000000),
      m: Math.floor(key/1000000) % 100,
      d: Math.floor(key/10000) % 100,
      h: Math.floor(key/100) % 100,
      mi: key % 100
    };
  }
  // Absolute minutes, for differences only. Date.UTC is pure arithmetic here;
  // neither the local nor the station timezone is involved.
  function keyToAbsMin(key){
    var p = keyParts(key);
    return Math.floor(Date.UTC(p.y, p.m-1, p.d, p.h, p.mi) / 60000);
  }
  function absMinToKey(abs){
    var d = new Date(abs * 60000);
    return keyOf(d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
  }
  function addHoursToKey(key, hours){
    return absMinToKey(keyToAbsMin(key) + hours*60);
  }
  function nowKey(){
    var p = stationNowParts();
    return keyOf(p.y, p.m, p.d, p.h, p.mi);
  }
  // Fractional station minutes, for the progress bar.
  function nowAbsMin(){
    var p = stationNowParts();
    return keyToAbsMin(keyOf(p.y,p.m,p.d,p.h,p.mi)) + p.s/60;
  }
  function isoDate(y,m,d){
    return y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
  }
  function isoToParts(iso){
    var b = String(iso).split('-');
    return { y:+b[0], m:+b[1], d:+b[2] };
  }
  function isoOfKey(key){
    var p = keyParts(key);
    return isoDate(p.y, p.m, p.d);
  }
  function weekdayOfIso(iso){
    var p = isoToParts(iso);
    return new Date(Date.UTC(p.y, p.m-1, p.d)).getUTCDay();
  }
  function dayStartKey(iso){
    var p = isoToParts(iso);
    return keyOf(p.y, p.m, p.d, 0, 0);
  }
  function todayIso(){
    var p = stationNowParts();
    return isoDate(p.y, p.m, p.d);
  }
  function fmtTimeHM(h, mi){
    var ampm = h < 12 ? "AM" : "PM";
    var h12 = h % 12; if(h12 === 0) h12 = 12;
    return h12 + ":" + (mi<10?"0":"") + mi + " " + ampm;
  }
  function fmtStart(p){ return fmtTimeHM(p.sH, p.sMi); }
  function fmtEnd(p){ return fmtTimeHM(p.eH, p.eMi); }
  function fmtDur(min){
    if(min < 60) return min + " min";
    var h = Math.floor(min/60), m = min % 60;
    return h + " hr" + (m ? " " + m + " min" : "");
  }

  /* =====================================================================
     PARSER - the only way programming ever enters this page.
     Nothing downstream is allowed to invent, correct or summarise a row.
     A row that will not parse is skipped and reported, never guessed at.
     ===================================================================== */

  // RFC4180-style splitter: handles quoted fields, escaped quotes, CRLF.
  function parseCsvRows(text){
    var rows = [], row = [], field = '', inQuotes = false, i = 0;
    text = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    while(i < text.length){
      var c = text.charAt(i);
      if(inQuotes){
        if(c === '"'){
          if(text.charAt(i+1) === '"'){ field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if(c === '"'){ inQuotes = true; i++; continue; }
      if(c === ','){ row.push(field); field = ''; i++; continue; }
      if(c === '\n'){ row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += c; i++;
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    // Drop entirely blank lines.
    return rows.filter(function(r){
      return r.some(function(f){ return String(f).trim() !== ''; });
    });
  }

  // "9/28/25", "4-16-26", "9/21?25" (a typo where ? sits in for /)
  function parseLooseDate(s){
    var m = String(s || '').trim().match(/^(\d{1,2})[\/\-?](\d{1,2})[\/\-?](\d{2,4})$/);
    if(!m) return null;
    var mo = +m[1], d = +m[2], y = +m[3];
    if(y < 100) y += 2000;
    if(mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return { y:y, m:mo, d:d };
  }
  function fmtLooseDate(o){
    return o.m + '/' + o.d + '/' + String(o.y).slice(-2);
  }
  // "H:MM AM/PM" -> minutes from midnight
  function parseClock(s){
    var m = String(s || '').trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp])\.?[Mm]\.?$/);
    if(m){
      var h = +m[1], mi = +m[2];
      if(h < 1 || h > 12 || mi > 59) return null;
      if(m[3].toUpperCase() === 'A'){ if(h === 12) h = 0; }
      else { if(h !== 12) h += 12; }
      return h*60 + mi;
    }
    m = String(s || '').trim().match(/^(\d{1,2}):(\d{2})$/);
    if(m){
      var h24 = +m[1], mi24 = +m[2];
      if(h24 > 24 || mi24 > 59) return null;
      return (h24 % 24)*60 + mi24;
    }
    return null;
  }

  /* ---- Title normalization. All the rules live in this one block. ---- */

  function stripGfx(t){
    return t.replace(/\s+GFX\s*$/i, '').trim();
  }
  // Pull a trailing air date off the title. Greedy, so the LAST date wins.
  function splitTrailingDate(t){
    // The date can follow a space or a hyphen ("...vs Plattsburgh-11-4-2022")
    var m = t.match(/^(.*?)(?:\s+|\s*-\s*)(\d{1,2}[\/\-?]\d{1,2}[\/\-?]\d{2,4})\s*$/);
    if(!m) return { title:t, date:null };
    var d = parseLooseDate(m[2]);
    if(!d) return { title:t, date:null };
    return { title:m[1].trim(), date:d };
  }
  // "Senior Week Special", "SR Week", "SR week", "sr week" -> a badge
  var SENIOR_RE = /\s*\b(senior\s+week\s+special|sr\s+week)\b\s*/i;
  function stripSeniorWeek(t){
    if(!SENIOR_RE.test(t)) return { title:t, senior:false };
    return { title:t.replace(SENIOR_RE, ' ').replace(/\s+/g,' ').trim(), senior:true };
  }
  // Trailing production notes that are not part of the show name.
  var NOTE_RE = /\s+(re-?\s?recording|rerun|repeat)\s*$/i;

  // "SUNY Oswego Volleyball VS Alfred University" -> "Oswego State Volleyball vs. Alfred University"
  // "SUNY Oswego Volleyball VS Alfred invitational" -> "Oswego State Volleyball: Alfred Invitational"
  var EVENT_RE = /^SUNY\s+Oswego\s+(.+?)\s+VS\.?\s+(.+)$/i;
  var EVENT_NAME = 'Oswego State';
  // An opponent that names an event rather than a team reads badly after "vs.".
  var EVENT_NOT_TEAM_RE = /\b(invitational|tournament|tourney|classic|showcase|championships?|meet|open)\b/i;

  // Capitalise words that arrived all-lowercase; leave anything already cased.
  function titleCaseWords(s){
    return s.split(/\s+/).map(function(w){
      if(!w || /[A-Z]/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  function normalizeTitle(raw){
    var t = String(raw || '').replace(/\s+/g, ' ').trim();
    var badges = [], dateObj = null, isEvent = false;

    t = stripGfx(t);

    // A production note can sit after the air date ("... 10/22/25 re-recording"),
    // so it has to come off before the date is pulled.
    var note = null;
    var nm = t.match(NOTE_RE);
    if(nm){ note = nm[1].trim(); t = t.replace(NOTE_RE, '').trim(); }

    // "Title | 9/18/26" - the date after the pipe is the event date.
    var bar = t.indexOf('|');
    if(bar > -1){
      var right = t.slice(bar+1).trim();
      var rd = parseLooseDate(right);
      if(rd){ dateObj = rd; t = t.slice(0, bar).trim(); }
    }
    if(!dateObj){
      var sp = splitTrailingDate(t);
      if(sp.date){ dateObj = sp.date; t = sp.title; }
    }

    var sw = stripSeniorWeek(t);
    if(sw.senior){ badges.push('SENIOR WEEK'); t = sw.title; }

    var ev = t.match(EVENT_RE);
    if(ev){
      var sport = titleCaseWords(ev[1].trim());
      var opponent = titleCaseWords(ev[2].trim());
      t = EVENT_NOT_TEAM_RE.test(opponent)
        ? EVENT_NAME + ' ' + sport + ': ' + opponent
        : EVENT_NAME + ' ' + sport + ' vs. ' + opponent;
      isEvent = true;
    }

    t = t.replace(/\s+/g, ' ').trim();
    var canon = CANONICAL_TITLES[t.toLowerCase()];
    if(canon) t = canon;

    return { title:t, origAired:dateObj, badges:badges, isEvent:isEvent, note:note };
  }

  function categoryFor(title){
    for(var i = 0; i < CATEGORY_RULES.length; i++){
      if(CATEGORY_RULES[i].match.test(title)) return CATEGORY_RULES[i].cat;
    }
    return null; // caller falls back to DEFAULT_CAT and flags it
  }

  var REQUIRED_COLS = ['Program Start Date','Program Start Time','Program End Time','Program Title'];

  // Cablecast X-List CSV -> { programs, report }
  function parseStationCsv(text){
    var report = {
      dataRows: 0, parsed: 0, skipped: [], durMismatch: [], prodNotes: [],
      fillerRows: 0, fillerBlocks: 0, uncategorized: [], notes: [], fatal: null
    };
    var rows = parseCsvRows(text);
    if(!rows.length){ report.fatal = 'The file is empty.'; return { programs: [], report: report }; }

    // Header keys carry trailing spaces in the export ("Duration ", "Category ").
    var header = rows[0].map(function(h){ return String(h || '').trim(); });
    var idx = {};
    header.forEach(function(h, i){ if(!(h in idx)) idx[h] = i; });
    var missing = REQUIRED_COLS.filter(function(c){ return !(c in idx); });
    if(missing.length){
      report.fatal = 'This does not look like a Cablecast X-List export. Missing column(s): ' +
        missing.join(', ') + '. Found: ' + header.join(', ') + '.';
      return { programs: [], report: report };
    }
    var durCol = ('Duration' in idx) ? idx['Duration'] : -1;

    var cell = function(cols, name){
      var i = idx[name];
      return (i === undefined || cols[i] === undefined) ? '' : String(cols[i]).trim();
    };

    var programs = [];
    for(var r = 1; r < rows.length; r++){
      var cols = rows[r];
      var lineNo = r + 1;
      var dateStr = cell(cols, 'Program Start Date');
      var startStr = cell(cols, 'Program Start Time');
      var endStr = cell(cols, 'Program End Time');
      var rawTitle = cell(cols, 'Program Title');
      var desc = ('Program Description (optional)' in idx) ? cell(cols, 'Program Description (optional)') : '';

      if(!dateStr && !startStr && !rawTitle) continue;
      report.dataRows++;

      var d = parseLooseDate(dateStr);
      if(!d){ report.skipped.push({ line: lineNo, reason: 'Program Start Date "' + dateStr + '" is not M/D/YYYY', raw: rawTitle }); continue; }
      var sMin = parseClock(startStr);
      if(sMin === null){ report.skipped.push({ line: lineNo, reason: 'Program Start Time "' + startStr + '" is not H:MM AM/PM', raw: rawTitle }); continue; }
      var eMin = parseClock(endStr);
      if(eMin === null){ report.skipped.push({ line: lineNo, reason: 'Program End Time "' + endStr + '" is not H:MM AM/PM', raw: rawTitle }); continue; }
      if(!rawTitle){ report.skipped.push({ line: lineNo, reason: 'Program Title is blank', raw: '' }); continue; }

      // End time can roll past midnight: "11:30 PM" -> "12:00 AM" is +30 min,
      // and a 150-minute block starting 9:30 PM ends 12:00 AM the NEXT day.
      var startKey = keyOf(d.y, d.m, d.d, Math.floor(sMin/60), sMin%60);
      var endAbs = keyToAbsMin(startKey) - sMin + eMin + (eMin <= sMin ? 1440 : 0);
      var endKey = absMinToKey(endAbs);
      var durMin = endAbs - keyToAbsMin(startKey);
      if(durMin <= 0){
        report.skipped.push({ line: lineNo, reason: 'computed duration is ' + durMin + ' min', raw: rawTitle });
        continue;
      }

      // The Duration column is reliable; cross-check and report any mismatch.
      if(durCol > -1){
        var stated = parseInt(String(cols[durCol] || '').trim(), 10);
        if(!isNaN(stated) && stated !== durMin){
          report.durMismatch.push({ line: lineNo, raw: rawTitle, stated: stated, computed: durMin });
        }
      }

      var n = normalizeTitle(rawTitle);
      // Cablecast lists every newscast as "WTOP-10 NEWS". They're Nightly
      // News (and its reruns), except Friday 9:30 AM, which is Rise and
      // Shine Oswego (the Friday morning show, once called Morning News).
      if(n.title === 'WTOP-10 News'){
        n.title = (weekdayOfIso(isoDate(d.y, d.m, d.d)) === 5 && sMin === 570) ? 'Rise and Shine Oswego' : 'Nightly News';
      }
      var cat = categoryFor(n.title);
      if(cat === null){
        cat = DEFAULT_CAT;
        if(report.uncategorized.indexOf(n.title) < 0) report.uncategorized.push(n.title);
      }
      var isFiller = FILLER_RE.test(n.title);
      if(isFiller) report.fillerRows++;

      var ep = keyParts(endKey);
      programs.push({
        startKey: startKey,
        endKey: endKey,
        date: isoDate(d.y, d.m, d.d),
        sH: Math.floor(sMin/60), sMi: sMin % 60,
        eH: ep.h, eMi: ep.mi,
        durMin: durMin,
        title: n.title,
        rawTitle: rawTitle,
        origAired: n.origAired ? fmtLooseDate(n.origAired) : null,
        origAiredObj: n.origAired,
        desc: desc || null,
        cat: cat,
        badges: n.badges.slice(),
        isEvent: n.isEvent,
        prodNote: n.note,
        featured: false,
        nextAiring: null,
        filler: isFiller,
        url: null,
        line: lineNo
      });
      if(n.note) report.prodNotes.push({ line: lineNo, raw: rawTitle, note: n.note });
      report.parsed++;
    }

    programs.sort(function(a,b){ return a.startKey - b.startKey || a.endKey - b.endKey; });

    // Merge runs of back-to-back filler slates into one block.
    var merged = [];
    programs.forEach(function(p){
      var prev = merged[merged.length-1];
      if(p.filler && prev && prev.filler && prev.endKey === p.startKey){
        prev.endKey = p.endKey;
        prev.eH = keyParts(p.endKey).h;
        prev.eMi = keyParts(p.endKey).mi;
        prev.durMin = keyToAbsMin(p.endKey) - keyToAbsMin(prev.startKey);
        prev.mergedRows = (prev.mergedRows || 1) + 1;
        return;
      }
      merged.push(p);
    });
    report.fillerBlocks = merged.filter(function(p){ return p.filler; }).length;

    // Derived flags. A program is a premiere when its own air date is the date
    // it is airing; featured when it is long or is an event broadcast.
    merged.forEach(function(p){
      if(p.origAiredObj && isoDate(p.origAiredObj.y, p.origAiredObj.m, p.origAiredObj.d) === p.date){
        if(p.badges.indexOf('PREMIERE') < 0) p.badges.unshift('PREMIERE');
      }
      p.featured = !p.filler && (p.durMin >= FEATURED_MIN_MINUTES || p.isEvent);
    });

    // "Airs again": link each airing to the next airing of the same episode.
    // Two entries are the same episode when the normalized title and the
    // original air date both match, so a dated rerun never pairs with a
    // different week's episode of the same show.
    var episodes = {};
    merged.forEach(function(p){
      if(p.filler) return;
      var k = p.title + ' ' + (p.origAired || '');
      (episodes[k] = episodes[k] || []).push(p);
    });
    Object.keys(episodes).forEach(function(k){
      var list = episodes[k];
      for(var i = 0; i < list.length - 1; i++) list[i].nextAiring = list[i+1].startKey;
    });

    return { programs: merged, report: report };
  }


  // Shared with index.html (game banner) and guide.html (LIVE / REPLAY badges
  // and the "Next live sports broadcast" strip).
  // A game broadcast is live only on its first airing on its own date; later
  // airings that day, and airings on other days, are replays. "list" is the
  // parsed schedule the program came from.
  function isLiveAiring(p, list){
    if(!p || p.cat !== 'livesports' || p.badges.indexOf('PREMIERE') < 0) return false;
    for(var i = 0; i < list.length; i++){
      var q = list[i];
      if(q.startKey < p.startKey && q.title === p.title && q.origAired === p.origAired) return false;
    }
    return true;
  }

  var api = { isLiveAiring: isLiveAiring, STATION_TZ: STATION_TZ, HIDE_FILLER: HIDE_FILLER, FILLER_RE: FILLER_RE, FEATURED_MIN_MINUTES: FEATURED_MIN_MINUTES, ROLLING_WINDOW_HOURS: ROLLING_WINDOW_HOURS, UP_NEXT_COUNT: UP_NEXT_COUNT, SHOW_AIRS_AGAIN: SHOW_AIRS_AGAIN, CATEGORY_RULES: CATEGORY_RULES, DEFAULT_CAT: DEFAULT_CAT, CANONICAL_TITLES: CANONICAL_TITLES, SHOW_LINKS: SHOW_LINKS, SHOW_LOGOS: SHOW_LOGOS, CAT_LABELS: CAT_LABELS, CAT_ORDER: CAT_ORDER, DAYPARTS: DAYPARTS, DAY_NAMES_LONG: DAY_NAMES_LONG, DAY_NAMES_SHORT: DAY_NAMES_SHORT, MONTH_NAMES: MONTH_NAMES, stationFmt: stationFmt, stationNowParts: stationNowParts, keyOf: keyOf, keyParts: keyParts, keyToAbsMin: keyToAbsMin, absMinToKey: absMinToKey, addHoursToKey: addHoursToKey, nowKey: nowKey, nowAbsMin: nowAbsMin, isoDate: isoDate, isoToParts: isoToParts, isoOfKey: isoOfKey, weekdayOfIso: weekdayOfIso, dayStartKey: dayStartKey, todayIso: todayIso, fmtTimeHM: fmtTimeHM, fmtStart: fmtStart, fmtEnd: fmtEnd, fmtDur: fmtDur, parseCsvRows: parseCsvRows, parseLooseDate: parseLooseDate, fmtLooseDate: fmtLooseDate, parseClock: parseClock, stripGfx: stripGfx, splitTrailingDate: splitTrailingDate, SENIOR_RE: SENIOR_RE, stripSeniorWeek: stripSeniorWeek, NOTE_RE: NOTE_RE, EVENT_RE: EVENT_RE, EVENT_NAME: EVENT_NAME, EVENT_NOT_TEAM_RE: EVENT_NOT_TEAM_RE, titleCaseWords: titleCaseWords, normalizeTitle: normalizeTitle, categoryFor: categoryFor, REQUIRED_COLS: REQUIRED_COLS, parseStationCsv: parseStationCsv };
  if(typeof window !== 'undefined') window.WTOP_GUIDE_CORE = api;
  if(typeof module !== 'undefined') module.exports = api;
})();
