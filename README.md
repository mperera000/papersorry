# PaperSorry

Funny, sincere paper apology posters for tiny oopses between close friends.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 0 test

1. Open the home page on your phone (same Wi‑Fi: use your computer's local IP).
2. Follow `docs/PHASE-0-TEST.md` and send to 10 close people.
3. Pass = at least 5 say they'd keep / smile / send one themselves.

## Supabase (Phase 2)

Follow `docs/SUPABASE-SETUP.md`, then:

```bash
curl -s http://localhost:3000/api/posters/smoke
```

Create a test poster:

```bash
curl -s -X POST http://localhost:3000/api/posters \
  -H 'content-type: application/json' \
  -d '{"recipientName":"Sam","whatHappened":"I ate the last of the chips","vibe":"funny","messageText":"I owe you a new bag.","stickerPlacements":[{"stickerId":"oops-note","x":60,"y":20,"rotation":8}]}'
```

Open `/p/<id>` from the response.

## Stack

Next.js · Tailwind v4 · Motion · Supabase · Vercel next

## Design

Visual design from Figma is implemented. **Assets:** Google Sheet CMS — `docs/ASSET-CMS.md` · `npm run sync:assets`.

## Routes

| Path | Screen |
|---|---|
| `/` | Landing — green wax → create |
| `/create` | Canvas — toolbar + Send |
| `/share/[id]` | Mailbox — copy link |
| `/p/[id]` | Receive — envelope → letter |

## Project guide

See `AGENTS.md` for house rules and folder layout.
