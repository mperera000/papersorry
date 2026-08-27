"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { roleClass, resolveScale, clampBorderScale, clampElementScale } from "@/lib/canvas";
import { getBorderSrc } from "@/lib/border-assets";
import { getAssetById } from "@/lib/asset-catalog";
import { FIGMA_ASSETS } from "@/lib/figma-assets";
import type { CanvasLayout } from "@/lib/types";

export type CanvasSelection =
  | { kind: "text"; id: string }
  | { kind: "asset"; id: string }
  | { kind: "border" }
  | null;

type CanvasPaperProps = {
  layout: CanvasLayout;
  interactive?: boolean;
  selection?: CanvasSelection;
  onLayoutChange?: (layout: CanvasLayout) => void;
  onSelect?: (selection: CanvasSelection) => void;
  children?: React.ReactNode;
};

const DRAG_THRESHOLD_PX = 8;
const MIN_RESIZE_DISTANCE_PX = 24;

function CanvasResizeHandle({
  ariaLabel,
  className,
  counterScale = 1,
  onPointerDown,
}: {
  ariaLabel: string;
  className?: string;
  counterScale?: number;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <button
      type="button"
      className={`canvas-resize-handle${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
      style={{
        transform: counterScale === 1 ? undefined : `scale(${counterScale})`,
        transformOrigin: "bottom right",
      }}
      onPointerDown={onPointerDown}
    />
  );
}

export function CanvasPaper({
  layout,
  interactive = false,
  selection = null,
  onLayoutChange,
  onSelect,
  children,
}: CanvasPaperProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const borderSrc = getBorderSrc(layout.borderId);
  const borderScale = resolveScale(layout.borderScale);
  const isBorderSelected = selection?.kind === "border";

  const dragItem = useCallback(
    (
      kind: "text" | "asset",
      id: string,
      clientX: number,
      clientY: number,
      startX: number,
      startY: number,
      originX: number,
      originY: number,
    ) => {
      const paper = paperRef.current;
      if (!paper || !onLayoutChange) return;

      const rect = paper.getBoundingClientRect();
      const x = Math.min(92, Math.max(0, originX + ((clientX - startX) / rect.width) * 100));
      const y = Math.min(92, Math.max(0, originY + ((clientY - startY) / rect.height) * 100));

      if (kind === "text") {
        onLayoutChange({
          ...layout,
          textBlocks: layout.textBlocks.map((b) =>
            b.id === id ? { ...b, x, y } : b,
          ),
        });
      } else {
        onLayoutChange({
          ...layout,
          assets: layout.assets.map((a) =>
            a.id === id ? { ...a, x, y } : a,
          ),
        });
      }
    },
    [layout, onLayoutChange],
  );

  const resizeElementScale = useCallback(
    (kind: "text" | "asset", id: string, scale: number) => {
      if (!onLayoutChange) return;
      const clamped = clampElementScale(scale);

      if (kind === "text") {
        onLayoutChange({
          ...layout,
          textBlocks: layout.textBlocks.map((b) =>
            b.id === id ? { ...b, scale: clamped } : b,
          ),
        });
      } else {
        onLayoutChange({
          ...layout,
          assets: layout.assets.map((a) =>
            a.id === id ? { ...a, scale: clamped } : a,
          ),
        });
      }
    },
    [layout, onLayoutChange],
  );

  function bindResizeDrag(
    kind: "text" | "asset" | "border",
    id: string | null,
    originX: number,
    originY: number,
    originScale: number,
  ) {
    return interactive
      ? (e: React.PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const paper = paperRef.current;
          if (!paper || !onLayoutChange) return;

          const paperRect = paper.getBoundingClientRect();
          const anchorX =
            kind === "border"
              ? paperRect.left + paperRect.width / 2
              : paperRect.left + (originX / 100) * paperRect.width;
          const anchorY =
            kind === "border"
              ? paperRect.top + paperRect.height / 2
              : paperRect.top + (originY / 100) * paperRect.height;

          const startDist = Math.max(
            MIN_RESIZE_DISTANCE_PX,
            Math.hypot(e.clientX - anchorX, e.clientY - anchorY),
          );
          const startScale = originScale;

          const move = (ev: PointerEvent) => {
            const dist = Math.max(
              MIN_RESIZE_DISTANCE_PX,
              Math.hypot(ev.clientX - anchorX, ev.clientY - anchorY),
            );
            const nextScale = startScale * (dist / startDist);

            if (kind === "border") {
              onLayoutChange({
                ...layout,
                borderScale: clampBorderScale(nextScale),
              });
            } else {
              resizeElementScale(kind, id!, nextScale);
            }
          };

          const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
          };

          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }
      : undefined;
  }

  function bindDragSelect(
    kind: "text" | "asset",
    id: string,
    originX: number,
    originY: number,
  ) {
    return interactive
      ? (e: React.PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          let dragging = false;

          const move = (ev: PointerEvent) => {
            if (!dragging) {
              const dx = ev.clientX - startX;
              const dy = ev.clientY - startY;
              if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
              dragging = true;
            }
            dragItem(
              kind,
              id,
              ev.clientX,
              ev.clientY,
              startX,
              startY,
              originX,
              originY,
            );
          };

          const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            if (!dragging) {
              onSelect?.({ kind, id });
            }
          };

          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }
      : undefined;
  }

  return (
    <div className="ps-paper-wrap">
      <div
        ref={paperRef}
        className="ps-paper"
        id="poster-canvas"
        style={{ backgroundImage: `url("${FIGMA_ASSETS.canvasPaper}")` }}
        onPointerDown={
          interactive
            ? () => {
                onSelect?.(null);
              }
            : undefined
        }
      >
        {borderSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={`ps-paper__border${isBorderSelected ? " canvas-item--selected" : ""}`}
            src={borderSrc}
            alt=""
            aria-hidden
            style={{
              transform: `scale(${borderScale})`,
              transformOrigin: "center center",
            }}
          />
        ) : null}

        {isBorderSelected && interactive ? (
          <CanvasResizeHandle
            ariaLabel="Drag to resize border"
            className="canvas-resize-handle--border"
            onPointerDown={bindResizeDrag("border", null, 0, 0, borderScale)!}
          />
        ) : null}

        {layout.textBlocks.map((block) => {
          const isSelected =
            selection?.kind === "text" && selection.id === block.id;
          const scale = resolveScale(block.scale);

          return (
            <div
              key={block.id}
              className={`ps-canvas-item ${roleClass(block.role)}${isSelected ? " canvas-item--selected" : ""}`}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
              }}
              onPointerDown={bindDragSelect("text", block.id, block.x, block.y)}
            >
              <div
                className="ps-canvas-item__inner"
                style={{
                  transform: `rotate(${block.rotation}deg) scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                {block.content}
                {isSelected ? (
                  <CanvasResizeHandle
                    ariaLabel="Drag to resize text"
                    counterScale={1 / scale}
                    onPointerDown={bindResizeDrag(
                      "text",
                      block.id,
                      block.x,
                      block.y,
                      scale,
                    )!}
                  />
                ) : null}
              </div>
            </div>
          );
        })}

        {layout.assets.map((asset) => {
          const catalog = getAssetById(asset.assetId);
          const src = catalog?.src;
          const isMeme = asset.kind === "meme" || catalog?.category === "memes";
          const isSelected =
            selection?.kind === "asset" && selection.id === asset.id;
          const scale = resolveScale(asset.scale);

          return (
            <div
              key={asset.id}
              className={`ps-canvas-item ps-canvas-asset${isMeme ? " ps-canvas-asset--meme" : " ps-canvas-asset--sticker"}${isSelected ? " canvas-item--selected" : ""}`}
              style={{
                left: `${asset.x}%`,
                top: `${asset.y}%`,
              }}
              onPointerDown={bindDragSelect("asset", asset.id, asset.x, asset.y)}
            >
              <div
                className="ps-canvas-item__inner"
                style={{
                  transform: `rotate(${asset.rotation}deg) scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                {src ? (
                  isMeme ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={catalog?.label ?? asset.assetId}
                      className="ps-canvas-asset__img"
                      draggable={false}
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={catalog?.label ?? asset.assetId}
                      width={72}
                      height={72}
                      className="ps-canvas-asset__img"
                    />
                  )
                ) : (
                  <span className="ps-canvas-asset__fallback" aria-hidden>
                    ✦
                  </span>
                )}
                {isSelected ? (
                  <CanvasResizeHandle
                    ariaLabel={`Drag to resize ${isMeme ? "meme" : "sticker"}`}
                    counterScale={1 / scale}
                    onPointerDown={bindResizeDrag(
                      "asset",
                      asset.id,
                      asset.x,
                      asset.y,
                      scale,
                    )!}
                  />
                ) : null}
              </div>
            </div>
          );
        })}

        {children}
      </div>
    </div>
  );
}
