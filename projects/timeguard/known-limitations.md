# Known limitations

## Что работает реально

- опубликованный сайт на GitHub Pages;
- основной planner-сценарий;
- localStorage-хранение задач;
- Supabase Auth;
- таблицы Supabase;
- RLS-политики;
- синхронизация задач в Supabase;
- Cloud-страница, которая читает задачи из базы;
- экспорт TXT и JSON.

## Что является учебной имитацией

- тарифная оплата;
- успешная активация тарифа;
- admin-доступ в интерфейсе;
- коммерческие ограничения Plus/Team;
- полноценные платежи и webhooks.

## Ограничения текущей версии

1. Основной планировщик сначала работает с localStorage.
2. Supabase используется для auth, sync и cloud-read, но не заменяет весь frontend-state.
3. Нет полноценной двусторонней синхронизации в реальном времени.
4. Нет push-уведомлений.
5. Нет интеграции с Google Calendar или Outlook.
6. Нет server-side проверки оплаты.
7. Нет production-admin панели на backend-уровне.
8. Нет командных рабочих пространств.
9. Нет мобильного приложения.
10. Нет автоматической аналитической панели.

## Почему это допустимо для MVP

Цель MVP — проверить ключевую ценность: пользователь может создать реалистичный план дня и заранее увидеть конфликт времени. Для этой цели достаточно frontend-сценария, localStorage и демонстрационной Supabase-синхронизации.

## Что нужно для production

- backend functions;
- server-side tariff validation;
- payment provider webhooks;
- full cloud-first task storage;
- realtime sync;
- audit logs;
- analytics dashboard;
- notification system;
- calendar integrations;
- stronger admin permissions.

## Честная формулировка для защиты

TimeGuard — учебный MVP. Основной сценарий планирования работает во frontend, а Supabase подключён для демонстрации реальной авторизации, базы данных, RLS и синхронизации задач. Оплата и admin-доступ являются учебной имитацией, а production-версия потребует backend-функций и server-side проверок.
