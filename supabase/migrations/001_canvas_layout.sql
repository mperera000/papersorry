-- Run in Supabase SQL Editor if posters table already exists
alter table public.posters
  add column if not exists canvas_layout jsonb not null default '{"textBlocks":[],"assets":[],"borderId":null}'::jsonb;
