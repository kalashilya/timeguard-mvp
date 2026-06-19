alter table tasks add column if not exists local_id text;

create unique index if not exists idx_tasks_user_local_id
on tasks(user_id, local_id)
where local_id is not null;
