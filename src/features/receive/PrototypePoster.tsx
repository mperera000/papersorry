"use client";

import { motion, useReducedMotion } from "motion/react";
import { PaperSurface } from "@/features/landing/PaperSurface";
import { PeelSticker } from "@/features/receive/PeelSticker";
import type { Poster } from "@/lib/types";

const SAMPLE_POSTER: Poster = {
  id: "phase-0-sample",
  recipientName: "Sam",
  whatHappened: "I ate the last of the chips",
  vibe: "funny",
  messageText:
    "I owe you a new bag and possibly my dignity. Tap the stickers. Keep the vibe.",
  stickerPlacements: [
    { stickerId: "guilty-crumbs", x: 8, y: 58, rotation: -12 },
    { stickerId: "oops-note", x: 68, y: 12, rotation: 8 },
    { stickerId: "sorry-toast", x: 62, y: 62, rotation: -6 },
    { stickerId: "bandaid-heart", x: 12, y: 18, rotation: 14 },
  ],
  paperTheme: "warm-scrap",
  createdAt: new Date().toISOString(),
};

type PrototypePosterProps = {
  onRestart: () => void;
};

export function PrototypePoster({ onRestart }: PrototypePosterProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 pb-10 pt-6"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <p className="font-display text-center text-sm text-[var(--ink-muted)]">
        Sample keepsake for Phase 0 testing
      </p>

      <PaperSurface className="poster-sheet min-h-[420px] rounded-[2px] px-6 py-8 sm:px-8 sm:py-10">
        <p className="font-hand text-2xl text-[var(--accent)] leading-[1.15] pb-1">
          Dear {SAMPLE_POSTER.recipientName},
        </p>
        <h1 className="mt-3 font-display text-[1.85rem] leading-[1.12] tracking-tight text-[var(--ink)] sm:text-[2.1rem]">
          I ate the last of the chips.
        </h1>
        <p className="mt-4 max-w-[34ch] font-sans text-base leading-relaxed text-[var(--ink-soft)]">
          {SAMPLE_POSTER.messageText}
        </p>
        <p className="mt-6 font-hand text-xl text-[var(--ink)] leading-[1.15] pb-1">
          - your roommate who knows better
        </p>

        <div className="relative mt-4 min-h-[200px] w-full">
          {SAMPLE_POSTER.stickerPlacements.map((s) => (
            <PeelSticker key={s.stickerId} {...s} />
          ))}
        </div>
      </PaperSurface>

      <div className="flex flex-col gap-3">
        <p className="text-center text-sm leading-relaxed text-[var(--ink-muted)]">
          Tap stickers to peel. Tell the sender if you would keep this.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="btn-secondary mx-auto"
        >
          Open letter again
        </button>
      </div>
    </motion.div>
  );
}

export { SAMPLE_POSTER };
