-- PaperSorry Phase 2: posters table
-- Run this in Supabase → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

create table if not exists public.posters (
  id uuid primary key default gen_random_uuid(),
  recipient_name text not null,
  what_happened text not null,
  vibe text not null check (vibe in ('funny', 'sweet', 'chaotic')),
  message_text text not null,
  sticker_placements jsonb not null default '[]'::jsonb,
  canvas_layout jsonb not null default '{"textBlocks":[],"assets":[],"borderId":null}'::jsonb,
  paper_theme text not null default 'warm-scrap',
  created_at timestamptz not null default now(),
  delete_token text
);

create index if not exists posters_created_at_idx on public.posters (created_at desc);

alter table public.posters enable row level security;

drop policy if exists "Anyone can read posters" on public.posters;
create policy "Anyone can read posters"
  on public.posters
  for select
  using (true);

drop policy if exists "Anyone can create posters" on public.posters;
create policy "Anyone can create posters"
  on public.posters
  for insert
  with check (true);

-- No public update/delete in V1 (delete_token reserved for later take-down).
