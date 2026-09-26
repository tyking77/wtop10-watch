// Builds episodes.js from the public Panopto folders listed in data.js.
//
//   node scripts/build-episodes.mjs            write episodes.js
//   node scripts/build-episodes.mjs --report   also print raw -> clean titles
//
// Panopto retired folder RSS, so this reads the same JSON the folder page
// uses (Data.svc/GetSessions). It works without a login for public folders.
// No npm dependencies: needs Node 18+ for fetch.
//
// Thumbnails: if ffmpeg is installed, it saves a frame from inside each new
// episode to thumbs/<panoptoId>.jpg (the show's thumbAt, default 45 s),
// skipping dark frames. Without ffmpeg it falls back to Panopto's own
// first-frame thumbnail.

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "episodes.js");
const REPORT = process.argv.includes("--report");
const THUMBS = "thumbs";
const HAVE_FFMPEG = spawnSync("ffmpeg", ["-version"]).status === 0;

// data.js and episodes.js set globals on window, so run them in a sandbox
function loadGlobal(file, name) {
  if (!existsSync(file)) return undefined;
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(file, "utf8"), ctx, { filename: file });
  return ctx.window[name];
}

const data = loadGlobal(join(ROOT, "data.js"), "WTOP");
const HOST = (data.panoptoHost || "https://oswego.hosted.panopto.com").replace(/\/$/, "");
const previous = loadGlobal(OUT, "WTOP_EPISODES") || [];

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const pad = (n) => String(n).padStart(2, "0");
const words = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function folderIdOf(entry) {
  const m = String(entry).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return m && m[0].toLowerCase();
}

async function getSessions(folderID) {
  const rows = [];
  for (let page = 0; page < 20; page++) {
    const res = await fetch(HOST + "/Panopto/Services/Data.svc/GetSessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryParameters: {
        query: null, sortColumn: 1, sortAscending: false, maxResults: 100, page,
        startDate: null, endDate: null, folderID, bookmarked: false, getFolderData: true,
        isSharedWithMe: false, isSubscriptionsPage: false, includeArchived: true, includePlaylists: true
      } })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const d = (await res.json()).d;
    if (!d || !Array.isArray(d.Results)) throw new Error("unexpected response");
    rows.push(...d.Results);
    if (!d.Results.length || rows.length >= d.TotalNumber) break;
  }
  return rows;
}

// Thumbnails: Panopto's ThumbUrl redirects to a stable CloudFront image.
// Store the final address, and reuse it from the last run when we have it.
// Panopto uses the first frame, so a video that opens on black gets a black
// thumbnail. Those JPEGs are tiny (about 2 KB), so anything under 4 KB is
// dropped and the card falls back to the show's still.
const BLACK_BYTES = 4000;
const oldThumb = new Map(previous.map((e) => [e.panoptoId, e.thumb]));
async function resolveThumb(row) {
  if (oldThumb.get(row.DeliveryID)) return oldThumb.get(row.DeliveryID);
  const url = HOST + "/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=" + row.DeliveryID + "&mode=Delivery&usePng=False";
  try {
    const res = await fetch(url);
    const bytes = (await res.arrayBuffer()).byteLength;
    if (!res.ok) return "";
    if (bytes < BLACK_BYTES) return "";
    return res.url;
  } catch {
    return "";
  }
}

