-- Fix RLS for score saving and history inserts.
-- Date: 2026-02-19

begin;

-- Ensure RLS is enabled on required tables.
alter table public.scores enable row level security;
alter table public.game_history enable row level security;

-- Clean previous policies to keep migration deterministic.
drop policy if exists scores_select_public on public.scores;
drop policy if exists scores_insert_own on public.scores;
drop policy if exists scores_update_own on public.scores;
drop policy if exists scores_delete_own on public.scores;

drop policy if exists game_history_select_own on public.game_history;
drop policy if exists game_history_insert_own on public.game_history;

-- Public read for leaderboard.
create policy scores_select_public
on public.scores
for select
to anon, authenticated
using (true);

-- Users can only insert/update/delete their own score row.
create policy scores_insert_own
on public.scores
for insert
to authenticated
with check (
  user_id is not null
  and user_id::text = auth.uid()::text
);

create policy scores_update_own
on public.scores
for update
to authenticated
using (
  user_id is not null
  and user_id::text = auth.uid()::text
)
with check (
  user_id is not null
  and user_id::text = auth.uid()::text
);

create policy scores_delete_own
on public.scores
for delete
to authenticated
using (
  user_id is not null
  and user_id::text = auth.uid()::text
);

-- History is private per user.
create policy game_history_select_own
on public.game_history
for select
to authenticated
using (
  user_id is not null
  and user_id::text = auth.uid()::text
);

create policy game_history_insert_own
on public.game_history
for insert
to authenticated
with check (
  user_id is not null
  and user_id::text = auth.uid()::text
);

-- Explicit grants (safe if already granted).
grant select on table public.scores to anon, authenticated;
grant insert, update, delete on table public.scores to authenticated;

grant select, insert on table public.game_history to authenticated;

commit;