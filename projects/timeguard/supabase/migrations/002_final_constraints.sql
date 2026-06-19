-- Final TimeGuard constraints for cloud sync.

alter table tasks add column if not exists local_id text;

drop index if exists idx_tasks_user_local_id;
alter table tasks drop constraint if exists tasks_user_local_id_unique;

alter table tasks
add constraint tasks_user_local_id_unique unique (user_id, local_id);

create index if not exists idx_tasks_user_date_start
on tasks(user_id, task_date, start_time);

create index if not exists idx_task_events_user_created
on task_events(user_id, created_at desc);
