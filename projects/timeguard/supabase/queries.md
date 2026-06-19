# Queries

## Current user profile

```sql
select id, email, full_name, role, plan, is_paid
from profiles
where id = auth.uid();
```

## Tasks by selected date

```sql
select *
from tasks
where user_id = auth.uid()
and task_date = :task_date
order by start_time asc;
```

## All user tasks for Cloud page

```sql
select id, task_date, title, start_time, end_time, priority, category, notes, done, created_at
from tasks
where user_id = auth.uid()
order by task_date asc, start_time asc;
```

## Completed tasks

```sql
select count(*)
from tasks
where user_id = auth.uid()
and done = true;
```

## Weekly overview

```sql
select task_date,
       count(*) as total_tasks,
       count(*) filter (where done = true) as done_tasks
from tasks
where user_id = auth.uid()
and task_date between current_date and current_date + interval '6 days'
group by task_date
order by task_date asc;
```

## Conflict check

```sql
select id, title, start_time, end_time
from tasks
where user_id = auth.uid()
and task_date = :task_date
and start_time < :new_end_time
and end_time > :new_start_time;
```

If this query returns rows, the new task overlaps with existing tasks.

## Upsert by local id

```sql
insert into tasks (user_id, local_id, task_date, title, start_time, end_time, priority, category, notes, done)
values (auth.uid(), :local_id, :task_date, :title, :start_time, :end_time, :priority, :category, :notes, :done)
on conflict (user_id, local_id) do update
set task_date = excluded.task_date,
    title = excluded.title,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    priority = excluded.priority,
    category = excluded.category,
    notes = excluded.notes,
    done = excluded.done,
    updated_at = now();
```

## Product analytics idea

```sql
insert into task_events (user_id, event_type, payload)
values (auth.uid(), 'task_created', jsonb_build_object('source', 'planner'));
```

## Admin summary for future backend

Admin summary should not be exposed directly from frontend. In production it should be returned by Edge Function using service role on the server.

```sql
select count(*) as tasks_count,
       count(distinct user_id) as users_count,
       count(*) filter (where done = true) as done_tasks
from tasks;
```
