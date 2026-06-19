-- Run this only after creating a real user through Supabase Auth.
-- Replace USER_ID with the id from auth.users.

insert into tasks (user_id, task_date, title, start_time, end_time, priority, category, notes)
values
('USER_ID', current_date, 'Study project', '10:00', '11:30', 'high', 'study', 'Prepare MVP'),
('USER_ID', current_date, 'Meeting', '12:00', '13:00', 'medium', 'meeting', 'Daily planning');

-- To make a user admin, replace USER_ID and run:

update profiles
set role = 'admin'
where id = 'USER_ID';
