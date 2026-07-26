# PaperSorry - Project Guide

Working name: **PaperSorry**. Scrapbook apology posters for tiny oopses between close friends.

Full plan: keep the vibe-check / build plan nearby. This file stays short.

## Roles
You are the engineer. The human is the product manager. Do not invent product scope.

## Stack
Next.js (App Router) + React + Tailwind v4 + Motion + Supabase (Phase 2+) + Vercel.

## Feature folders
`src/features/{landing,compose,poster-canvas,share,receive}` - keep screens, logic, and data access separate.

## Design
- Scrapbook / collage. Letter + poster MUST show paper texture.
- Accent: coral/rose only. No AI-purple. Prefer Outfit (not Inter).
- Dials: VARIANCE 9 / MOTION 7 / DENSITY 3. Honor `prefers-reduced-motion`.
- Stickers: original art only. Never scrape copyrighted memes.
- Skill: attach `design-taste-frontend` on UI work.

## House rules
- Think first; ask when unclear. Do not guess product choices.
- Simplest thing that works. Change only what was asked.
- Same name everywhere (`poster`, not "card" / "note").
- Sad paths: friendly message + way out. Log important actions (`docs/DEBUG-LOGGING.md`).
- Definition of done: works, lint/build green, names match, paper texture still present.

## Phases
0 prototype at `/` · then data · compose · canvas · share `/p/[id]` · receive · download · polish · deploy.
