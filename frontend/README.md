# Frontend — Orbit

React 18 + Vite single-page app for the Orbit internship management system.

## Run

```bash
npm install
npm run dev
```

No `.env` file is needed — the backend API URL is hardcoded in `src/api/axios.js`
(`http://localhost:8080/api` by default). If your backend runs somewhere else, just edit that
one line.

## Structure

```
src/
├── api/          axios instance + one module per resource (auth, interns, projects, tasks, worklogs, dashboard)
├── context/       AuthContext — holds the logged-in user, login/logout, token persistence
├── components/
│   ├── ui/        Reusable primitives: Icons, StatusPill, StatusLadder, Modal, StatCard, EmptyState
│   └── layout/     Sidebar + Layout shell
├── pages/
│   ├── Login.jsx
│   ├── admin/      Dashboard, Interns, Projects, Tasks, WorkLogs
│   └── intern/     Dashboard, Projects, Tasks, WorkLogs
└── App.jsx         Route table with role-based protected routes
```

## Design notes

- Custom design system in `src/index.css` (no UI framework) — deep-ink sidebar, indigo/amber
  accent palette, Space Grotesk for display type, IBM Plex Mono for stat numerals.
- The **status ladder** (`components/ui/StatusLadder.jsx`) visualizes the five real task states
  from the brief (`TODO → IN_PROGRESS → SUBMITTED → REVISION_REQUIRED/COMPLETED`) as a filled
  progress bar instead of a generic badge, so progress reads at a glance in both the admin task
  table and the intern's task cards.
- Auth token is stored in `localStorage` and attached to every request via an axios request
  interceptor; a 401 response interceptor clears the session and redirects to `/login`.
- Role-based routing: `ProtectedRoute` redirects unauthenticated users to `/login` and redirects
  users with the wrong role to their own dashboard.

## Connecting to the backend

Make sure the backend's `CORS_ALLOWED_ORIGIN` matches this app's dev URL (`http://localhost:5173`
by default) — see the backend README.
