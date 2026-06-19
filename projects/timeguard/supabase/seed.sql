-- TimeGuard seed data.
-- Run only after a real user is created through Supabase Auth.
-- Replace USER_ID with the id from auth.users.

insert into profiles (id, email, full_name, role, plan, is_paid)
values ('USER_ID', 'demo@timeguard.local', 'TimeGuard Demo User', 'user', 'free', false)
on conflict (id) do update
set full_name = excluded.full_name,
    plan = excluded.plan,
    updated_at = now();

insert into tasks (user_id, local_id, task_date, title, start_time, end_time, priority, category, notes, done)
values
('USER_ID', 'seed-1', current_date, 'Prepare MVP defense', '10:00', '11:30', 'high', 'study', 'Open Demo Center and Pitch', true),
('USER_ID', 'seed-2', current_date, 'Show Supabase sync', '12:00', '13:00', 'high', 'work', 'Sync tasks and open Cloud page', false),
('USER_ID', 'seed-3', current_date + interval '1 day', 'Collect feedback', '15:00', '16:00', 'medium', 'meeting', 'Ask users about planning value', false)
on conflict (user_id, local_id) do update
set title = excluded.title,
    task_date = excluded.task_date,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    priority = excluded.priority,
    category = excluded.category,
    notes = excluded.notes,
    done = excluded.done,
    updated_at = now();
