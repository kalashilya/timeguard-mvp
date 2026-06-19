create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  role text default 'user',
  plan text default 'free',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key,
  user_id uuid references profiles(id),
  task_date date not null,
  title text not null,
  start_time time not null,
  end_time time not null,
  priority text default 'medium',
  category text default 'personal',
  notes text,
  done boolean default false,
  created_at timestamptz default now()
);

create table if not exists task_events (
  id uuid primary key,
  user_id uuid references profiles(id),
  event_type text not null,
  created_at timestamptz default now()
);
