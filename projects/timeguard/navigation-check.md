# Navigation check

## Goal

Make sure the reviewer can move through the whole MVP without getting lost.

## Primary Render route

1. `https://timeguard-mvp.onrender.com`
2. `https://timeguard-mvp.onrender.com/demo`
3. `https://timeguard-mvp.onrender.com/pitch`
4. `https://timeguard-mvp.onrender.com/planner`
5. `https://timeguard-mvp.onrender.com/cabinet`
6. `https://timeguard-mvp.onrender.com/cloud`
7. `https://timeguard-mvp.onrender.com/pricing`

## GitHub Pages backup route

1. `index.html`
2. `demo-center.html?v=11`
3. `pitch.html?v=11`
4. `app.html?v=11`
5. `cabinet.html?v=11`
6. `cloud.html?v=11`
7. `pricing.html?v=11`
8. `admin.html?v=11`

## Updated navigation

The main navigation now links the key pages together:

- landing -> Demo Center, Pitch, Planner, Cloud;
- Demo Center -> Pitch, Planner, Cabinet, Cloud, Pricing;
- Pitch -> Demo Center, Planner, Cabinet, Cloud;
- Planner -> Demo, Pitch, Cabinet, Cloud, Pricing;
- Cabinet -> Demo, Planner, Cloud, Login, Pricing, Admin;
- Cloud -> Demo, Pitch, Planner, Cabinet, Login;
- Pricing -> Demo, Planner, Cabinet, Cloud;
- Register/Login -> Demo, Planner/Cabinet and auth flow;
- Admin -> Demo, Planner, Cabinet, Pricing.

## Visual check

The final visual layer is applied to:

- landing;
- Demo Center;
- Pitch;
- Planner;
- Cabinet;
- Cloud;
- Pricing;
- Register;
- Login;
- Verify;
- Admin.

## Cache control

Main demo pages use version query parameters:

- `?v=11` for final visual pages on GitHub Pages;
- Render short routes redirect to the same final pages;
- scripts and styles also use versioned URLs where needed.

## Manual test

1. Open the Render live site.
2. Click Demo Center or open `/demo`.
3. Prepare demo data.
4. Check MVP status.
5. Open Pitch.
6. Open Planner.
7. Open Cabinet.
8. Open Cloud.
9. Open Pricing.
10. Return to Demo Center.

## Result

The reviewer can inspect the project from any key page and return to the main defense route. Render is the primary public URL; GitHub Pages is the backup URL.