// Our own thumbnail: a frame from inside the video. The first try is the
// show's thumbAt; if that frame is dark (a black frame or a slate), try
// 30 s later, then points spread through the whole video (some recordings
// run black for several minutes). Dark means the darkest tenth of the frame
// is near black or the frame is dim overall. If every try is dark, keep the
// brightest unless it is nearly black; then save nothing, so the page shows
// its branded placeholder and the next run tries again.
//
// Shows with thumbFind: "game" (game broadcasts; "ice" works too) want game action, not the
// pregame desk or an intermission graphic, and pregame length varies. For
// those, try thumbAt and then points from 30% to 75% of the video, and keep
// the first frame that looks like a rink or court: a bright lower half (the
// ice or floor) at least 40 points brighter than the top third (the stands). If none does,
// fall back to the first frame that passes the brightness check.
const FRAME_W = 960, FRAME_H = 540;
async function streamUrl(deliveryId) {
  const res = await fetch(HOST + "/Panopto/Pages/Viewer/DeliveryInfo.aspx", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "deliveryId=" + deliveryId + "&isEmbed=true&responseType=json"
  });
  const d = (await res.json()).Delivery || {};
  const s = (d.PodcastStreams || [])[0] || (d.Streams || [])[0];
  return s && s.StreamUrl;
}
function frameStats(file, crop) {
  const vf = (crop ? "crop=" + crop + "," : "") + "signalstats,metadata=print:file=-";
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-i", file, "-vf", vf, "-f", "null", "-"], { encoding: "utf8" });
  const get = (k) => +((r.stdout || "").match(new RegExp("signalstats\\." + k + "=([\\d.]+)")) || [])[1] || 0;
  return { low: get("YLOW"), avg: get("YAVG") };
}
function looksLikeIce(file) {
  const bottom = frameStats(file, "iw:ih*0.5:0:ih*0.5").avg;
  const top = frameStats(file, "iw:ih*0.33:0:0").avg;
  return bottom >= 125 && bottom - top >= 40;
}
async function grabFrame(row, show, rel) {
  let url;
  try { url = await streamUrl(row.DeliveryID); } catch {}
  if (!url) return false;
  const dur = row.Duration || 0;
  const start = show.thumbAt >= 0 ? show.thumbAt : 45;
  const ice = show.thumbFind === "game" || show.thumbFind === "ice";
  // A recording left running for hours after a game would send the search
  // into dead air, so game searches assume at most 4 hours
  const span = ice ? Math.min(dur, 4 * 3600) : dur;
  const spread = !dur ? [start + 120, start + 300]
    : (ice ? [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75] : [0.15, 0.3, 0.45, 0.6]).map((f) => Math.round(span * f));
  const tries = (ice ? [start] : [start, start + 30]).concat(spread)
    .filter((t, i, a) => a.indexOf(t) === i && (!dur || t < dur - 5));
  mkdirSync(join(ROOT, THUMBS), { recursive: true });
  const out = join(ROOT, rel), tmp = out + ".try.jpg";
  let best = null, fallback = null;
  for (const t of tries) {
    const r = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(t), "-i", url, "-frames:v", "1",
      "-vf", "scale=" + FRAME_W + ":" + FRAME_H + ":force_original_aspect_ratio=increase,crop=" + FRAME_W + ":" + FRAME_H, "-q:v", "4", tmp], { timeout: 60000 });
    if (r.status !== 0 || !existsSync(tmp) || !statSync(tmp).size) continue;
    const st = frameStats(tmp);
    const bright = st.low >= 3 && st.avg >= 50;
    if (ice) {
      if (bright && looksLikeIce(tmp)) { writeFileSync(out, readFileSync(tmp)); best = fallback = null; break; }
      if (bright && !fallback) fallback = readFileSync(tmp);
      if (!best || st.avg > best.avg) best = { avg: st.avg, bytes: readFileSync(tmp) };
      continue;
    }
    if (bright) { writeFileSync(out, readFileSync(tmp)); best = null; break; }
    if (!best || st.avg > best.avg) { best = { avg: st.avg, bytes: readFileSync(tmp) }; }
  }
  if (fallback) writeFileSync(out, fallback);
  else if (best && best.avg >= 25 && !existsSync(out)) writeFileSync(out, best.bytes);
  rmSync(tmp, { force: true });
  return existsSync(out);
}

// "Fall 2026" from a folder named "NEWS Fall 2026", or "Season 5" from
// "Entertainment Breach: Season 5"
// Sports: "Oswego Men's Hockey 2026-27" gives "2026–27". A sports folder
// with no years in its name takes the season from the game's date, August
// to July (a January 2026 game is 2025–26).
function seasonOf(folderName, iso) {
  const f = String(folderName || "");
  let m = f.match(/\b(winter|spring|summer|fall)\s+(\d{4})\b/i);
  if (m) return m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() + " " + m[2];
  m = f.match(/\bseason\s*(\d+)\b/i);
  if (m) return "Season " + m[1];
  // "Hockey Night in Oswego Classics": older games, one season of their own
  if (/\bclassics?\b/i.test(f)) return "Classics";
  m = f.match(/\b(20\d\d)\s*[-–\/]\s*(\d{2}|20\d\d)\b/);
  if (m) return m[1] + "–" + m[2].slice(-2);
  const y = +String(iso).slice(0, 4), mo = +String(iso).slice(5, 7);
  if (y && mo) { const start = mo >= 8 ? y : y - 1; return start + "–" + String(start + 1).slice(-2); }
  return f;
}

