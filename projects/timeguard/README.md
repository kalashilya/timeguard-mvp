# TimeGuard Planner MVP

**TimeGuard Planner** — учебный MVP планировщика дня без конфликтов времени.

Главная ценность проекта: пользователь добавляет задачи с датой и временем, а система проверяет, не пересекаются ли они между собой. Если конфликт есть, задача не сохраняется без подтверждения/замены.

## Основные страницы

| Файл | Назначение |
|---|---|
| `app.html` | основной планировщик |
| `register.html` | регистрация через Supabase Auth |
| `login.html` | вход через Supabase Auth |
| `cabinet.html` | профиль, тариф, локальные планы, ручная синхронизация |
| `cloud.html` | просмотр задач из Supabase |
| `pricing.html` | учебный тарифный сценарий |
| `payment-success.html` | учебная активация тарифа |
| `demo-center.html` | быстрый экран для демонстрации преподавателю |
| `pitch.html` | краткое описание продукта |

## Основные скрипты

| Файл | За что отвечает |
|---|---|
| `app.js` | главная логика: задачи, конфликты, лимиты, localStorage, Supabase sync |
| `supabase-settings.js` | URL и publishable key Supabase |
| `supabase-adapter.js` | клиент Supabase: auth, profiles, tasks |
| `supabase-sync.js` | ручная отправка локальных задач в Supabase из кабинета |
| `cloud-tasks.js` | чтение задач из Supabase на Cloud-странице |
| `nav-auth.js` | состояние профиля в навигации |
| `auth-bootstrap.js` | локальный профиль для demo-сценария |
| `form-hardening.js` | защита формы от частых повторных действий |
| `conflict-modal.js` | модальное окно конфликта времени |
| `demo-seed.js` | подготовка demo-данных |
| `demo-center.js` | проверка статуса MVP на demo-странице |

## Стек

HTML, CSS, JavaScript, localStorage, Supabase Auth, Supabase Database, RLS, Render Static Site, GitHub.

## Данные

### localStorage

Используется для быстрой работы MVP в браузере:

- `timeguard_profile_v1` — профиль пользователя;
- `timeguard_tasks_v1` — локальные задачи;
- `timeguard_stats_v1` — счётчик конфликтов и служебная статистика.

### Supabase

Используется для auth-flow и cloud-сценария:

- `profiles` — пользователь, email, роль, тариф;
- `tasks` — задачи пользователя;
- `task_events` — события авторизованного пользователя;
- `analytics_events` — demo-события для учебной аналитики.

## Что показывать преподавателю

1. Открыть `app.html` / `/planner`.
2. Добавить обычную задачу.
3. Добавить задачу с пересечением по времени.
4. Показать предупреждение о конфликте.
5. Показать Supabase Table Editor: `tasks` и события.
6. Открыть `cabinet.html` и `cloud.html`.
7. Объяснить стек: frontend-first MVP + localStorage + Supabase.

## Ограничение MVP

Проект остаётся учебным MVP. Оплата и admin-доступ являются демонстрационными. Supabase работает для auth, хранения задач и cloud-чтения, но production-версия потребует server-side проверки тарифов, платежных webhooks и более строгой backend-валидации.
