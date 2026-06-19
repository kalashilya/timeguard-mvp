# TimeGuard Planner — сценарий защиты

## 1. Короткое описание

TimeGuard Planner — smart planner для реалистичного расписания дня без конфликтов времени.

В отличие от обычного todo-list, продукт проверяет пересечения по времени до сохранения задачи, показывает визуальный день, поддерживает редактирование, Google Calendar export, кабинет, Supabase sync и Cloud-чтение задач.

## 2. Что показать на защите

1. Открыть главную: `https://timeguard-mvp.onrender.com`.
2. Показать регистрацию или вход.
3. Показать профильное меню в шапке.
4. Открыть `/planner`.
5. Нажать «Заполнить примером».
6. Показать визуальный день.
7. Добавить задачу без конфликта.
8. Попробовать добавить или отредактировать задачу с пересечением времени.
9. Показать, что TimeGuard блокирует конфликт.
10. Показать редактирование задачи.
11. Показать кнопку Google Calendar.
12. Открыть кабинет и синхронизацию.
13. Открыть Cloud и загрузить задачи из Supabase.
14. Открыть тарифы.
15. Открыть «О продукте» и показать гипотезу с метриками.

## 3. Главная фраза

TimeGuard помогает пользователю не просто записать задачи, а собрать выполнимый план дня. Главная ценность продукта — автоматическая проверка пересечений по времени.

## 4. Что реализовано

- landing page;
- registration/login;
- auth navigation with profile dropdown;
- localStorage profile and tasks;
- task creation;
- conflict validation;
- visual day schedule;
- task editing;
- Google Calendar export;
- personal cabinet;
- Supabase Auth;
- Supabase sync;
- Cloud page;
- Free/Plus/Team plan scenario;
- product hypothesis and metrics;
- Render deployment;
- prepared Supabase Edge Function source.

## 5. Supabase explanation

Current live frontend uses localStorage for fast local work and Supabase for auth, profile, task sync and Cloud task loading.

The repository also includes `timeguard-create-task` Edge Function source as a production step. It is prepared for server-side validation of auth, plan limits and time conflicts.

## 6. Honest limitation

The Edge Function source is prepared in the repository, but live task creation currently works through frontend logic and Supabase sync. This is acceptable for the current product version and shows a clear next backend step.
