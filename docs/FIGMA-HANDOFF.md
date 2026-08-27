# PaperSorry — Figma handoff

Design file: [PaperSorry](https://www.figma.com/design/w1cATc0kFC3rN9HKLa4X0p/PaperSorry) · Page: `Screens`

Flow reference: [`FIGMA-NOTES.md`](./FIGMA-NOTES.md)

---

## Implementation rule

**Use individual Figma components + HTML text — never full-screen frame PNGs as backgrounds with duplicate HTML on top.**

Deprecated pattern (removed): `public/design/*.png` full composites with overlaid titles, buttons, or copy.

---

## Exported assets (`public/figma/`)

| File | Figma node | Used on |
|---|---|---|
| `envelope-close.png` | `Envelope/close` `41:1749` | Landing background |
| `button-create.png` | `Button/Create` `41:1750` | Landing CTA |
| `canvas-paper.png` | `Canvas/Paper` `41:1752` | Create + Receive open |
| `toolbar.png` | `Toolbar` `41:1747` | Reference only* |
| `button-send.png` | `Button/Send` `41:1694` | Canvas send CTA |
| `mailbox.png` | `Mailbox` `54:2564` | Share screens |
| `envelope-to-open.png` | `Envelope to open` `41:1748` | Receive closed |
| `wax-open-button.png` | Wax seal (receive) | Reference / hotspot |
| `download-icon.png` | `downlaod icon` `58:34` | Receive open |
| `copy-icon.png` | Copy icon in mailbox | Share copy control |
| `link-icon.png` | Link icon in mailbox | Share link field |
| `tool-text.png` | `Tool/Text` `28:184` | Label reference |
| `tool-memes.png` | `Tool/Memes` `28:354` | Label reference |
| `tool-borders.png` | `Tool/Borders` `39:1242` | Label reference |

\*Toolbar MCP export returned label strip only; bordered toolbar buttons are built in CSS with Playfair Display to match `Screen/Canvas-Decorate`.

Manifest: `src/lib/figma-assets.ts`

Re-export: Figma MCP → `download_assets` on each component node @ 2× PNG.

---

## Screen specs

Frame size in Figma: **402 × 874** (mobile). App uses `max-width: 26rem` shell.

### `Screen/Landing-Closed` — `16:58` · route `/`

| Layer | Source | Notes |
|---|---|---|
| Background | `#f5f5f5` | CSS |
| Envelope | `envelope-close.png` | Clipped cover; no HTML duplicate |
| Title | HTML | “Send An” Inter Extra Light + “Apology” Alex Brush |
| CTA | `button-create.png` | Centered on flap intersection; `aria-label` only |

### `Screen/Canvas-Decorate` — `4:3` · route `/create`

| Layer | Source | Notes |
|---|---|---|
| Background | `#f5f5f5` | CSS |
| Toolbar | CSS grid | Text · Stickers · Memes · Borders (Playfair) |
| Paper | `canvas-paper.png` | Collage surface; draggable elements on top |
| Text prompt | HTML overlay | Matches `Screen/Text-Prompt` `63:42` purple panel |
| Send | `button-send.png` | Saves poster → `/share/[id]` |

### `Screen/Share-Link-Ready` — `54:2169` · route `/share/[id]`

| Layer | Source | Notes |
|---|---|---|
| Background | `#f5f5f5` | CSS |
| Title | HTML | “Send Your Apology” — Playfair Display 48px semibold |
| Mailbox | `mailbox.png` | Positioned per Figma offset (`left: -355px` on 402 frame) |
| Link field | HTML | White slot with `link-icon` + truncated URL |
| Copy | `copy-icon.png` button | Toggles copied badge |

Copied state: HTML badge “Link Copied” — do **not** swap to `share-copied.png` composite.

### `Screen/Receive-Envelope-Closed` — `41:1539` · route `/p/[id]`

| Layer | Source | Notes |
|---|---|---|
| Background | `#f5f5f5` | CSS |
| Instruction | HTML | Playfair 48px — single `<h1>`, no duplicate in image |
| Envelope | `envelope-to-open.png` | Whole envelope clickable |

### `Screen/Receive-Letter-Revealed` — `54:2599`

| Layer | Source | Notes |
|---|---|---|
| Background | `#f5f5f5` | CSS |
| Paper | `canvas-paper.png` + saved `canvasLayout` | Runtime content |
| Download | `download-icon.png` | Triggers print for V1 |

---

## Typography (Google Fonts)

| Role | Figma | Code variable |
|---|---|---|
| Display / headings | Playfair Display SemiBold | `--font-playfair` |
| Script title | Alex Brush | `--font-alex-brush` |
| Landing subline | Inter Extra Light | `--font-inter` |
| Body / canvas | Cormorant Garamond (fallback) | `--font-cormorant` |

---

## Interactions (unchanged)

See [`FIGMA-NOTES.md`](./FIGMA-NOTES.md) — landing green wax → create, purple send → share, mailbox copy, receive wax tap → reveal.

---

## Refresh checklist

1. `download_assets` on component nodes in Figma MCP
2. Save to `public/figma/` (keep filenames stable)
3. Visual check each route — no doubled text or buttons
4. `npm run lint && npm run build`
