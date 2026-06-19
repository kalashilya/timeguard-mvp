# Data model

## Profile

```json
{
  "name": "User name",
  "email": "user@example.com",
  "role": "user",
  "plan": "free"
}
```

## Task

```json
{
  "id": "task id",
  "date": "2026-01-01",
  "title": "Task title",
  "start": "10:00",
  "end": "11:00",
  "priority": "medium",
  "category": "work",
  "notes": "Task notes",
  "done": false
}
```

## Stats

```json
{
  "conflicts": 0,
  "lastSubmitAt": 0
}
```

## Storage keys

- `timeguard_profile_v1`
- `timeguard_tasks_v1`
- `timeguard_stats_v1`

## Next backend step

For production, this model can be moved to Supabase tables: `profiles`, `tasks`, `plans`, `events`.
