# Collaborator – Grow Together

A rural entrepreneur collaboration and skill exchange platform for Maharashtra.
Built for Idea Lab III (Department of Computer Engineering) under the theme
**Tech4Startup: Enabling Rural Entrepreneurship through Digital Tools in Maharashtra**.

**Core flow:** NEED → MATCH → COLLABORATE → LEARN

Users post needs or offers (skill exchange, paid services, voluntary help,
resource sharing, joint projects) with a sector and location, browse and match,
connect and agree terms directly, and share lessons as
**Problem → Action → Outcome**.

## Tech stack (as per the project PPT)

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19 + Vite                     |
| Backend  | Node.js + Express.js (REST API)     |
| Database | MySQL 8.0                           |
| Hosting  | Vercel (frontend), Render (backend), Railway (MySQL) |

## Repo layout

```
collaborator-fullstack/
├── frontend/          React 19 + Vite app
│   ├── src/
│   │   ├── App.jsx    All sections (hero, showcase, how it works, features,
│   │   │              30-day plan, case studies, post form, FAQ, scan CTA)
│   │   ├── api.js     API helpers (listings, connect, matches)
│   │   ├── hooks.js   Scroll pop-in animation hook
│   │   └── index.css  Design system (royal blue / pink / teal)
│   └── .env.example   VITE_API_URL (production backend URL)
├── backend/           Express REST API
│   └── src/
│       ├── server.js  Routes: listings, connect requests, matches, health
│       └── db.js      MySQL connection pool (mysql2)
├── db/
│   ├── schema.sql     MySQL 8.0 tables: listings, connect_requests
│   └── seed.sql       12 sample listings from rural Maharashtra
└── README.md
```

## API endpoints

| Method | Path                          | Description                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/api/health`                 | API + database status                        |
| GET    | `/api/listings`               | List all; filter with `?search=&sector=&type=` |
| GET    | `/api/listings/:id`           | One listing                                  |
| POST   | `/api/listings`               | Create a listing (validated)                 |
| POST   | `/api/listings/:id/connect`   | Save a connect request for a listing         |
| GET    | `/api/matches?location=...`   | Listings matching a location                 |

## Run locally

### 1. Database (MySQL 8.0)

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p collaborator < db/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # fill in your own DB credentials
npm install
npm start                   # listens on http://localhost:5000
```

Check it: `curl http://localhost:5000/api/health`
→ `{"status":"ok","db":"connected"}` when MySQL is reachable.
If MySQL is down the API still boots and answers `503` with a clear
"Database unavailable" message instead of crashing.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
npm run build               # production build into frontend/dist/
```

For a production build, set `VITE_API_URL` to the deployed backend URL
(see `frontend/.env.example`).

## Deploy

**Database — Railway (MySQL 8.0):** create a MySQL service, run
`db/schema.sql` then `db/seed.sql` against it, and copy its connection
details (host, port, user, password, database) into the backend's
environment variables.

**Backend — Render:** create a Web Service from the `backend/` folder
(or the repo root with root directory set to `backend/`), build command
`npm install`, start command `npm start`, and set the environment
variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.

**Frontend — Vercel:** import the repo, set the root directory to
`frontend/`, build command `npm run build`, output directory `dist`,
and set `VITE_API_URL` to the Render backend URL (for example
`https://collaborator-api.onrender.com`).

## Notes

- No paid tiers or plans are shown anywhere on the site.
- All listings, connect requests and matches are stored in MySQL. Nothing
  is kept only in the browser: reloading the page reloads the same data
  from the API.
- Animations are fast springy pop-ins (~0.55s) and are disabled when the
  user prefers reduced motion.
