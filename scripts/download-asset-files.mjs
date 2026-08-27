#!/usr/bin/env node
/**
 * Download sticker PNGs and meme GIFs from the asset CMS CSVs into public/.
 * Updates CSV rows with `file` + `enabled=TRUE` when a download succeeds.
 *
 * Usage: node scripts/download-asset-files.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CMS_DIR = path.join(ROOT, "data", "asset-cms");
const STICKERS_DIR = path.join(ROOT, "public", "stickers");
const MEMES_DIR = path.join(ROOT, "public", "memes");

/** OpenMoji PNGs — Flaticon sheet rows link to packs; these match each row's theme. */
const OPENMOJI_STICKERS = {
  "beg-icons": { file: "beg-pleading.png", codepoint: "1F97A" },
  "emoji-icons": { file: "emoji-grin.png", codepoint: "1F600" },
  "apologize-icons": { file: "apologize-hands.png", codepoint: "1F64F" },
  "sad-stickers-soulgie-1": { file: "sad-pensive.png", codepoint: "1F614" },
  "cute-stickers-soulgie": { file: "cute-pleading.png", codepoint: "1F97A" },
  "cute-stickers-rohim": { file: "cute-hearts.png", codepoint: "1F970" },
  "bear-stickers": { file: "bear.png", codepoint: "1F43B" },
  "love-romance-stickers": { file: "broken-heart.png", codepoint: "1F494" },
  "flower-stickers": { file: "flower.png", codepoint: "1F339" },
};

function openmojiUrl(codepoint) {
  return `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@15.1.0/color/618x618/${codepoint}.png`;
}

function giphyFallbackUrl(sourceUrl) {
  const match = sourceUrl.match(/\/([a-zA-Z0-9]+)\/giphy\.gif/);
  if (!match) return null;
  return `https://i.giphy.com/${match[1]}.gif`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }
  return rows;
}

function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(rows) {
  return `${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`;
}

function rowsToObjects(rows) {
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (cells[idx] ?? "").trim();
    });
    return obj;
  });
}

function objectsToRows(headers, objects) {
  return [headers, ...objects.map((obj) => headers.map((h) => obj[h] ?? ""))];
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function downloadStickers(rows) {
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const objects = rowsToObjects(rows);
  let count = 0;

  for (const row of objects) {
    if (row.category !== "stickers") continue;
    const spec = OPENMOJI_STICKERS[row.id];
    if (!spec) continue;

    const dest = path.join(STICKERS_DIR, spec.file);
    const url = openmojiUrl(spec.codepoint);
    try {
      const bytes = await download(url, dest);
      row.file = spec.file;
      row.enabled = "TRUE";
      if (!row.attribution.includes("OpenMoji")) {
        row.attribution = `${row.attribution}; sticker file: OpenMoji (CC BY-SA 4.0)`;
      }
      console.log(`✓ sticker ${row.id} → ${spec.file} (${bytes} bytes)`);
      count += 1;
    } catch (err) {
      console.warn(`✗ sticker ${row.id}: ${err.message}`);
    }
  }

  return { rows: objectsToRows(headers, objects), count };
}

async function downloadMemes(rows) {
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const objects = rowsToObjects(rows);
  let count = 0;
  let index = 0;

  for (const row of objects) {
    if (row.category !== "memes") continue;
    index += 1;
    const url = row.source_url?.trim();
    if (!url || !url.includes("giphy.com")) continue;

    const file = row.file?.trim() || `meme-${String(index).padStart(2, "0")}.gif`;
    const dest = path.join(MEMES_DIR, file);

    try {
      let bytes;
      try {
        bytes = await download(url, dest);
      } catch {
        const fallback = giphyFallbackUrl(url);
        if (!fallback) throw new Error("download failed");
        bytes = await download(fallback, dest);
      }
      row.file = file;
      row.enabled = "TRUE";
      console.log(`✓ meme ${row.id} → ${file} (${bytes} bytes)`);
      count += 1;
    } catch (err) {
      console.warn(`✗ meme ${row.id}: ${err.message}`);
    }
  }

  return { rows: objectsToRows(headers, objects), count };
}

async function main() {
  fs.mkdirSync(STICKERS_DIR, { recursive: true });
  fs.mkdirSync(MEMES_DIR, { recursive: true });

  const stickersPath = path.join(CMS_DIR, "stickers.csv");
  const memesPath = path.join(CMS_DIR, "memes.csv");

  const stickersRaw = parseCsv(fs.readFileSync(stickersPath, "utf8"));
  const memesRaw = parseCsv(fs.readFileSync(memesPath, "utf8"));

  console.log("Downloading stickers (OpenMoji placeholders for Flaticon pack rows)…");
  const stickers = await downloadStickers(stickersRaw);

  console.log("Downloading memes from Giphy URLs…");
  const memes = await downloadMemes(memesRaw);

  fs.writeFileSync(stickersPath, rowsToCsv(stickers.rows));
  fs.writeFileSync(memesPath, rowsToCsv(memes.rows));

  console.log(`\nDone: ${stickers.count} stickers, ${memes.count} memes`);
  console.log("Run: npm run sync:assets");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
