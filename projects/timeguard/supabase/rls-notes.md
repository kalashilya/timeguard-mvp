# RLS notes

## Goal

RLS protects private user data in Supabase. The frontend can use a publishable key because every important table is protected by policies.

## Tables with RLS

- `profiles`;
- `tasks`;
- `task_events`.

## Current rules

### profiles

- user can select own profile;
- user can insert own profile;
- user can update own profile.

### tasks

- user can select own tasks;
- user can insert own tasks;
- user can update own tasks;
- user can delete own tasks.

### task_events

- user can insert own events;
- user can select own events.

## Why admin access is not inside RLS now

An early policy tried to check admin role by reading `profiles` from inside a `profiles` policy. Supabase returned an infinite recursion error. The final MVP avoids that risk and uses simple owner-only RLS.

For production, admin access should be implemented through one of these approaches:

- backend Edge Function with service role key;
- separate admin claims in JWT;
- security definer function;
- dedicated admin schema or view.

## Frontend key policy

The project uses a publishable key in frontend. This is acceptable because RLS restricts access to rows. Secret/service-role keys must never be exposed in frontend code.

## Manual verification

1. Log in as user A.
2. Create tasks.
3. Confirm tasks are visible on Cloud page.
4. Log out.
5. Log in as user B.
6. Confirm user B does not see user A tasks.

## Production hardening

- move conflict check to Edge Function;
- move tariff checks to backend;
- add audit logs;
- add admin function with service role;
- keep all payment validation server-side.
