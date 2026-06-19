# Queries

## Tasks by date

```sql
select *
from tasks
where user_id = :user_id
and task_date = :task_date
order by start_time asc;
```

## Completed tasks

```sql
select count(*)
from tasks
where user_id = :user_id
and done = true;
```

## Admin summary

```sql
select count(*) as tasks_count
from tasks;
```

## Conflict check idea

Before inserting a task, compare new start and end time with existing tasks on the same date.
