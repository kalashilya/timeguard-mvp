# TimeGuard Planner

**TimeGuard Planner** — учебный MVP планировщика дня, который помогает собрать реалистичное расписание и не даёт сохранить задачи с пересечением по времени.

## 1. Что показывать на защите

| Что открыть | Зачем |
|---|---|
| `https://timeguard-mvp.onrender.com` | Главная страница продукта |
| `https://timeguard-mvp.onrender.com/planner` | Основной сценарий: добавление задач и проверка конфликтов |
| `https://timeguard-mvp.onrender.com/register` | Регистрация пользователя через Supabase Auth |
| `https://timeguard-mvp.onrender.com/login` | Вход пользователя |
| `https://timeguard-mvp.onrender.com/cabinet` | Кабинет: профиль, тариф, локальные планы, синхронизация |
| `https://timeguard-mvp.onrender.com/cloud` | Загрузка задач из Supabase |
| `https://timeguard-mvp.onrender.com/pricing` | Free / Plus / Team тарифы |

Короткие ссылки работают через `render.yaml`, поэтому отдельные папки `login/`, `planner/`, `cabinet/` и другие в корне больше не нужны.

## 2. Основной пользовательский сценарий

1. Пользователь открывает планировщик.
2. Вводит дату, название задачи, начало, окончание, приоритет и категорию.
3. JavaScript проверяет поля и время.
4. Если задача пересекается с другой задачей, TimeGuard показывает предупреждение и не сохраняет конфликт.
5. Если всё корректно, задача сохраняется в браузере и отправляется в Supabase.
6. В кабинете и Cloud-разделе можно показать сохранённые данные.

## 3. Стек

- **HTML** — структура страниц.
- **CSS** — визуальный интерфейс.
- **JavaScript** — логика задач, конфликтов, лимитов, кабинета и синхронизации.
- **localStorage** — локальное хранение профиля и задач в браузере.
- **Supabase Auth** — регистрация и вход.
- **Supabase Database** — таблицы `profiles`, `tasks`, `task_events` / `analytics_events`.
- **RLS policies** — правила доступа к данным.
- **Render Static Site** — публикация MVP.
- **GitHub** — репозиторий кода и документации.

## 4. Архитектура

Проект сделан как **frontend-first MVP**.

```text
Пользователь
  ↓
Render route /planner, /login, /cloud
  ↓
projects/timeguard/*.html
  ↓
app.js: проверка формы, конфликтов, лимитов
  ↓
localStorage: быстрое локальное сохранение
  ↓
Supabase: облачное сохранение задач и событий
```

Критическая логика MVP находится в `projects/timeguard/app.js`: добавление задач, проверка пересечений, подсчёт статистики и отправка данных в Supabase.

## 5. Чистая структура проекта

```text
.
├── README.md                  # описание проекта для защиты
├── index.html                 # главная страница
├── render.yaml                # короткие URL на Render: /planner, /login, /cloud
├── favicon.svg                # иконка проекта
└── projects/
    └── timeguard/
        ├── app.html               # основной планировщик
        ├── app.js                 # главная бизнес-логика
        ├── app.css                # стили проекта
        ├── register.html          # регистрация
        ├── login.html             # вход
        ├── cabinet.html           # кабинет
        ├── cloud.html             # задачи из Supabase
        ├── pricing.html           # тарифы
        ├── payment-success.html   # учебная активация тарифа
        ├── demo-center.html       # страница для быстрой демонстрации
        ├── pitch.html             # описание продукта
        ├── supabase-settings.js   # URL и publishable key Supabase
        ├── supabase-adapter.js    # обёртка над Supabase client
        ├── supabase-sync.js       # ручная синхронизация из кабинета
        ├── cloud-tasks.js         # чтение задач из Supabase
        ├── nav-auth.js            # состояние навигации и профиля
        ├── auth-bootstrap.js      # локальный профиль для demo
        ├── form-hardening.js      # защита формы от спама
        ├── conflict-modal.js      # окно конфликта времени
        └── supabase/
            └── schema.sql         # схема базы и RLS
```

В корне оставлены только файлы запуска и одна папка `projects/`. Основной код лежит внутри `projects/timeguard/`, чтобы GitHub выглядел аккуратно.

## 6. Supabase: что где находится

| Таблица | Назначение |
|---|---|
| `profiles` | пользователь: email, имя, роль, тариф |
| `tasks` | задачи: дата, начало, окончание, приоритет, категория, статус |
| `task_events` | события авторизованного пользователя |
| `analytics_events` | demo-события для учебной аналитики |

На стороне frontend подключение идёт через:

```text
projects/timeguard/supabase-settings.js
projects/timeguard/supabase-adapter.js
projects/timeguard/app.js
```

В `app.js` задача сначала сохраняется локально, затем отправляется в Supabase. Если пользователь вошёл через Supabase Auth, задача сохраняется с `user_id`. Если это demo-сценарий, используется `demo_session_id`.

## 7. Метрики MVP

- количество созданных задач;
- количество остановленных конфликтов;
- количество выполненных задач;
- количество дней с планами;
- срабатывание Free-лимита;
- открытие paywall;
- отправка задач в Supabase.

## 8. Что говорить преподавателю коротко

> TimeGuard — это frontend-first MVP на HTML, CSS и JavaScript. Главная логика в `app.js`: пользователь добавляет задачу, система проверяет пересечения по времени и сохраняет корректные задачи. Данные хранятся локально в `localStorage` и дополнительно отправляются в Supabase. В Supabase есть таблицы для профилей, задач и событий. Репозиторий очищен: в корне оставлены только запуск, настройки Render и папка `projects`, а основной код лежит внутри `projects/timeguard`.
