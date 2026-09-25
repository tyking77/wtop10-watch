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

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from "node:fs";
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
function frameStats(file) {
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-i", file, "-vf", "signalstats,metadata=print:file=-", "-f", "null", "-"], { encoding: "utf8" });
  const get = (k) => +((r.stdout || "").match(new RegExp("signalstats\\." + k + "=([\\d.]+)")) || [])[1] || 0;
  return { low: get("YLOW"), avg: get("YAVG") };
}
async function grabFrame(row, show, rel) {
  let url;
  try { url = await streamUrl(row.DeliveryID); } catch {}
  if (!url) return false;
  const dur = row.Duration || 0;
  const start = show.thumbAt >= 0 ? show.thumbAt : 45;
  const spread = dur ? [0.15, 0.3, 0.45, 0.6].map((f) => Math.round(dur * f)) : [start + 120, start + 300];
  const tries = [start, start + 30].concat(spread)
    .filter((t, i, a) => a.indexOf(t) === i && (!dur || t < dur - 5));
  mkdirSync(join(ROOT, THUMBS), { recursive: true });
  const out = join(ROOT, rel), tmp = out + ".try.jpg";
  let best = null;
  for (const t of tries) {
    const r = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(t), "-i", url, "-frames:v", "1",
      "-vf", "scale=" + FRAME_W + ":" + FRAME_H + ":force_original_aspect_ratio=increase,crop=" + FRAME_W + ":" + FRAME_H, "-q:v", "4", tmp], { timeout: 60000 });
    if (r.status !== 0 || !existsSync(tmp) || !statSync(tmp).size) continue;
    const st = frameStats(tmp);
    if (st.low >= 3 && st.avg >= 50) { writeFileSync(out, readFileSync(tmp)); best = null; break; }
    if (!best || st.avg > best.avg) { best = { avg: st.avg, bytes: readFileSync(tmp) }; }
  }
  if (best && best.avg >= 25) writeFileSync(out, best.bytes);
  rmSync(tmp, { force: true });
  return existsSync(out);
}

// "Fall 2026" from a folder named "NEWS Fall 2026"
function seasonOf(folderName) {
  const m = String(folderName || "").match(/\b(winter|spring|summer|fall)\s+(\d{4})\b/i);
  return m ? m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() + " " + m[2] : folderName || "";
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

// The show whose longest "match" phrase appears in the title wins
function showFor(title) {
  const t = " " + words(title) + " ";
  let best = null, bestLen = 0;
  for (const s of data.shows) {
    for (const phrase of [].concat(s.match || [])) {
      const p = words(phrase);
      if (p && t.includes(" " + p + " ") && p.length > bestLen) { best = s; bestLen = p.length; }
    }
  }
  return best;
}

// Strip the job number, the date, the show name and the station name
function cleanTitle(raw, show, dateText) {
  let t = raw.replace(/^\s*\d+-\d+-\s*/, "");
  if (dateText) t = t.replace(dateText, " ");
  const phrases = [show.title].concat(show.match || [], ["WTOP-10TV", "WTOP-10", "WTOP 10", "WTOP"])
    .map((p) => words(p)).filter(Boolean).sort((a, b) => b.length - a.length);
  for (const p of phrases) {
    const re = new RegExp("(^|[^a-z0-9])" + p.split(" ").join("[^a-z0-9]*") + "(?=$|[^a-z0-9])", "gi");
    t = t.replace(re, "$1");
  }
  return t.replace(/\s+/g, " ").replace(/^[\s\-–—|:,]+|[\s\-–—|:,]+$/g, "").trim();
}

const folders = (data.panoptoFolders || []).map(folderIdOf).filter(Boolean);
const episodes = [];
const report = [];
let failures = 0;

for (const folder of folders) {
  let rows;
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
    const ep = {
      show: show.id,
      date: d ? d.iso : uploadDate(row),
      title: cleanTitle(row.SessionName, show, d && d.text),
      panoptoId: row.DeliveryID,
      thumb: await thumbFor(row, show),
      duration: Math.round(row.Duration || 0),
      season: seasonOf(row.FolderName),
      folder
    };
    episodes.push(ep);
    report.push([row.SessionName, show.title, ep.title || "(date only)", ep.date + (d ? "" : " (upload date)")]);
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

if (REPORT) {
  console.log("\nRaw title | Show | Clean title | Date");
  for (const r of report) console.log(r.join(" | "));
}
