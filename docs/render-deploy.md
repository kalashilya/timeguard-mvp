# Render deploy guide

## Goal

Deploy TimeGuard Planner to Render and get a product-style URL like:

`https://timeguard-planner.onrender.com`

The project is a static HTML/CSS/JS site, so it does not need a backend server or build step for the current MVP.

## What was added

The repository now includes:

`render.yaml`

This file tells Render to publish the repository root as a static site.

## Render settings

Use these settings if creating the service manually:

| Field | Value |
|---|---|
| Service type | Static Site |
| Repository | `kalashilya/timeguard-mvp` |
| Branch | `main` |
| Build Command | `echo "Static HTML/CSS/JS site — no build step required"` |
| Publish Directory | `.` |
| Root Directory | empty / repository root |

## Blueprint mode

If Render detects `render.yaml`, use Blueprint deployment.

The file defines:

- static runtime;
- free plan;
- repository root as publish directory;
- security headers;
- short redirects:
  - `/demo`;
  - `/pitch`;
  - `/planner`;
  - `/cabinet`;
  - `/cloud`;
  - `/pricing`.

## Manual steps

1. Open Render Dashboard.
2. Click `New`.
3. Choose `Static Site` or `Blueprint`.
4. Connect GitHub repository `kalashilya/timeguard-mvp`.
5. Select branch `main`.
6. Confirm the settings.
7. Deploy.
8. Wait until Render gives an `onrender.com` URL.
9. Open the new URL and check the main route.
10. Check these short routes:
    - `/demo`;
    - `/planner`;
    - `/cloud`;
    - `/pricing`.

## After deployment

Update these files with the Render URL:

- root `README.md`;
- `docs/final-submission.md`;
- `projects/timeguard/teacher-demo-script.md`;
- `projects/timeguard/navigation-check.md`.

Do this only after the Render URL is created.

## Important note

Do not move secret keys to Render environment variables for the current frontend. The MVP uses only Supabase publishable key. Secret/service-role key must not be used in browser code.
