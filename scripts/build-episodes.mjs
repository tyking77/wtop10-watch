// Builds episodes.js from the public Panopto folders listed in data.js.
//
//   node scripts/build-episodes.mjs            write episodes.js
//   node scripts/build-episodes.mjs --report   also print raw -> clean titles
//
// Panopto retired folder RSS, so this reads the same JSON the folder page
// uses (Data.svc/GetSessions). It works without a login for public folders.
// No dependencies: needs Node 18+ for fetch.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "episodes.js");
const REPORT = process.argv.includes("--report");

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

// "Fall 2026" from a folder named "NEWS Fall 2026"
function seasonOf(folderName) {
  const m = String(folderName || "").match(/\b(winter|spring|summer|fall)\s+(\d{4})\b/i);
  return m ? m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() + " " + m[2] : folderName || "";
}

// Air date from the title. Handles "September 23, 2026", "9/17/26", "2-16-26".
function dateFromTitle(t) {
  let m = t.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})\b/i);
  if (m) return { iso: m[3] + "-" + pad(MONTHS.indexOf(m[1].toLowerCase()) + 1) + "-" + pad(m[2]), text: m[0] };
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
      thumb: await resolveThumb(row),
      duration: Math.round(row.Duration || 0),
      season: seasonOf(row.FolderName),
      folder
    };
    episodes.push(ep);
    report.push([row.SessionName, show.title, ep.title || "(date only)", ep.date + (d ? "" : " (upload date)")]);
  }
}

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
