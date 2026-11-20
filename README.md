# Collaborator – Grow Together

A rural entrepreneur collaboration and skill exchange platform for Maharashtra.
Built for Idea Lab III (Department of Computer Engineering) under the theme
**Tech4Startup: Enabling Rural Entrepreneurship through Digital Tools in Maharashtra**.

**Core flow:** NEED → MATCH → COLLABORATE → LEARN

Users post needs or offers (skill exchange, paid services, voluntary help,
resource sharing, joint projects) with a sector and location, browse and match,
connect and agree terms directly, and share lessons as
**Problem → Action → Outcome**.

## Tech stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | React 19 + Vite (talks directly to Supabase)     |
| Backend  | None — no custom server                          |
| Database | PostgreSQL (Supabase)                            |
| Hosting  | Vercel (frontend), Supabase (Postgres)           |

> Note: the project PPT names MySQL / Railway for the database and a
> Node + Express backend. The live build uses Supabase Postgres directly
> from the frontend instead, as decided for deployment; the PPT is
> unchanged.

## Repo layout

```
collaborator-fullstack/
├── frontend/          React 19 + Vite app
│   ├── src/
│   │   ├── App.jsx    All sections (hero, showcase, how it works, features,
│   │   │              30-day plan, case studies, post form, FAQ, scan CTA)
│   │   ├── api.js     Data helpers (listings, connect, matches) via Supabase
│   │   ├── supabase.js  Supabase client (VITE_SUPABASE_URL / ANON_KEY)
│   │   ├── hooks.js   Scroll pop-in animation hook
│   │   └── index.css  Design system (royal blue / pink / teal)
│   └── .env.example   VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── backend/           Express REST API — NO LONGER USED. Kept in the repo
│   └── src/           for reference only; the frontend no longer calls it.
├── db/
│   ├── schema.sql     PostgreSQL tables: listings, connect_requests
│   ├── seed.sql       12 sample listings from rural Maharashtra
│   └── rls_policies.sql  Row Level Security: anon can read/insert listings
│                          and insert connect_requests
└── README.md
```

## Data access (direct Supabase, no API server)

The frontend uses `@supabase/supabase-js` against the `listings` and
`connect_requests` tables:

| Action                     | Supabase query                                          |
| -------------------------- | ------------------------------------------------------- |
| List listings              | `listings` select, newest first; filter by `type`, `sector`, and ILIKE search across title / description / location / provider name |
| One listing                | `listings` select by `id`                               |
| Post a listing             | Insert into `listings` (validated in the app first)     |
| Send a connect request     | Insert into `connect_requests` (`status` = `pending`)   |
| Scan for matches           | `listings` where `location` ILIKE the given place       |

If Supabase cannot be reached, the showcase shows "The Supabase
database is unreachable" instead of listings.

## Run locally

### 1. Database (Supabase Postgres)

Create a free project at [supabase.com](https://supabase.com), then in the
dashboard go to **SQL Editor** and run, in order: `db/schema.sql`,
`db/seed.sql`, then `db/rls_policies.sql` (the last one turns on Row Level
Security with the public read/post/connect policies the site needs).
(No `CREATE DATABASE` step: Supabase provides the database.)

Copy the two client values from **Project Settings → API** — **Project
URL** and **anon public key** — and put them in the frontend `.env`
(see below). These are publishable client keys, not secrets.

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev                 # http://localhost:5173
npm run build               # production build into frontend/dist/
```

With no `.env` values the app builds and loads, but the showcase shows a
"Supabase database is unreachable" error instead of listings.

## Deploy

**Database — Supabase (Postgres):** create a project, run
`db/schema.sql`, then `db/seed.sql`, then `db/rls_policies.sql` in the
SQL Editor.

**Frontend — Vercel:** import the repo, set the root directory to
`frontend/`, build command `npm run build`, output directory `dist`,
and set the environment variables `VITE_SUPABASE_URL` (Project URL)
and `VITE_SUPABASE_ANON_KEY` (anon public key) from
Supabase **Project Settings → API**.

There is no backend server to deploy.

## Notes

- No paid tiers or plans are shown anywhere on the site.
- All listings, connect requests and matches are stored in PostgreSQL
  (Supabase) and read/written directly by the frontend. Nothing is kept
  only in the browser: reloading the page reloads the same data from
  Supabase.
- Animations are fast springy pop-ins (~0.55s) and are disabled when the
  user prefers reduced motion.
