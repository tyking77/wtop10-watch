// Helpers for adding Panopto folders to the watch page.
//
//   node scripts/folder-tools.mjs probe <folder link or id> [...]
//       Name, parent, and every video (title, length, upload date) in each
//       folder. Works on empty folders too.
//   node scripts/folder-tools.mjs sheet <show-id> [...] [--out file.jpg]
//       One image with the thumbnail of every episode of those shows, to
//       check the frames at a glance. Needs ffmpeg.
//   node scripts/folder-tools.mjs diff
//       Compares episodes.js with the last commit: new episodes, and any
//       existing episode whose show, title, date or season changed.

import { readFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "https://oswego.hosted.panopto.com";
const [cmd, ...args] = process.argv.slice(2);

function loadGlobal(src, name) {
  const ctx = { window: {} };
  vm.runInNewContext(src, ctx);
  return ctx.window[name];
}
const episodesNow = () => loadGlobal(readFileSync(join(ROOT, "episodes.js"), "utf8"), "WTOP_EPISODES");
const folderId = (s) => (String(s).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i) || [])[0];
const post = async (path, body) => {
  const res = await fetch(HOST + "/Panopto/Services/Data.svc/" + path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return (await res.json()).d;
};

async function probe() {
  for (const a of args) {
    const id = folderId(a);
    if (!id) { console.log(`\n${a}: no folder ID found`); continue; }
    let info = null, rows = [];
    try { info = await post("GetFolderInfo", { folderID: id }); } catch (e) { console.log(`\n${id}: name lookup failed (${e.message})`); }
    try {
      rows = (await post("GetSessions", { queryParameters: {
        query: null, sortColumn: 1, sortAscending: false, maxResults: 250, page: 0, folderID: id,
        getFolderData: true, includeArchived: true, includePlaylists: true } })).Results || [];
    } catch (e) { console.log(`${id}: video list failed (${e.message})`); }
    console.log(`\n${id}\n  ${info ? info.Name + "  (in " + info.ParentName + ")" : "(no name)"}  ${rows.length} videos` +
      (rows.length ? "" : "  <- empty, or not public yet"));
    for (const r of rows) {
      const up = new Date(+String(r.StartTime).match(/\d+/)[0]).toISOString().slice(0, 10);
      console.log(`  ${r.SessionName}  |  ${Math.round((r.Duration || 0) / 60)} min  |  uploaded ${up}`);
    }
    await new Promise((r) => setTimeout(r, 500)); // Panopto rate-limits bursts
  }
}

function sheet() {
  const outIdx = args.indexOf("--out");
  const out = outIdx >= 0 ? args[outIdx + 1] : join(ROOT, "contact-sheet.jpg");
  const ids = args.filter((a, i) => a !== "--out" && i !== outIdx + 1);
  const eps = episodesNow().filter((e) => ids.includes(e.show)).sort((a, b) => ids.indexOf(a.show) - ids.indexOf(b.show) || b.date.localeCompare(a.date));
  if (!eps.length) { console.log("No episodes for " + ids.join(", ")); return; }
  const tmp = mkdtempSync(join(tmpdir(), "sheet-"));
  eps.forEach((e, i) => {
    const png = join(tmp, String(i).padStart(3, "0") + ".png");
    const src = e.thumb && e.thumb.startsWith("thumbs/") && existsSync(join(ROOT, e.thumb)) ? join(ROOT, e.thumb) : null;
    spawnSync("ffmpeg", src ? ["-loglevel", "error", "-y", "-i", src, "-vf", "scale=256:144", png]
      : ["-loglevel", "error", "-y", "-f", "lavfi", "-i", "color=red:s=256x144", "-frames:v", "1", png]);
    console.log(String(i + 1).padStart(3) + "  " + e.show + "  " + e.date + "  " + (e.title || (e.episode ? "Episode " + e.episode : "")) + (src ? "" : "  <- no frame (red)"));
  });
  const cols = Math.min(6, eps.length), rowsN = Math.ceil(eps.length / cols);
  spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", "1", "-i", join(tmp, "%03d.png"),
    "-vf", `tile=${cols}x${rowsN}:padding=3:color=0x080e22`, "-frames:v", "1", out]);
  rmSync(tmp, { recursive: true, force: true });
  console.log("Wrote " + out + " (tiles numbered left to right, top to bottom)");
}

function diff() {
  const head = spawnSync("git", ["show", "HEAD:episodes.js"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64e6 });
  const before = new Map(loadGlobal(head.stdout || "", "WTOP_EPISODES").map((e) => [e.panoptoId, e]));
  const after = episodesNow();
  let changed = 0, added = 0;
  for (const e of after) {
    const o = before.get(e.panoptoId);
    if (!o) { added++; continue; }
    for (const k of ["show", "title", "date", "season"]) {
      if (o[k] !== e[k]) { changed++; console.log(`CHANGED ${e.panoptoId.slice(0, 8)} ${k}: ${JSON.stringify(o[k])} -> ${JSON.stringify(e[k])}`); }
    }
  }
  const gone = [...before.keys()].filter((id) => !after.some((e) => e.panoptoId === id));
  console.log(`${added} new, ${changed} changed field(s) on existing episodes, ${gone.length} gone (was ${before.size}, now ${after.length})`);
  for (const id of gone) console.log("GONE " + id + " " + before.get(id).show + " " + before.get(id).date);
}

if (cmd === "probe") await probe();
else if (cmd === "sheet") sheet();
else if (cmd === "diff") diff();
else console.log("Usage: node scripts/folder-tools.mjs probe <folder...> | sheet <show-id...> [--out file] | diff");
