-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Creates the goals and entries tables, scoped to the signed-in user via Row Level Security.

create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null,
  description text not null default '',
  target_date date,
  category    text not null check (category in ('health', 'career', 'personal', 'finance', 'learning', 'other')),
  color       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date       date not null,
  content    text not null,
  mood       text not null check (mood in ('great', 'good', 'okay', 'bad', 'terrible')),
  goal_ids   uuid[] not null default '{}',
  goal_progress jsonb not null default '{}'::jsonb, -- { "<goal id>": <percent 0-100>, ... }
  created_at timestamptz not null default now()
);

-- Migration for databases created before per-entry progress existed (safe to re-run).
alter table public.entries
  add column if not exists goal_progress jsonb not null default '{}'::jsonb;

create index if not exists goals_user_id_idx on public.goals (user_id);
create index if not exists entries_user_id_idx on public.entries (user_id);

-- Row Level Security: each user can only see and change their own rows.
alter table public.goals enable row level security;
alter table public.entries enable row level security;

drop policy if exists "Users manage their own goals" on public.goals;
create policy "Users manage their own goals" on public.goals
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users manage their own entries" on public.entries;
create policy "Users manage their own entries" on public.entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
