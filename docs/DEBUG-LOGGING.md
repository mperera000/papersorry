# Debug logging

Use `src/lib/log.ts` for app events. Keep it boring and consistent.

## Levels
- `info` - normal milestones (letter opened, poster loaded, link copied)
- `warn` - recoverable issues (sticker asset missing, empty message nudge)
- `error` - failures (save failed, fetch failed) with error message

## Categories
| Category | Use for |
|---|---|
| `landing` | Letter open / start compose |
| `compose` | Mad-libs steps |
| `canvas` | Sticker add / move |
| `share` | Save poster, copy link |
| `receive` | Load poster, peel sticker, download |
| `db` | Supabase create / fetch |

## Rules
- Log action name, outcome (`ok` / `fail`), and a short reason on fail.
- Never log secrets, tokens, or full env values.
- Prefer one log per user-visible milestone, not per frame of animation.
