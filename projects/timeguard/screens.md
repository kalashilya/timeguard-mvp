# Screens

## 1. Main landing

File: `index.html`

Purpose: first entry point, short product explanation and links to Demo Center and app.

## 2. Demo Center

File: `demo-center.html`

Purpose: one-page defense hub. It prepares demo data, checks MVP status and links to the main screens.

Main actions:

- prepare demo data;
- check MVP status;
- open Pitch;
- open Planner;
- open Cabinet;
- open Cloud tasks.

## 3. Pitch

File: `pitch.html`

Purpose: short presentation of the project: problem, user, solution, MVP, data, value, monetization and next steps.

## 4. Planner

File: `app.html`

Purpose: main product screen.

Main blocks:

- profile block;
- status block;
- task creation form;
- day timeline;
- progress;
- filters;
- weekly overview;
- export buttons.

## 5. Register

File: `register.html`

Purpose: user registration and profile creation.

## 6. Login

File: `login.html`

Purpose: user login through Supabase.

## 7. Verify step

File: `verify-step.html`

Purpose: educational verification step for auth flow explanation.

## 8. Cabinet

File: `cabinet.html`

Purpose: personal cabinet with saved plans and Supabase synchronization.

Main actions:

- show profile;
- show plan;
- show saved days;
- sync with Supabase;
- open Cloud tasks.

## 9. Cloud tasks

File: `cloud.html`

Purpose: prove that tasks are not only local. The page loads tasks back from Supabase for the current user.

## 10. Pricing

File: `pricing.html`

Purpose: educational paywall and monetization scenario.

## 11. Payment success

File: `payment-success.html`

Purpose: educational tariff activation screen.

## 12. Admin

File: `admin.html`

Purpose: demo admin summary for a user with admin role.

## Defense recommendation

Start from `demo-center.html`, then show `pitch.html`, `app.html`, `cabinet.html`, `cloud.html` and `pricing.html`.
