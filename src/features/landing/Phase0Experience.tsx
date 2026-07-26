"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { PaperSurface } from "@/features/landing/PaperSurface";
import { PrototypePoster } from "@/features/receive/PrototypePoster";
import { log } from "@/lib/log";

type Stage = "letter" | "poster";

export function Phase0Experience() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("letter");

  return (
    <div className="desk-bg relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 desk-wash" aria-hidden />

      <header className="relative z-[2] flex h-14 items-center justify-between px-4 sm:px-6">
        <span className="font-display text-lg tracking-tight text-[var(--ink)]">
          PaperSorry
        </span>
        <span className="rounded-md bg-[var(--paper-deep)]/70 px-2.5 py-1 font-sans text-xs font-medium text-[var(--ink-muted)]">
          Phase 0 test
        </span>
      </header>

      <AnimatePresence mode="wait">
        {stage === "letter" ? (
          <motion.main
            key="letter"
            className="relative z-[2] mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-lg flex-col justify-center px-4 pb-16 pt-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -20, rotate: -2 }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          >
            <button
              type="button"
              className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              aria-label="Open the apology letter"
              onClick={() => {
                setStage("poster");
                log("info", {
                  category: "landing",
                  action: "letter_opened",
                  outcome: "ok",
                });
              }}
            >
              <PaperSurface className="letter-sheet rotate-[-1.5deg] rounded-[2px] px-7 py-10 transition-transform duration-300 group-hover:rotate-[-0.5deg] group-active:scale-[0.985] sm:px-10 sm:py-12">
                <p className="font-hand text-lg text-[var(--accent)] leading-[1.15] pb-1">
                  for someone close
                </p>
                <h1 className="mt-3 max-w-[12ch] font-display text-4xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
                  Apologize To Someone
                </h1>
                <p className="mt-4 max-w-[28ch] font-sans text-base leading-relaxed text-[var(--ink-soft)]">
                  A funny, sincere paper keepsake for tiny oopses. Tap to open.
                </p>
                <span className="btn-primary mt-8 inline-flex">Open letter</span>
              </PaperSurface>
            </button>

            <p className="mt-8 text-center text-sm text-[var(--ink-muted)]">
              Send this page to 10 friends. Ask if they would keep it.
            </p>
          </motion.main>
        ) : (
          <motion.main
            key="poster"
            className="relative z-[2]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
          >
            <PrototypePoster onRestart={() => setStage("letter")} />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
