create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  plan text default 'free' check (plan in ('free', 'plus', 'team')),
  is_paid boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  local_id text,
  task_date date not null,
  title text not null,
  start_time time not null,
  end_time time not null,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  category text default 'personal',
  notes text,
  done boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_task_time check (end_time > start_time)
);

create unique index if not exists idx_tasks_user_local_id
on tasks(user_id, local_id)
where local_id is not null;

create table if not exists task_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table tasks enable row level security;
alter table task_events enable row level security;

drop policy if exists "profiles_select_own_or_admin" on profiles;
drop policy if exists "profiles_insert_own" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "tasks_select_own_or_admin" on tasks;
drop policy if exists "tasks_insert_own" on tasks;
drop policy if exists "tasks_update_own" on tasks;
drop policy if exists "tasks_delete_own" on tasks;
drop policy if exists "events_insert_own" on task_events;
drop policy if exists "events_select_own_or_admin" on task_events;

create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "tasks_select_own"
on tasks for select
using (auth.uid() = user_id);

create policy "tasks_insert_own"
on tasks for insert
with check (auth.uid() = user_id);

create policy "tasks_update_own"
on tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "tasks_delete_own"
on tasks for delete
using (auth.uid() = user_id);

create policy "events_insert_own"
on task_events for insert
with check (auth.uid() = user_id);

create policy "events_select_own"
on task_events for select
using (auth.uid() = user_id);
