import catalog from "@/data/asset-catalog.json";
import type { PosterVibe } from "@/lib/types";

export type AssetCategory = "stickers" | "memes";

export type AssetCatalogItem = {
  id: string;
  label: string;
  category: AssetCategory;
  sourceUrl: string;
  file: string | null;
  src: string | null;
  attribution: string;
  vibe: PosterVibe | null;
  enabled: boolean;
  notes: string;
};

export type AssetCatalog = {
  version: number;
  generatedAt: string;
  stickers: AssetCatalogItem[];
  memes: AssetCatalogItem[];
  enabled: {
    stickers: AssetCatalogItem[];
    memes: AssetCatalogItem[];
  };
};

const typedCatalog = catalog as AssetCatalog;

export function getAssetCatalog(): AssetCatalog {
  return typedCatalog;
}

export function getEnabledAssets(category: AssetCategory): AssetCatalogItem[] {
  return category === "memes"
    ? typedCatalog.enabled.memes
    : typedCatalog.enabled.stickers;
}

export function getAssetById(id: string): AssetCatalogItem | undefined {
  return (
    typedCatalog.stickers.find((a) => a.id === id) ??
    typedCatalog.memes.find((a) => a.id === id)
  );
}

export function getAllCatalogAssets(): AssetCatalogItem[] {
  return [...typedCatalog.stickers, ...typedCatalog.memes];
}
