# PaperSorry - Project Guide

Working name: **PaperSorry**. Scrapbook apology posters for tiny oopses between close friends.

Full plan: keep the vibe-check / build plan nearby. This file stays short.

## Roles
You are the engineer. The human is the product manager **and designer (Figma)**. Do not invent product scope or visual design.

## Stack
Next.js (App Router) + React + Tailwind v4 + Motion + Supabase (Phase 2+) + Vercel.

## Feature folders
`src/features/{landing,compose,poster-canvas,share,receive}` - keep screens, logic, and data access separate.

## Design
- **Figma owns all visual design.** Do not attach `design-taste-frontend` or invent aesthetics.
- Current UI implements Figma screens (landing, canvas, share, receive). Figma MCP can refine pixel-perfect assets when connected.
- Implement Figma specs pixel-faithfully. Ask if spacing/colors are missing from the handoff.
- Stickers/memes: catalog in Google Sheet → `npm run sync:assets` → `src/data/asset-catalog.json`. See `docs/ASSET-CMS.md`. Legacy SVG placeholders in `stickers.tsx` until canvas is wired.
- Honor `prefers-reduced-motion` when adding motion from Figma interaction notes.

## House rules
- Think first; ask when unclear. Do not guess product choices.
- Simplest thing that works. Change only what was asked.
- Same name everywhere (`poster`, not "card" / "note").
- Sad paths: friendly message + way out. Log important actions (`docs/DEBUG-LOGGING.md`).
- Definition of done: works, lint/build green, names match, no unsolicited design changes.

## Data
Posters in Supabase (`supabase/schema.sql`). Create/fetch via `src/lib/db/posters.ts` and `/api/posters`. Setup: `docs/SUPABASE-SETUP.md`.

## Phases
0 prototype at `/` · 1 setup · 2 data (done when Supabase wired) · compose · canvas · share `/p/[id]` · receive · download · polish · deploy.

## Figma handoff
Design + flow notes: `docs/FIGMA-NOTES.md` (sync with Figma `Notes` page).
**Current build state:** `docs/STATE.md` — read this first in new chats to avoid replaying history.

**V1 flow:** Landing → **Canvas/Paper** (free collage: text via prompt sheet, stickers, memes, borders) → Send wax → Share link → Receive (envelope opens to saved collage). Details: `docs/FIGMA-NOTES.md`.

Per screen: Figma MCP link to named frame. Match exactly; no design changes.