// "Men's Ice Hockey" -> "Hockey", "Women's Basketball" -> "Basketball (W)"
function sportLabel(t) {
  return t.replace(/\b(Men|Women)[’']s\s+(?:Ice\s+)?([A-Za-z]+)/g, (m, who, sport) => (who === "Women" ? sport + " (W)" : sport));
}

// Episode number from "S5 Ep.1", "S5E1", "Ep 3" or "Episode 3"
function episodeOf(t) {
  const m = t.match(/\bS\d+\s*E(?:p|pisode)?\.?\s*(\d+)\b/i) || t.match(/\bEp(?:isode)?\.?\s*(\d+)\b/i);
  return m ? { n: +m[1], text: m[0] } : null;
}

// Air date from the title. Handles "September 23, 2026", "Sept. 24th 2026",
// "9/17/26" and "2-16-26".
function dateFromTitle(t) {
  let m = t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/i);
  if (m) return { iso: m[3] + "-" + pad(MONTHS.findIndex((x) => x.startsWith(m[1].toLowerCase())) + 1) + "-" + pad(m[2]), text: m[0] };
  m = t.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2}|\d{4})\b/);
  if (m && +m[1] <= 12 && +m[2] <= 31) {
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    return { iso: y + "-" + pad(m[1]) + "-" + pad(m[2]), text: m[0] };
  }
  return null;
}

function uploadDate(row) {
  const ms = +String(row.StartTime).match(/-?\d+/)[0];
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date(ms));
}

// The show whose longest phrase (its title or a "match" word) appears in
// the Panopto title wins
function showFor(title) {
  const t = " " + words(title) + " ";
  let best = null, bestLen = 0;
  for (const s of data.shows) {
    for (const phrase of [s.title].concat(s.match || [])) {
      const p = words(phrase);
      if (p && t.includes(" " + p + " ") && p.length > bestLen) { best = s; bestLen = p.length; }
    }
  }
  return best;
}

