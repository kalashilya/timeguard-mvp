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

create policy "profiles_select_own_or_admin"
on profiles for select
using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "tasks_select_own_or_admin"
on tasks for select
using (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

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

create policy "events_select_own_or_admin"
on task_events for select
using (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
