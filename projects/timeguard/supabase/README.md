# Supabase

This folder describes the real database layer used by TimeGuard Planner.

The current MVP uses Supabase for Auth, profiles, task synchronization, RLS and Cloud task loading.

## Structure

- `config.toml` — Supabase CLI local configuration;
- `schema.sql` — flat SQL schema for manual launch in Supabase SQL Editor;
- `migrations/` — incremental SQL changes;
- `seed.sql` — seed data for a real auth user;
- `sample-data.sql` — small manual sample;
- `queries.md` — key SQL queries and product scenarios;
- `rls-notes.md` — access rules and security notes;
- `functions/timeguard-create-task/` — Edge Function source for server-side task creation;
- `edge-functions-plan.md` — backend function roadmap.

## Tables

### `profiles`

Stores user profile data:

- id;
- email;
- full name;
- role;
- plan;
- payment flag.

### `tasks`

Stores user tasks:

- user id;
- local id for sync;
- task date;
- start and end time;
- title;
- priority;
- category;
- notes;
- done status.

### `task_events`

Stores task events for rate limiting, analytics and future audit logs.

## RLS

RLS is enabled for user tables.

Current MVP rule:

- user can read own profile;
- user can insert own profile;
- user can update own profile;
- user can read own tasks;
- user can insert own tasks;
- user can update own tasks;
- user can delete own tasks;
- user can read own events;
- user can insert own events.

Admin access is intentionally not implemented in RLS in the current MVP to avoid recursive policy issues. Admin screen is an educational frontend demo.

## Edge Functions

### `timeguard-create-task`

The repository now includes the source code for `timeguard-create-task`.

The function performs server-side checks:

- JWT/auth validation;
- required fields validation;
- date and time format validation;
- `end_time > start_time` validation;
- profile and plan loading;
- Free/Plus/Team daily task limits;
- days-ahead limits;
- task creation rate limit;
- time conflict check against existing tasks;
- insert into `tasks`;
- insert audit/rate event into `task_events`.

This moves the strongest product rule — conflict prevention — from frontend-only logic toward backend validation.

### Deployment

The function is ready in the repository but must be deployed to the connected Supabase project before the live frontend can call it.

Deploy command from `projects/timeguard/supabase/`:

```bash
supabase functions deploy timeguard-create-task
```

The function is configured in `config.toml` with:

```toml
[functions.timeguard-create-task]
verify_jwt = true
```

### Planned functions

- `timeguard-account` — profile, plan and statistics;
- `timeguard-plan` — tariff update after payment webhook.

## How to use in Supabase Studio

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `schema.sql`.
4. If needed, run files from `migrations/`.
5. Create a user through Auth.
6. Replace `USER_ID` in `seed.sql` with the real user id.
7. Run `seed.sql` only for testing.
8. Open the frontend and log in.
9. Sync tasks from Cabinet.
10. Open Cloud page and check that tasks are loaded from Supabase.

## How to use locally with Supabase CLI

1. Install Supabase CLI.
2. Open `projects/timeguard/supabase/`.
3. Run local Supabase.
4. Apply migrations.
5. Use `seed.sql` after creating a user.
6. Test the function locally with `supabase functions serve timeguard-create-task`.

## Security note

The frontend uses only a publishable Supabase key. Secret/service-role keys must never be committed to the repository or used in browser code.
