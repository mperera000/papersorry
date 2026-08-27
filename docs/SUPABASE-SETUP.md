# Supabase setup (Phase 2)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste `supabase/schema.sql`, run it.
3. Open **Project Settings → API**. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In `papersorry/`, copy `.env.example` to `.env.local` and paste those values.
5. Restart `npm run dev`.

Never commit `.env.local`. The anon key is public-facing; RLS policies control what it can do.

## Common mistakes

| Problem | Fix |
|---|---|
| Error: "Database is not set up yet" | Use **`.env.local`** (not `.env.file`). Restart the dev server after creating it. |
| Wrong URL | Use the project URL only, e.g. `https://abcdefgh.supabase.co` — **no** `/rest/v1/` suffix. |
| Wrong key name | Must be `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon or publishable key from Supabase → API). |
| Table missing | Run `supabase/schema.sql` in Supabase → SQL Editor. |