// Strip the job number, the date, the show name and the station name
function cleanTitle(raw, show, cut) {
  let t = raw.replace(/^\s*\d+-\d+-\s*/, "");
  // Game broadcasts: "SUNY Oswego Men's Ice Hockey vs ..." -- the school name
  // goes; the sport goes with the show's match words
  t = t.replace(/^\s*SUNY\s+Oswego\s+(?=(Men|Women)[’']s\b)/i, "");
  if (show.thumbFind) t = t.replace(/^\s*(SUNY\s+)?Oswego\s+(State\s+)?/i, "");
  for (const c of cut) if (c) t = t.replace(c, " ");
  const phrases = [show.title].concat(show.match || [], ["WTOP-10TV", "WTOP-10", "WTOP 10", "WTOP"])
    .map((p) => words(p)).filter(Boolean).sort((a, b) => b.length - a.length);
  for (const p of phrases) {
    const re = new RegExp("(^|[^a-z0-9])" + p.split(" ").join("[^a-z0-9]*") + "(?=$|[^a-z0-9])", "gi");
    t = t.replace(re, "$1");
  }
  t = t.replace(/\s+/g, " ").replace(/^[\s\-–—|:,]+|[\s\-–—|:,]+$/g, "").trim();
  // A season marker left in front of words: "S1 Finale" -> "Finale"
  t = t.replace(/^S\d+\s+(?=[a-z])/i, "");
  // Game titles: "Men's Ice Hockey @ Hobart _ SUNYAC Championship" ->
  // "Men's Ice Hockey at Hobart: SUNYAC Championship"
  t = t.replace(/(^|\s)@\s+/g, "$1at ").replace(/\bvs\b\.?/gi, "vs.");
  const parts = t.split(/\s*_\s*/).map((x) => x.trim()).filter(Boolean);
  t = parts.length > 1 ? parts[0] + ": " + parts.slice(1).join(", ") : parts[0] || "";
  // An event, not an opponent: "vs. Alfred Invitational" -> "Alfred Invitational"
  t = t.replace(/^vs\.\s+(?=[^:]*\b(invitational|tournament|tourney|classic|showcase|championships?|meet|open)\b)/i, "");
  return sportLabel(t);
}

const folders = (data.panoptoFolders || []).map(folderIdOf).filter(Boolean);
const episodes = [];
const report = [];
let failures = 0;

for (const folder of folders) {
  let rows;
  // Panopto answers HTTP 429 (too many requests) to rapid-fire runs, so
  // space the folder requests out a little
  await new Promise((r) => setTimeout(r, 400));
  try {
    rows = await getSessions(folder);
  } catch (err) {
    failures++;
    const kept = previous.filter((e) => e.folder === folder);
    console.warn(`! Folder ${folder}: ${err.message}. Keeping ${kept.length} episodes from the last good run.`);
    episodes.push(...kept);
    continue;
  }
  console.log(`Folder ${folder}: ${rows.length} sessions (${rows[0] ? rows[0].FolderName : "empty"})`);
  for (const row of rows) {
    if (!row.DeliveryID) continue;
    const show = showFor(row.SessionName);
    if (!show) {
      console.warn(`! No show matches "${row.SessionName}". Add a match word to a show in data.js.`);
      report.push([row.SessionName, "(no show: skipped)", "", ""]);
      continue;
    }
    const d = dateFromTitle(row.SessionName);
    const num = episodeOf(row.SessionName);
    const ep = {
      show: show.id,
      date: d ? d.iso : uploadDate(row),
      title: cleanTitle(row.SessionName, show, [d && d.text, num && num.text]),
      panoptoId: row.DeliveryID,
      thumb: await thumbFor(row, show),
      duration: Math.round(row.Duration || 0),
      season: seasonOf(row.FolderName, ((data.overrides || {})[row.DeliveryID] || {}).date || (d ? d.iso : uploadDate(row))),
      folder
    };
    // No air date in the title: the date is only the upload date, which is
    // fine for ordering but misleading to show
    if (!d) ep.undated = true;
    if (num) ep.episode = num.n;
    episodes.push(ep);
    report.push([row.SessionName, show.title, ep.title || (num ? "Episode " + num.n : "(date only)"), ep.season, ep.date + (d ? "" : " (upload date)")]);
  }
}

async function thumbFor(row, show) {
  const rel = THUMBS + "/" + row.DeliveryID + ".jpg";
  if (!existsSync(join(ROOT, rel)) && HAVE_FFMPEG) {
    if (await grabFrame(row, show, rel)) console.log(`  saved ${rel} (${row.SessionName})`);
  }
  return existsSync(join(ROOT, rel)) ? rel : resolveThumb(row);
}

if (!HAVE_FFMPEG) console.warn("! ffmpeg not found: using Panopto's thumbnails instead of our own frames.");

if (folders.length && failures === folders.length && !previous.length) {
  console.error("Every folder failed and there is no previous data. Not writing episodes.js.");
  process.exit(1);
}

const seen = new Set();
const out = episodes
  .filter((e) => !seen.has(e.panoptoId) && seen.add(e.panoptoId))
  .sort((a, b) => b.date.localeCompare(a.date) || a.panoptoId.localeCompare(b.panoptoId));

writeFileSync(OUT,
  "/* Generated by scripts/build-episodes.mjs from the Panopto folders in data.js.\n" +
  "   Do not edit: changes are overwritten. Fix an episode with \"overrides\" in data.js. */\n" +
  "window.WTOP_EPISODES = " + JSON.stringify(out, null, 2) + ";\n");
console.log(`Wrote ${out.length} episodes to episodes.js`);

// Remove frames for videos that left the folders (deleted or re-uploaded).
// Only when every folder loaded, so an outage never deletes anything.
if (!failures && existsSync(join(ROOT, THUMBS))) {
  const used = new Set(out.map((e) => e.thumb));
  for (const f of readdirSync(join(ROOT, THUMBS))) {
    if (/\.jpg$/.test(f) && !used.has(THUMBS + "/" + f)) {
      rmSync(join(ROOT, THUMBS, f));
      console.log(`  removed unused ${THUMBS}/${f}`);
    }
  }
}

if (REPORT) {
  console.log("\nRaw title | Show | Shown as | Season | Date");
  for (const r of report) console.log(r.join(" | "));
}
