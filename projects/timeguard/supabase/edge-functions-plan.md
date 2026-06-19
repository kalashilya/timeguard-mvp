# Edge Functions plan

The current live MVP works through frontend + Supabase RLS. Edge Functions are planned as the next production step.

## Why Edge Functions are needed

Some logic should not stay only in browser code in a production product:

- conflict validation;
- tariff limits;
- payment status updates;
- admin summaries;
- rate limiting;
- audit events.

## Planned functions

## 1. `timeguard-create-task`

Purpose: create task through server-side validation.

Responsibilities:

- verify JWT;
- load current user profile;
- check plan limits;
- validate required fields;
- check that end time is later than start time;
- check task overlap;
- insert task;
- write event to `task_events`.

Expected request:

```json
{
  "task_date": "2026-06-19",
  "title": "Prepare defense",
  "start_time": "10:00",
  "end_time": "11:30",
  "priority": "high",
  "category": "study",
  "notes": "Open Demo Center"
}
```

Expected response:

```json
{
  "ok": true,
  "task_id": "uuid"
}
```

## 2. `timeguard-account`

Purpose: return current account and product statistics.

Responsibilities:

- verify JWT;
- return profile;
- return plan;
- return task count;
- return completed task count;
- return number of planned days.

## 3. `timeguard-plan`

Purpose: update plan after payment provider confirmation.

Responsibilities:

- receive webhook from payment provider;
- verify signature;
- update `profiles.plan`;
- update `profiles.is_paid`;
- write event to `task_events`.

## 4. `timeguard-admin-summary`

Purpose: return admin dashboard data.

Responsibilities:

- verify admin access server-side;
- count users;
- count tasks;
- count active paid users;
- return aggregate data without exposing private rows.

## Rate limiting

Production functions should limit frequent requests:

- task creation: 30 requests per 10 minutes;
- account summary: 60 requests per 10 minutes;
- export generation: 20 requests per 10 minutes.

## Current MVP status

Edge Functions are not deployed in the current live MVP. The project includes this plan to show how the static MVP can evolve into a production architecture.
