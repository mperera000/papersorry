"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { getSticker } from "@/features/poster-canvas/stickers";
import { log } from "@/lib/log";

type PeelStickerProps = {
  stickerId: string;
  x: number;
  y: number;
  rotation: number;
};

export function PeelSticker({
  stickerId,
  x,
  y,
  rotation,
}: PeelStickerProps) {
  const reduce = useReducedMotion();
  const [peeled, setPeeled] = useState(false);
  const sticker = getSticker(stickerId);

  if (!sticker) {
    return null;
  }

  return (
    <motion.button
      type="button"
      aria-label={`${peeled ? "Reset" : "Peel"} ${sticker.label} sticker`}
      className="absolute touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "22%",
        minWidth: 64,
        maxWidth: 104,
      }}
      initial={false}
      animate={
        reduce
          ? { opacity: peeled ? 0.35 : 1, rotate: rotation }
          : {
              opacity: peeled ? 0.2 : 1,
              y: peeled ? -18 : 0,
              rotate: peeled ? rotation + 18 : rotation,
              scale: peeled ? 0.92 : 1,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      onClick={() => {
        setPeeled((v) => !v);
        log("info", {
          category: "receive",
          action: "sticker_peel_toggle",
          outcome: "ok",
          meta: { stickerId, peeled: !peeled },
        });
      }}
    >
      {sticker.render("h-auto w-full drop-shadow-sm")}
    </motion.button>
  );
}
