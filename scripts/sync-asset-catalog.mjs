#!/usr/bin/env node
/**
 * Sync PaperSorry asset catalog from CSV (local or Google Sheet export).
 *
 * Usage:
 *   node scripts/sync-asset-catalog.mjs           # local data/asset-cms/*.csv
 *   node scripts/sync-asset-catalog.mjs --sheet   # pull public Google Sheet tabs
 *   node scripts/sync-asset-catalog.mjs --sheet --write-csv  # also update local CSV from sheet
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CMS_DIR = path.join(ROOT, "data", "asset-cms");
const OUT_FILE = path.join(ROOT, "src", "data", "asset-catalog.json");
const CONFIG_FILE = path.join(CMS_DIR, "sheet.config.json");

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

function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (cells[idx] ?? "").trim();
    });
    return obj;
  });
}

function parseBool(value) {
  const v = String(value ?? "").trim().toUpperCase();
  return v === "TRUE" || v === "YES" || v === "1";
}

function publicSrc(category, file) {
  if (!file) return null;
  const folder = category === "memes" ? "memes" : "stickers";
  return `/${folder}/${file}`;
}

function normalizeAsset(row) {
  const id = row.id?.trim();
  if (!id) return null;

  const rawCategory = row.category?.trim().toLowerCase();
  if (rawCategory !== "stickers" && rawCategory !== "memes") return null;

  const category = rawCategory;
  const file = row.file?.trim() || null;

  return {
    id,
    label: row.label?.trim() || id,
    category,
    sourceUrl: row.source_url?.trim() || row.sourceurl?.trim() || "",
    file,
    src: publicSrc(category, file),
    attribution: row.attribution?.trim() || "",
    vibe: row.vibe?.trim() || null,
    enabled: parseBool(row.enabled),
    notes: row.notes?.trim() || "",
  };
}

function readLocalCsv(filename) {
  const filePath = path.join(CMS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing CSV: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

async function fetchSheetCsv(sheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sheet export failed (${res.status}) gid=${gid}`);
  }
  return res.text();
}

function validateAssetHeaders(rows, source) {
  if (rows.length === 0) return;
  const first = rows[0][0]?.trim().toLowerCase();
  if (first !== "id") {
    console.warn(
      `⚠ ${source}: expected header row starting with "id". Got "${rows[0][0]}".`,
    );
    console.warn(
      "  Import templates from data/asset-cms/*.csv into your Google Sheet tabs.",
    );
  }
}

function buildCatalog(stickersRows, memesRows) {
  const stickers = stickersRows
    .map(normalizeAsset)
    .filter(Boolean)
    .filter((a) => a.category === "stickers");

  const memes = memesRows
    .map(normalizeAsset)
    .filter(Boolean)
    .filter((a) => a.category === "memes");

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    stickers,
    memes,
    enabled: {
      stickers: stickers.filter((a) => a.enabled),
      memes: memes.filter((a) => a.enabled),
    },
  };
}

async function main() {
  const fromSheet = process.argv.includes("--sheet");
  const writeCsvBack = process.argv.includes("--write-csv");
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

  let stickersText;
  let memesText;

  if (fromSheet) {
    console.log(`Pulling from Google Sheet ${config.sheetId}…`);
    [stickersText, memesText] = await Promise.all([
      fetchSheetCsv(config.sheetId, config.tabs.stickers.gid),
      fetchSheetCsv(config.sheetId, config.tabs.memes.gid),
    ]);

    if (writeCsvBack) {
      console.log("Writing sheet export back to data/asset-cms/*.csv");
      fs.writeFileSync(
        path.join(CMS_DIR, config.tabs.stickers.csvFile),
        stickersText,
      );
      fs.writeFileSync(
        path.join(CMS_DIR, config.tabs.memes.csvFile),
        memesText,
      );
    }
  } else {
    console.log("Reading local data/asset-cms/*.csv…");
    stickersText = readLocalCsv(config.tabs.stickers.csvFile);
    memesText = readLocalCsv(config.tabs.memes.csvFile);
  }

  const stickersParsed = parseCsv(stickersText);
  const memesParsed = parseCsv(memesText);

  validateAssetHeaders(stickersParsed, "Stickers tab");
  validateAssetHeaders(memesParsed, "Memes tab");

  const catalog = buildCatalog(
    rowsToObjects(stickersParsed),
    rowsToObjects(memesParsed),
  );

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`);

  console.log(`✓ Wrote ${OUT_FILE}`);
  console.log(
    `  Stickers: ${catalog.stickers.length} total, ${catalog.enabled.stickers.length} enabled`,
  );
  console.log(
    `  Memes: ${catalog.memes.length} total, ${catalog.enabled.memes.length} enabled`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
