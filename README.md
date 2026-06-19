# TimeGuard Planner — учебный MVP

**TimeGuard Planner** — учебный MVP-проект по курсу «Программирование без кода».

Сервис помогает пользователю составлять реалистичный план дня: добавлять задачи, сортировать их по времени и заранее видеть предупреждение, если дела пересекаются друг с другом.

## Live demo

`https://kalashilya.github.io/timeguard-mvp/`

## Идея

Обычные списки дел не проверяют, можно ли реально выполнить план. Пользователь может поставить две задачи на одно время и заметить это слишком поздно. TimeGuard проверяет расписание до сохранения задачи.

## Целевая аудитория

Студенты, молодые специалисты и менеджеры, которым нужно совмещать учёбу, работу, встречи и личные дела.

## Ценность MVP

Пользователь получает понятный план дня, заранее видит конфликты и быстрее собирает реалистичное расписание.

## Основной JTBD

Когда у меня много дел на день и я боюсь поставить задачи на одно и то же время, я хочу быстро собрать расписание с проверкой пересечений, чтобы заранее понять, что реально успеть.

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

## Что реализовано

- лендинг и основной планировщик;
- профиль, register/login/verify flow;
- добавление задач на дату;
- проверка пересечений по времени;
- сортировка задач;
- кабинет;
- Free-лимит и тарифный сценарий;
- Supabase Auth и синхронизация задач;
- SQL-схема, RLS и sample data;
- прогресс выполнения задач;
- фильтры по категории и приоритету;
- недельный обзор;
- экспорт плана в TXT и JSON;
- документы для защиты.

## Стек

HTML, CSS, JavaScript, localStorage, GitHub Pages, Supabase.

## Структура

```text
index.html
notes/
prompts/
docs/
projects/timeguard/app.html
projects/timeguard/app.css
projects/timeguard/app.js
projects/timeguard/product-upgrades.js
projects/timeguard/auth-bootstrap.js
projects/timeguard/form-hardening.js
projects/timeguard/supabase-adapter.js
projects/timeguard/supabase-sync.js
projects/timeguard/supabase-settings.js
projects/timeguard/register.html
projects/timeguard/login.html
projects/timeguard/verify-step.html
projects/timeguard/cabinet.html
projects/timeguard/pricing.html
projects/timeguard/payment-success.html
projects/timeguard/admin.html
projects/timeguard/supabase/
```

## Демо-сценарий

1. Открыть сайт.
2. Создать профиль.
3. Добавить несколько задач.
4. Показать сортировку.
5. Добавить задачу с пересечением.
6. Показать предупреждение.
7. Отметить задачу выполненной.
8. Показать прогресс, фильтры и недельный обзор.
9. Экспортировать план.
10. Открыть кабинет.
11. Синхронизировать задачи с Supabase.
12. Показать Free-лимит и тарифы.

## Ограничение MVP

Проект остаётся учебным MVP. Основной сценарий работает на frontend, а Supabase используется для демонстрации реальной базы, auth-flow и синхронизации задач.
