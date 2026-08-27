"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AssetTray } from "@/features/poster-canvas/AssetTray";
import {
  CanvasPaper,
  type CanvasSelection,
} from "@/features/poster-canvas/CanvasPaper";
import { CanvasDeleteButton } from "@/features/poster-canvas/CanvasDeleteButton";
import { TextPromptOverlay } from "@/features/poster-canvas/TextPromptOverlay";
import { BORDER_OPTIONS } from "@/lib/border-assets";
import { FIGMA_ASSETS } from "@/lib/figma-assets";
import { getEnabledAssets } from "@/lib/asset-catalog";
import {
  canvasHasContent,
  clampBorderScale,
  clampElementScale,
  BORDER_SCALE_MAX,
  BORDER_SCALE_MIN,
  ELEMENT_SCALE_MAX,
  ELEMENT_SCALE_MIN,
  promptFromTextBlocks,
  resolveScale,
  SCALE_STEP,
  textBlocksFromPrompt,
} from "@/lib/canvas";
import { log } from "@/lib/log";
import type { CanvasLayout } from "@/lib/types";
import { EMPTY_CANVAS } from "@/lib/types";

type Tool = "text" | "stickers" | "memes" | "borders" | null;

export function CreateCanvasPage() {
  const router = useRouter();
  const [layout, setLayout] = useState<CanvasLayout>(EMPTY_CANVAS);
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [showTextPrompt, setShowTextPrompt] = useState(false);
  const [selection, setSelection] = useState<CanvasSelection>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const promptValues = promptFromTextBlocks(layout.textBlocks);
  const stickerTray = getEnabledAssets("stickers").filter((a) => a.src);
  const memeTray = getEnabledAssets("memes").filter((a) => a.src);

  const selectionLabel =
    selection?.kind === "text"
      ? "Text selected"
      : selection?.kind === "border"
        ? "Border selected"
        : selection?.kind === "asset"
          ? layout.assets.find((a) => a.id === selection.id)?.kind === "meme"
            ? "Meme selected"
            : "Sticker selected"
          : "";

  const selectionScale =
    selection?.kind === "border"
      ? resolveScale(layout.borderScale)
      : selection?.kind === "text"
        ? resolveScale(
            layout.textBlocks.find((b) => b.id === selection.id)?.scale,
          )
        : selection?.kind === "asset"
          ? resolveScale(
              layout.assets.find((a) => a.id === selection.id)?.scale,
            )
          : 1;

  const scaleLimits =
    selection?.kind === "border"
      ? { min: BORDER_SCALE_MIN, max: BORDER_SCALE_MAX, step: 0.05 }
      : { min: ELEMENT_SCALE_MIN, max: ELEMENT_SCALE_MAX, step: SCALE_STEP };

  function deleteSelection() {
    if (!selection || selection.kind === "border") return;
    setLayout((prev) => {
      if (selection.kind === "text") {
        return {
          ...prev,
          textBlocks: prev.textBlocks.filter((b) => b.id !== selection.id),
        };
      }
      return {
        ...prev,
        assets: prev.assets.filter((a) => a.id !== selection.id),
      };
    });
    setSelection(null);
  }

  function resizeSelection(delta: number) {
    if (!selection) return;

    setLayout((prev) => {
      if (selection.kind === "border") {
        return {
          ...prev,
          borderScale: clampBorderScale(resolveScale(prev.borderScale) + delta),
        };
      }

      if (selection.kind === "text") {
        return {
          ...prev,
          textBlocks: prev.textBlocks.map((block) =>
            block.id === selection.id
              ? {
                  ...block,
                  scale: clampElementScale(resolveScale(block.scale) + delta),
                }
              : block,
          ),
        };
      }

      return {
        ...prev,
        assets: prev.assets.map((asset) =>
          asset.id === selection.id
            ? {
                ...asset,
                scale: clampElementScale(resolveScale(asset.scale) + delta),
              }
            : asset,
        ),
      };
    });
  }

  async function handleSend() {
    setNudge(null);
    if (!canvasHasContent(layout)) {
      setNudge("Add a line or sticker to your letter before sending.");
      return;
    }
    if (!promptValues.recipientName.trim() || !promptValues.whatHappened.trim()) {
      setNudge("Use the Text tool to add who it's for and what happened.");
      setShowTextPrompt(true);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/posters", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recipientName: promptValues.recipientName,
          whatHappened: promptValues.whatHappened,
          messageText: promptValues.messageText,
          vibe: "funny",
          canvasLayout: layout,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNudge(data.error ?? "Could not save. Try again.");
        log("warn", {
          category: "share",
          action: "poster_create_client",
          outcome: "fail",
          reason: data.error,
        });
        return;
      }
      log("info", {
        category: "share",
        action: "poster_create_client",
        outcome: "ok",
        meta: { id: data.poster?.id },
      });
      router.push(`/share/${data.poster.id}`);
    } catch {
      setNudge("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function addAsset(assetId: string, kind: "sticker" | "meme") {
    setLayout((prev) => ({
      ...prev,
      assets: [
        ...prev.assets,
        {
          id: crypto.randomUUID(),
          assetId,
          kind,
          x: 30 + Math.random() * 30,
          y: 40 + Math.random() * 30,
          rotation: Math.round((Math.random() - 0.5) * 20),
          scale: 1,
        },
      ],
    }));
    setSelection(null);
    setActiveTool(null);
  }

  return (
    <main className="ps-shell ps-screen ps-canvas-page">
      <div className="ps-toolbar" role="toolbar" aria-label="Decoration tools">
        {(
          [
            ["text", "Text"],
            ["stickers", "Stickers"],
            ["memes", "Memes"],
            ["borders", "Borders"],
          ] as const
        ).map(([tool, label]) => (
          <button
            key={tool}
            type="button"
            className={`ps-tool${activeTool === tool ? " ps-tool--active" : ""}`}
            aria-pressed={activeTool === tool}
            onClick={() => {
              setSelection(null);
              if (tool === "text") {
                setShowTextPrompt(true);
                setActiveTool("text");
              } else {
                setActiveTool(activeTool === tool ? null : tool);
                setShowTextPrompt(false);
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <CanvasPaper
        layout={layout}
        interactive
        selection={selection}
        onSelect={setSelection}
        onLayoutChange={setLayout}
      >
        {showTextPrompt ? (
          <TextPromptOverlay
            initial={promptValues}
            onCancel={() => setShowTextPrompt(false)}
            onDone={(input) => {
              setLayout((prev) => ({
                ...prev,
                textBlocks: textBlocksFromPrompt(input),
              }));
              setShowTextPrompt(false);
            }}
          />
        ) : null}
      </CanvasPaper>

      {selection ? (
        <CanvasDeleteButton
          label={selectionLabel}
          scaleLabel={`${Math.round(selectionScale * 100)}%`}
          canShrink={selectionScale > scaleLimits.min + 0.001}
          canGrow={selectionScale < scaleLimits.max - 0.001}
          onShrink={() => resizeSelection(-scaleLimits.step)}
          onGrow={() => resizeSelection(scaleLimits.step)}
          onDelete={selection.kind === "border" ? undefined : deleteSelection}
          onCancel={() => setSelection(null)}
        />
      ) : null}

      {activeTool === "stickers" ? (
        <AssetTray
          assets={stickerTray}
          onPick={(id) => addAsset(id, "sticker")}
          emptyMessage="No stickers yet — add rows in your Google Sheet, set enabled TRUE, and run npm run sync:assets."
        />
      ) : null}

      {activeTool === "memes" ? (
        <AssetTray
          assets={memeTray}
          onPick={(id) => addAsset(id, "meme")}
          emptyMessage="No memes yet — add GIFs to public/memes/, enable in sheet, and run npm run sync:assets."
        />
      ) : null}

      {activeTool === "borders" ? (
        <div className="ps-tray ps-tray--borders">
          <div className="ps-tray__grid ps-tray__grid--borders">
            {BORDER_OPTIONS.map((b) => (
              <button
                key={b.label}
                type="button"
                className={`ps-tray__item ps-tray__item--border${layout.borderId === b.id ? " ps-tray__item--active" : ""}`}
                aria-label={b.label}
                aria-pressed={layout.borderId === b.id}
                onClick={() => {
                  if (b.id === null) {
                    setLayout((prev) => ({
                      ...prev,
                      borderId: null,
                      borderScale: 1,
                    }));
                    setSelection(null);
                  } else {
                    setLayout((prev) => ({
                      ...prev,
                      borderId: b.id,
                      borderScale: prev.borderScale ?? 1,
                    }));
                    setSelection({ kind: "border" });
                  }
                  setActiveTool(null);
                }}
              >
                {b.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.src} alt="" className="ps-tray__border-preview" />
                ) : (
                  <span className="ps-tray__border-none">None</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {nudge ? <p className="ps-nudge" role="status">{nudge}</p> : null}

      <button
        type="button"
        className="ps-canvas-send"
        aria-label="Send apology letter"
        disabled={saving}
        onClick={handleSend}
      >
        <Image
          src={FIGMA_ASSETS.buttonSend}
          alt=""
          width={168}
          height={72}
          className="ps-canvas-send__img"
        />
        <span className="sr-only">{saving ? "Sending…" : "Send"}</span>
      </button>
    </main>
  );
}
