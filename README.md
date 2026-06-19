# TimeGuard Planner — учебный MVP

**TimeGuard Planner** — учебный MVP-проект по курсу «Программирование без кода».

Сервис помогает пользователю составлять реалистичный план дня: добавлять задачи, сортировать их по времени и заранее видеть предупреждение, если дела пересекаются друг с другом.

## Live demo

Ссылка на опубликованный MVP:  
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

| # | Тема | Документ | Промпт | Статус |
|---|------|----------|--------|--------|
| 1 | Проблема, ЦА, ценность MVP | `notes/hw1-problem-audience-value.md` | `prompts/01-idea-generation.md` | done |
| 2 | Пользователь, функции, user flow | `notes/hw2-user-functions-userflow.md` | `prompts/02-mvp-scope.md` | done |
| 3 | Лендинг и интерактивный сценарий | `notes/hw3-landing-interactive.md` | `prompts/03-code-generation.md` | done |
| 4 | Улучшение структуры MVP | `projects/timeguard/components-map.md` | `prompts/04-final-packaging.md` | done |
| 5 | Тестирование MVP | `projects/timeguard/test-plan.md` | — | done |
| 6 | Данные | `projects/timeguard/data-model.md` | — | done |
| 7 | Роли и кабинет | `projects/timeguard/README.md` | — | done |
| 8 | Публикация | `projects/timeguard/deploy.md` | — | done |
| 9 | Аналитика | `projects/timeguard/analytics.md` | — | done |
| 10 | Тарифный сценарий | `notes/hw10-paywall.md` | — | done |
| 11 | Безопасность MVP | `notes/hw11-security.md` | — | done |
| 12 | Демонстрация MVP | `projects/timeguard/demo-exam-scenario.md` | — | done |

## Что реализовано

- лендинг с описанием продукта;
- учебный профиль пользователя;
- добавление задач на дату;
- выбор времени начала и окончания;
- приоритет и категория;
- проверка пересечений;
- сортировка задач;
- сохранение в `localStorage`;
- кабинет с планами;
- роли `guest`, `user`, `admin`;
- Free-лимит;
- учебный тарифный сценарий;
- базовая защита от повторных кликов;
- документы для защиты.

## Стек

HTML, CSS, JavaScript, localStorage, GitHub Pages.

## Структура

```text
index.html
.nojekyll
notes/
prompts/
projects/timeguard/app.html
projects/timeguard/app.css
projects/timeguard/app.js
projects/timeguard/cabinet.html
projects/timeguard/pricing.html
projects/timeguard/payment-success.html
projects/timeguard/admin.html
projects/timeguard/README.md
projects/timeguard/open-local.md
projects/timeguard/demo-exam-scenario.md
projects/timeguard/security-checklist.md
projects/timeguard/analytics.md
projects/timeguard/deploy.md
projects/timeguard/test-plan.md
projects/timeguard/presentation-outline.md
projects/timeguard/defense-cheatsheet.md
projects/timeguard/user-flow.md
projects/timeguard/screens.md
projects/timeguard/components-map.md
projects/timeguard/release-plan.md
projects/timeguard/data-model.md
projects/timeguard/data-next.md
```

## Демо-сценарий

1. Открыть сайт.
2. Создать учебный профиль.
3. Добавить несколько задач.
4. Показать сортировку.
5. Добавить задачу с пересечением.
6. Показать предупреждение.
7. Открыть кабинет.
8. Показать Free-лимит и тарифы.
9. Активировать учебный тариф.

## Ограничение MVP

Данные хранятся в браузере через localStorage. Реальную авторизацию, серверную базу и оплату можно добавить на следующем этапе через Supabase/Firebase.
