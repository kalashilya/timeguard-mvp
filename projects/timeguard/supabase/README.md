# Supabase plan

This folder describes the database layer for the next version of TimeGuard Planner.

The current MVP works without backend. This is intentional: the live demo must stay stable. The files in this folder show how the project can be moved to Supabase later.

## Planned entities

- profiles
- tasks
- task_events
- plan_limits

## Planned security

- each user reads only own tasks;
- admin reads summary data;
- public visitors cannot access private task data;
- plan status is checked on the server.

## How to use later

1. Create a Supabase project.
2. Run `schema.sql` in SQL Editor.
3. Add sample rows from `sample-data.sql`.
4. Review access rules in `rls-notes.md`.
5. Connect frontend after MVP defense.
