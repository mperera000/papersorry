"use client";

import Image from "next/image";
import type { AssetCatalogItem } from "@/lib/asset-catalog";

type AssetTrayProps = {
  assets: AssetCatalogItem[];
  onPick: (assetId: string) => void;
  emptyMessage: string;
};

export function AssetTray({ assets, onPick, emptyMessage }: AssetTrayProps) {
  const isMemes = assets.some((a) => a.category === "memes");

  if (assets.length === 0) {
    return (
      <div className="ps-tray">
        <p className="ps-tray__empty">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`ps-tray${isMemes ? " ps-tray--memes" : ""}`}>
      <div className="ps-tray__grid">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className="ps-tray__item ps-tray__item--image"
            aria-label={asset.label}
            title={asset.label}
            onClick={() => onPick(asset.id)}
          >
            {asset.src ? (
              <Image
                src={asset.src}
                alt=""
                width={isMemes ? 44 : 52}
                height={isMemes ? 44 : 52}
                unoptimized={asset.category === "memes"}
                className="ps-tray__thumb"
              />
            ) : (
              <span className="ps-tray__fallback">{asset.label.slice(0, 2)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
