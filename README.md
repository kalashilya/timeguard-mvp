# TimeGuard Planner — финальный учебный MVP

**TimeGuard Planner** — учебный MVP умного планировщика дня без конфликтов времени.

Проект помогает пользователю собрать реалистичный план дня: добавить задачи, проверить пересечения по времени, увидеть прогресс, отфильтровать дела, экспортировать план и синхронизировать задачи с Supabase.

## Главные ссылки

| Раздел | Ссылка |
|---|---|
| Render live site | `https://timeguard-mvp.onrender.com` |
| Render Demo | `https://timeguard-mvp.onrender.com/demo` |
| Render Pitch | `https://timeguard-mvp.onrender.com/pitch` |
| Render Planner | `https://timeguard-mvp.onrender.com/planner` |
| Render Cloud | `https://timeguard-mvp.onrender.com/cloud` |
| GitHub Pages backup | `https://kalashilya.github.io/timeguard-mvp/` |

## Render status

Проект задеплоен на Render:

- основной URL: `https://timeguard-mvp.onrender.com`;
- добавлен `render.yaml`;
- добавлен `docs/render-deploy.md`;
- проект публикуется как static site из корня репозитория;
- для текущего MVP build step не нужен.

## Как быстро проверить проект

1. Открыть **Demo Center**: `https://timeguard-mvp.onrender.com/demo`.
2. Нажать **«Подготовить демо-данные»**.
3. Нажать **«Проверить статус MVP»**.
4. Открыть **Pitch** и коротко объяснить идею.
5. Открыть **Planner** и показать задачи, конфликт, прогресс, фильтры, неделю и экспорт.
6. Открыть **Cabinet** и нажать синхронизацию с Supabase.
7. Открыть **Cloud tasks** и показать, что задачи читаются обратно из базы.
8. Открыть **Pricing** и показать тарифный сценарий.

## Проблема

Обычные todo-листы хранят список дел, но не проверяют реалистичность расписания. Пользователь может поставить две задачи на одно время и заметить конфликт слишком поздно.

## Решение

TimeGuard проверяет расписание до сохранения задачи. Если новое дело пересекается с уже существующим, приложение показывает предупреждение и не сохраняет невыполнимый план.

## Целевая аудитория

Студенты, молодые специалисты и менеджеры, которым нужно совмещать учёбу, работу, встречи и личные дела.

## Ценность MVP

Пользователь быстрее собирает реалистичный план дня, заранее видит конфликты и получает больше контроля над своим расписанием.

## Основной JTBD

Когда у меня много дел на день и я боюсь поставить задачи на одно и то же время, я хочу быстро собрать расписание с проверкой пересечений, чтобы заранее понять, что реально успеть.

## Что реализовано

- landing page;
- Demo Center для защиты;
- Pitch-страница;
- подготовка демо-данных в один клик;
- профиль пользователя;
- register/login/verify flow;
- основной планировщик задач;
- добавление задач на выбранную дату;
- время начала и окончания;
- приоритет и категория;
- проверка пересечений;
- сортировка задач по времени;
- прогресс выполнения;
- фильтры по категории и приоритету;
- недельный обзор;
- экспорт плана в TXT и JSON;
- кабинет пользователя;
- Supabase Auth;
- синхронизация задач с Supabase;
- Cloud-страница, которая читает задачи из Supabase;
- SQL-схема;
- RLS-политики;
- Supabase CLI config;
- миграции и seed-файл;
- Render static site config;
- Free-лимит и тарифный сценарий;
- учебная admin-сводка;
- тест-план, метрики, ограничения и сценарий защиты.

## Стек

HTML, CSS, JavaScript, localStorage, GitHub Pages, Render static site, Supabase.

## Структура репозитория

```text
.
├── index.html
├── render.yaml
├── docs/
│   ├── final-checklist.md
│   ├── final-submission.md
│   ├── render-deploy.md
│   └── repository-map.md
├── notes/
├── prompts/
└── projects/
    └── timeguard/
        ├── demo-center.html
        ├── pitch.html
        ├── app.html
        ├── cabinet.html
        ├── cloud.html
        ├── pricing.html
        ├── admin.html
        ├── README.md
        ├── test-plan.md
        ├── defense-cheatsheet.md
        ├── metrics-and-validation.md
        ├── known-limitations.md
        ├── screens.md
        └── supabase/
            ├── config.toml
            ├── schema.sql
            ├── seed.sql
            ├── queries.md
            ├── rls-notes.md
            ├── edge-functions-plan.md
            └── migrations/
```

## Домашние задания и артефакты

| # | Тема | Документ | Статус |
|---|------|----------|--------|
| 1 | Проблема, ЦА, ценность MVP | `notes/hw1-problem-audience-value.md` | done |
| 2 | Пользователь, функции, user flow | `notes/hw2-user-functions-userflow.md` | done |
| 3 | Лендинг и интерактивный сценарий | `notes/hw3-landing-interactive.md` | done |
| 4 | Компоненты и структура | `projects/timeguard/components-map.md` | done |
| 5 | Тестирование | `projects/timeguard/test-plan.md` | done |
| 6 | Данные и Supabase | `projects/timeguard/supabase/schema.sql` | done |
| 7 | Роли и кабинет | `projects/timeguard/README.md` | done |
| 8 | Публикация | `projects/timeguard/deploy.md` | done |
| 9 | Аналитика | `projects/timeguard/analytics.md` | done |
| 10 | Тарифный сценарий | `notes/hw10-paywall.md` | done |
| 11 | Безопасность MVP | `notes/hw11-security.md` | done |
| 12 | Демонстрация MVP | `projects/timeguard/demo-exam-scenario.md` | done |

## Supabase

Supabase используется реально для:

- Auth;
- profiles;
- tasks;
- RLS;
- синхронизации задач;
- cloud-чтения задач.

Во frontend используется только publishable key. Secret/service-role key не используется и не должен попадать в браузерный код.

## Ограничения MVP

Проект остаётся учебным MVP. Оплата и admin-доступ являются демонстрационными. Supabase-слой работает реально для auth, хранения задач, RLS и cloud-чтения, но production-версия потребует backend-функций, server-side проверки тарифов, платежных webhooks и расширенной аналитики.

## Финальный статус

Проект готов к сдаче и демонстрации.
