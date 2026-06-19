insert into profiles (id, email, full_name, role, plan)
values
('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'user', 'free'),
('00000000-0000-0000-0000-000000000002', 'admin@example.com', 'Admin User', 'admin', 'plus');

insert into tasks (id, user_id, task_date, title, start_time, end_time, priority, category, notes)
values
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', current_date, 'Study project', '10:00', '11:30', 'high', 'study', 'Prepare MVP'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', current_date, 'Meeting', '12:00', '13:00', 'medium', 'meeting', 'Daily planning');
