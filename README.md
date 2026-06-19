# TimeGuard Planner

**TimeGuard Planner** — smart planner для реалистичного расписания дня без конфликтов времени.

Продукт помогает пользователю создать аккаунт, добавить задачи, проверить пересечения, увидеть визуальный день, отредактировать план, отправить задачи в Supabase и открыть их на Cloud-странице.

## Live links

| Раздел | Ссылка |
|---|---|
| Главная | `https://timeguard-mvp.onrender.com` |
| Регистрация | `https://timeguard-mvp.onrender.com/register` |
| Вход | `https://timeguard-mvp.onrender.com/login` |
| Обзор | `https://timeguard-mvp.onrender.com/overview` |
| О продукте | `https://timeguard-mvp.onrender.com/about` |
| Планировщик | `https://timeguard-mvp.onrender.com/planner` |
| Кабинет | `https://timeguard-mvp.onrender.com/cabinet` |
| Cloud | `https://timeguard-mvp.onrender.com/cloud` |
| Тарифы | `https://timeguard-mvp.onrender.com/pricing` |
| GitHub Pages backup | `https://kalashilya.github.io/timeguard-mvp/` |

## Product flow

1. Open the site.
2. Register or log in.
3. Add tasks with date, start time, end time, priority and category.
4. TimeGuard blocks tasks that overlap by time.
5. Use the visual day view to see the schedule by hours.
6. Edit, complete, delete or export tasks to Google Calendar.
7. Open Cabinet and sync tasks with Supabase.
8. Open Cloud and load tasks from the database.
9. Check Pricing to see Free, Plus and Team plans.

## Problem

Regular todo-lists store tasks but do not check whether the schedule is realistic. A user can accidentally put two tasks at the same time and notice the conflict too late.

## Solution

TimeGuard validates the schedule before saving. If a task overlaps with another task, the product shows a warning and blocks the impossible plan.

## Target audience

Students, young specialists and managers who combine study, work, meetings and personal tasks in one day.

## Hypothesis and metrics

**Hypothesis:** TimeGuard reduces manual schedule checking from 10–15 minutes to 3–5 minutes and reduces the number of time conflicts.

Key metrics:

- time needed to create a daily plan;
- number of blocked conflicts;
- number of completed tasks;
- repeat usage;
- number of syncs with Supabase;
- user willingness to pay for higher limits.

## Implemented features

- product landing page;
- registration and login;
- dynamic auth navigation with profile menu;
- localStorage profile and task storage;
- task creation by date and time;
- time conflict validation;
- Free/Plus/Team limits;
- visual day schedule;
- task editing;
- task completion and deletion;
- Google Calendar export;
- personal cabinet;
- Supabase Auth;
- Supabase task sync;
- Cloud page that loads tasks from Supabase;
- RLS policies;
- Render deployment;
- short Render routes;
- prepared Supabase Edge Function `timeguard-create-task` for server-side task validation.

## Tech stack

HTML, CSS, JavaScript, localStorage, Supabase, RLS, Render Static Site, GitHub Pages backup.

## Backend note

The live frontend works with localStorage and Supabase sync. The repository also contains the source code for the Edge Function `timeguard-create-task`, which is prepared as a production backend step for server-side auth, plan limits and time conflict validation.

## Repository structure

```text
.
├── index.html
├── render.yaml
├── register/
├── login/
├── overview/
├── about/
├── planner/
├── cabinet/
├── cloud/
├── pricing/
├── docs/
├── notes/
├── prompts/
└── projects/
    └── timeguard/
        ├── app.html
        ├── cabinet.html
        ├── cloud.html
        ├── demo-center.html
        ├── pitch.html
        ├── pricing.html
        ├── app.css
        ├── nav-auth.js
        ├── task-tools.js
        ├── product-metrics.js
        ├── cloud-guide.js
        └── supabase/
```
