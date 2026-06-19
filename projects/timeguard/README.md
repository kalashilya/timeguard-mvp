# TimeGuard Planner MVP

Web MVP for planning a day without time conflicts.

Live demo: `https://kalashilya.github.io/timeguard-mvp/`

## What TimeGuard does

The user adds tasks for a selected date, sets start and end time, priority and category. Before saving, the app checks if the new task overlaps with existing tasks.

## Final site files

- `app.html` — main page and planner;
- `app.css` — visual style;
- `app.js` — profile, tasks, conflicts, limits and plan logic;
- `cabinet.html` — user cabinet;
- `pricing.html` — pricing screen;
- `payment-success.html` — plan activation step;
- `admin.html` — demo summary page.

## Project documents

- `open-local.md`;
- `demo-exam-scenario.md`;
- `security-checklist.md`;
- `analytics.md`;
- `deploy.md`;
- `test-plan.md`;
- `presentation-outline.md`;
- `defense-cheatsheet.md`;
- `user-flow.md`;
- `ui-map.md`;
- `components-map.md`;
- `release-plan.md`;
- `data-model.md`;
- `data-next.md`.

## Data

Browser storage is used:

- `timeguard_profile_v1`;
- `timeguard_tasks_v1`;
- `timeguard_stats_v1`.

## Roles

- `guest` — visitor without saved profile;
- `user` — user with saved profile;
- `admin` — demo role for summary page.

## What the site can do

1. Show product value on the first screen.
2. Save a demo user profile.
3. Add tasks for a selected date.
4. Sort tasks by time.
5. Block overlapping tasks.
6. Save plans in browser storage.
7. Show saved days in cabinet.
8. Apply Free limits.
9. Show plan selection step.
10. Show admin summary for admin role.
11. Protect form from rapid repeated clicks.

## MVP limitation

This is an educational frontend MVP. The next stage is a server database and a real account system.
