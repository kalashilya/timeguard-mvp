# Release plan TimeGuard Planner

## Release 1 — Учебный MVP

Статус: выполнено.

- лендинг;
- Demo Center;
- Pitch;
- форма профиля;
- форма добавления задач;
- проверка пересечений;
- сортировка задач;
- сохранение в localStorage;
- прогресс выполнения;
- фильтры;
- недельный обзор;
- экспорт TXT/JSON;
- кабинет;
- тарифный экран;
- учебная admin-сводка.

## Release 2 — Supabase cloud layer

Статус: выполнено для MVP.

- Supabase Auth;
- таблица `profiles`;
- таблица `tasks`;
- таблица `task_events`;
- RLS-политики;
- publishable key во frontend;
- синхронизация задач из кабинета;
- Cloud-страница для чтения задач из базы;
- seed-файл;
- миграции;
- Supabase CLI config.

## Release 3 — Production backend

Статус: следующий этап.

- Edge Function для создания задачи;
- server-side проверка конфликтов;
- server-side проверка тарифов;
- rate limiting;
- payment webhooks;
- admin summary через backend;
- audit logs.

## Release 4 — Cloud-first planner

Статус: следующий этап.

- загрузка задач из Supabase прямо в Planner;
- сохранение изменений напрямую в базу;
- offline-mode;
- realtime sync;
- conflict resolution;
- работа с несколькими устройствами.

## Release 5 — Продуктовое развитие

Статус: future roadmap.

- drag-and-drop задач;
- шаблоны дней;
- совместные планы;
- уведомления;
- интеграция с Google Calendar и Outlook;
- мобильная версия;
- аналитика поведения;
- платные командные функции.
