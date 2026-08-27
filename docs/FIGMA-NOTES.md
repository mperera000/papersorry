# PaperSorry — Figma notes (source of truth for flow)

Design file: [PaperSorry](https://www.figma.com/design/w1cATc0kFC3rN9HKLa4X0p/PaperSorry) · Page: `Screens`

Keep this file in sync with the Figma `Notes` page when the flow changes.

---

## Flow (happy path)

1. **`Screen/Landing-Closed`**
   - User sees closed envelope + “Send An Apology.”
   - **Tap green wax button** (`Button/Create`) → start a new letter.

2. **`Screen/Canvas-Decorate`**
   - **`Canvas/Paper`** is the collage surface — text, stickers, and memes all go **here**, placed freely by the user.
   - **Toolbar:** `Tool/Text` · `Tool/Stickers` · `Tool/Memes` · `Tool/Borders`
   - **Tap purple wax button** (`Button/Send`, label **Send**) → save poster → **`Screen/Share-Link-Ready`**.

3. **`Screen/Share-Link-Ready`**
   - User gets a shareable link (copy from mailbox UI).
   - **`Screen/Share-Link-Copied`** = success state after copy.

4. **Receive**
   - Friend opens `/p/[id]`.
   - **`Receive — Envelope closed`** → tap wax seal → **`Receive — Letter revealed`** shows their saved collage on `Canvas/Paper`.

There are **no separate compose screens** — all apology content is built on the parchment.

---

## Canvas model (confirmed)

Everything the user creates lives on **`Canvas/Paper`** as positioned elements:

| Element | How user adds it | On paper |
|---|---|---|
| **Text** | Tap `Tool/Text` → guided prompt → blocks dropped on paper | Draggable, editable |
| **Stickers** | Tap `Tool/Stickers` → pick from tray → tap to place | Draggable, rotatable |
| **Memes** | Tap `Tool/Memes` → pick from tray → tap to place | Draggable, rotatable |
| **Borders** | Tap `Tool/Borders` → pick style | Overlay on paper |

Saved layout is replayed exactly on receive.

---

## Text tool — Option B (confirmed)

Tap **`Tool/Text`** → open a **small prompt sheet** (modal / bottom sheet — design in Figma when ready).

Suggested fields:

| Field | Example placeholder | Becomes on paper |
|---|---|---|
| Who | Sam | `Dear Sam,` |
| What happened | I ate the last of the chips | Headline line |
| Message (optional) | I owe you a new bag… | Body paragraph |

On **Done**:
- Create **draggable text blocks** on `Canvas/Paper` at default positions (stacked top-left or centered).
- User can **move** (and later edit) each block on the parchment.
- Re-tapping `Tool/Text` can reopen the prompt to edit copy (implementation detail).

No blank free typing on first tap — prompts first, then placement.

---

## Toolbar (V1)

| Tool | Behavior |
|---|---|
| **Text** | Prompt sheet (Who / What / Message) → drop text blocks on `Canvas/Paper` |
| **Stickers** | Open sticker tray (asset CMS) → tap to place → drag on paper |
| **Memes** | Open meme tray (asset CMS) → tap to place → drag on paper |
| **Borders** | Pick border style → apply to paper |

Asset source: Google Sheet → `npm run sync:assets` → `docs/ASSET-CMS.md`.

---

## Frames — Figma status

| Frame | Status | Role |
|---|---|---|
| `Screen/Landing-Closed` | ✅ Designed | Home `/` |
| `Screen/Canvas-Decorate` | ✅ Designed | Create collage (empty paper + toolbar + Send) |
| `Screen/Share-Link-Ready` | ✅ Designed | Copy link |
| `Screen/Share-Link Copied` | ✅ Designed | Link copied state *(rename to `Screen/Share-Link-Copied`)* |
| `Receive — Envelope closed` | ✅ Designed | Friend landing on `/p/[id]` |
| `Receive — Letter revealed` | ⚠️ Partial | Needs sample collage on `Canvas/Paper` |
| `Example/Canvas-Messy-Sample` | ❌ Optional | One filled example for reference / receive mock |
| Text prompt sheet | ✅ Designed | `Screen/Text-Prompt` |

---

## Interactions (engineering)

### Landing → Canvas
- **Trigger:** tap `Button/Create` (green wax)
- **Action:** navigate to `/create` or canvas route
- **Animation:** optional; default = cut to `Screen/Canvas-Decorate`

### Canvas → Share
- **Trigger:** tap `Button/Send` (purple wax)
- **Action:** validate (at least one element on paper) → `POST /api/posters` → navigate to share
- **Empty paper:** friendly nudge — “Add a line or sticker before sending”

### Share
- **Trigger:** tap copy control on mailbox
- **Action:** copy `/p/[id]` → show `Screen/Share-Link-Copied`

### Receive
- **Trigger:** friend opens `/p/[id]`
- **Action:** `Receive — Envelope closed` → tap wax → animate → `Receive — Letter revealed` with saved `canvasElements`
- **Animation:** ~400–600ms; skip if `prefers-reduced-motion`

---

## Copy (confirmed)

| Element | Label |
|---|---|
| Green wax (landing) | *(icon only)* |
| Purple wax (canvas) | **Send** |
| Share | Copy via mailbox slot / icon |

---

## Open questions (PM)

- [ ] Receive: peel stickers on view, or static for V1?
- [ ] Download keepsake — V1 or later?
- [ ] Borders: one per poster, replaceable, or optional V1?
- [ ] Text prompt sheet visual — design frame in Figma?

---

## Data (engineering direction)

Posters will store free-form canvas layout (JSON), e.g. text blocks + sticker/meme placements with `x`, `y`, `rotation`. Existing `sticker_placements` may expand to `canvas_elements` when canvas phase is built.

---

## MCP handoff order

1. `Screen/Landing-Closed`
2. `Screen/Canvas-Decorate` (+ text prompt sheet when designed)
3. `Screen/Share-Link-Ready` + `Screen/Share-Link-Copied`
4. Receive frames + envelope animation

Asset paths and screen specs: [`FIGMA-HANDOFF.md`](./FIGMA-HANDOFF.md)

Figma: https://www.figma.com/design/w1cATc0kFC3rN9HKLa4X0p/PaperSorry

```
Implement Screen/Landing-Closed from Figma MCP.
Follow docs/FIGMA-NOTES.md. No design changes.
```
