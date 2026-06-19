# Render deploy guide

## Current Render URL

TimeGuard Planner is deployed on Render:

`https://timeguard-mvp.onrender.com`

Useful short routes:

- `https://timeguard-mvp.onrender.com/demo`
- `https://timeguard-mvp.onrender.com/pitch`
- `https://timeguard-mvp.onrender.com/planner`
- `https://timeguard-mvp.onrender.com/cabinet`
- `https://timeguard-mvp.onrender.com/cloud`
- `https://timeguard-mvp.onrender.com/pricing`

## Goal

Deploy TimeGuard Planner to Render and get a product-style URL like:

`https://timeguard-mvp.onrender.com`

The project is a static HTML/CSS/JS site, so it does not need a backend server or build step for the current MVP.

## What was added

The repository includes:

`render.yaml`

This file tells Render to publish the repository root as a static site.

## Render settings

Use these settings if creating or recreating the service manually:

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

## Manual verification

1. Open `https://timeguard-mvp.onrender.com`.
2. Open `/demo`.
3. Prepare demo data.
4. Check MVP status.
5. Open `/planner`.
6. Open `/cabinet`.
7. Open `/cloud`.
8. Open `/pricing`.

## Important note

Do not move secret keys to Render environment variables for the current frontend. The MVP uses only Supabase publishable key. Secret/service-role key must not be used in browser code.
