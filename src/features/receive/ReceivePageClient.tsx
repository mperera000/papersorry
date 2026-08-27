"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { CanvasPaper } from "@/features/poster-canvas/CanvasPaper";
import { FIGMA_ASSETS } from "@/lib/figma-assets";
import { log } from "@/lib/log";
import type { Poster } from "@/lib/types";

type ReceivePageClientProps = {
  poster: Poster;
};

export function ReceivePageClient({ poster }: ReceivePageClientProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <main className="ps-shell ps-screen ps-receive-closed">
        <h1 className="ps-receive-closed__title">
          Click on the wax seal to open your letter.
        </h1>

        <button
          type="button"
          className="ps-receive-envelope"
          aria-label="Open letter — tap wax seal"
          onClick={() => {
            setOpen(true);
            log("info", {
              category: "receive",
              action: "envelope_opened",
              outcome: "ok",
              meta: { id: poster.id },
            });
          }}
        >
          <Image
            src={FIGMA_ASSETS.envelopeToOpen}
            alt=""
            width={342}
            height={236}
            priority
            className="ps-receive-envelope__img"
          />
        </button>

        <p className="ps-receive-closed__footer">
          <Link href="/">Make your own apology</Link>
        </p>
      </main>
    );
  }

  return (
    <main
      className="ps-shell ps-screen ps-receive-open"
      style={
        reduceMotion ? undefined : { animation: "fadeIn 400ms ease" }
      }
    >
      <CanvasPaper layout={poster.canvasLayout} interactive={false} />

      <button
        type="button"
        className="ps-download-btn"
        aria-label="Download keepsake — print"
        onClick={() => {
          log("info", {
            category: "receive",
            action: "download_tap",
            outcome: "ok",
            meta: { id: poster.id },
          });
          window.print();
        }}
      >
        <Image
          src={FIGMA_ASSETS.downloadIcon}
          alt=""
          width={48}
          height={48}
        />
      </button>

      <p className="ps-receive-open__footer">
        <Link href="/">Make your own</Link>
      </p>
    </main>
  );
}
