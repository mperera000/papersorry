# PaperSorry — current state (context handoff)

**Last updated:** 2026-08-27 · **Figma:** [PaperSorry](https://www.figma.com/design/w1cATc0kFC3rN9HKLa4X0p/PaperSorry)

Use this file + `docs/FIGMA-NOTES.md` + `docs/FIGMA-HANDOFF.md` instead of long chat history.

---

## What works

| Route | Screen | Implementation |
|---|---|---|
| `/` | `Screen/Landing-Closed` `16:58` | Figma-exact 402×874 frame; component layers only (no full-screen PNG overlays) |
| `/create` | `Screen/Canvas-Decorate` `4:3` | Toolbar, Figma paper + send button, text prompt, stickers/memes from CMS, borders, delete |
| `/share/[id]` | `Screen/Share-Link-Ready` | HTML title + mailbox component + copy |
| `/p/[id]` | Receive closed → open | Envelope component → saved `canvasLayout` on paper |

`npm run lint && npm run build` pass.

---

## Key rules (do not regress)

1. **No duplicate overlays** — never use `public/design/*.png` full composites + HTML on top.
2. **Figma components + HTML text only** per `docs/FIGMA-HANDOFF.md`.
3. **Landing** uses exact Figma positions from frame `16:58` (do not “improve” layout).
4. **PM designs in Figma** — engineer implements; no invented aesthetics.

---

## Assets

- **Manifest:** `src/lib/figma-assets.ts`
- **On disk:** `public/figma/` (envelope, buttons, paper, mailbox, face SVGs, etc.)
- **Borders:** `public/figma/borders/border-{1-4}.svg` — placeholders (Figma MCP was rate-limited); replace with exports from Figma `Borders` frame when MCP available.
- **Deprecated:** `public/design/*.png` (unused)

---

## Recent UX (canvas + landing)

- **Landing hover:** white radial highlight on green wax (`::before` on `.ps-landing-create-hit`)
- **Send button:** pulled closer to paper (`margin-top: -0.65rem`)
- **Borders:** image overlay on paper via `src/lib/border-assets.ts` (not CSS `::after`)
- **Delete:** tap sticker/meme/text → selection bar with Delete / Done

---

## Data / setup (user still needs)

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_APP_URL
# Run supabase/schema.sql + migrations/001_canvas_layout.sql
npm run sync:assets          # optional: Google Sheet stickers/memes
npm run dev
```

Set `NEXT_PUBLIC_APP_URL` to a URL others can reach (deployed domain or your LAN IP for phone testing). Share links copy `/p/[id]` from that base — without it, dev shows `localhost:3000` which only works on your machine.

Posters store `canvas_layout` JSON: `{ textBlocks, assets, borderId }`.

---

## Open / PM decisions

- [ ] Replace border SVGs with exact Figma `Borders` frame exports
- [ ] Receive: peel stickers or static V1?
- [ ] Download keepsake scope
- [ ] WCAG gaps (script font, icon-only buttons, contrast) — see prior audit in chat

---

## File map

```
src/features/landing/LandingPage.tsx     # Figma landing components
src/features/poster-canvas/              # CreateCanvasPage, CanvasPaper, trays, delete
src/features/share/SharePageClient.tsx
src/features/receive/ReceivePageClient.tsx
src/lib/{types,canvas,figma-assets,border-assets,db/posters}.ts
docs/FIGMA-NOTES.md                      # flow source of truth
docs/FIGMA-HANDOFF.md                    # node IDs, asset paths, screen specs
docs/ASSET-CMS.md                        # Google Sheet → sync:assets
```

---

## Next prompt template

```
Read docs/STATE.md and docs/FIGMA-HANDOFF.md.
Task: [your request]
Do not change Figma layout unless I ask.
```
