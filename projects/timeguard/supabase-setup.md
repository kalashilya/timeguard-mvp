# Supabase setup for TimeGuard

This guide connects the static MVP to a real Supabase project.

## Step 1. Create project

1. Open Supabase.
2. Create a new project.
3. Save Project URL.
4. Save public anon key.

## Step 2. Create tables

Open SQL Editor and run:

`projects/timeguard/supabase/schema.sql`

Optional demo rows:

`projects/timeguard/supabase/sample-data.sql`

## Step 3. Create local config file

Copy:

`projects/timeguard/supabase-settings.example.js`

Create:

`projects/timeguard/supabase-settings.js`

Fill values:

```js
window.TIMEGUARD_SUPABASE_CONFIG = {
  url: 'PASTE_PROJECT_URL',
  key: 'PASTE_PUBLIC_KEY'
};
```

## Step 4. Add script tags

Connect these files before `app.js`:

```html
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="supabase-settings.js"></script>
<script src="supabase-adapter.js"></script>
```

## Current status

The repository already contains the Supabase schema and adapter. The real connection requires project URL and public key.
