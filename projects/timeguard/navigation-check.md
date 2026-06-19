# Navigation check

## Goal

Make sure the reviewer can move through the whole MVP without getting lost.

## Main route

1. `index.html`
2. `demo-center.html?v=10`
3. `pitch.html?v=9`
4. `app.html?v=10`
5. `cabinet.html?v=10`
6. `cloud.html?v=10`
7. `pricing.html?v=10`
8. `admin.html?v=10`

## Updated navigation

The main navigation now links the key pages together:

- landing -> Demo Center, Pitch, Planner, Cloud;
- Demo Center -> Pitch, Planner, Cabinet, Cloud, Pricing;
- Planner -> Demo, Pitch, Cabinet, Cloud, Pricing;
- Cabinet -> Demo, Planner, Cloud, Login, Pricing, Admin;
- Cloud -> Demo, Pitch, Planner, Cabinet, Login;
- Pricing -> Demo, Planner, Cabinet, Cloud;
- Register/Login -> Demo, Planner/Cabinet and auth flow;
- Admin -> Demo, Planner, Cabinet, Pricing.

## Cache control

Main demo pages use version query parameters:

- `?v=10` for final checked pages;
- `?v=9` for Pitch page;
- scripts and styles also use versioned URLs where needed.

## Manual test

1. Open the live site.
2. Click Demo Center.
3. Prepare demo data.
4. Check MVP status.
5. Open Pitch.
6. Open Planner.
7. Open Cabinet.
8. Open Cloud.
9. Open Pricing.
10. Return to Demo Center.

## Result

The reviewer can inspect the project from any key page and return to the main defense route.
