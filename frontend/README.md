# Frontend — Amber Gold Redesign

React 18 + Vite single-page app for the internship management system. This is a full visual
redesign on top of the same backend API — no backend changes required.

## Run

```bash
cp .env.example .env   # set VITE_API_BASE_URL to your backend, e.g. http://localhost:8080/api
npm install
npm run dev
```

Build for production with `npm run build` (outputs to `dist/`).

## What changed in this redesign

- **Color system**: everything rebuilt around Amber Gold (`#F59E0B`) — warm cream canvas,
  charcoal text, gold gradients for primary actions and hero stat cards. Semantic colors
  (info blue, success green, danger red) are kept distinct from the brand gold so status still
  reads clearly.
- **Typography**: Fraunces (display serif) + Manrope (body) + IBM Plex Mono (numerals),
  replacing the previous Space Grotesk/Inter pairing.
- **Layout**: the old dark left sidebar is gone — replaced with a sticky top navigation bar
  with pill-style tabs and a warm, spacious canvas.
- **Login page**: full-bleed gradient-mesh background in amber/gold tones with an abstract
  illustrated portrait (`components/ui/PortraitIllustration.jsx`) — intentionally a stylized
  illustration rather than a real photograph, since sourcing a photo of a real, identifiable
  person isn't something I can do responsibly. "Welcome to Our System" heading, no brand name,
  no descriptive copy, no sample credentials on the page itself.
- **Admin forms as Floating Cards**: `components/ui/Modal.jsx` now renders every admin
  create/edit form as an elevated, gradient-topped card that animates up over the page.
- **Intern-specific layouts**: tasks are a five-column Kanban board (`kanban-board` /
  `kanban-column` / `kanban-card` classes) instead of a flat list; work logs render as a
  vertical timeline (`timeline` classes); projects are shown as accented cards.

## Structure

```
src/
├── api/          axios instance + one module per resource — unchanged endpoints, matches
│                  the backend controllers exactly (no update/delete for work logs, since the
│                  backend doesn't expose those)
├── context/       AuthContext — logged-in user, login/logout, token persistence (ims_token / ims_user)
├── components/
│   ├── ui/        Icons, StatusPill, StatusLadder, Modal (floating card), StatCard,
│   │              EmptyState, PortraitIllustration
│   └── layout/     Topbar + Layout shell
├── pages/
│   ├── Login.jsx
│   ├── admin/      Dashboard, Interns, Projects, Tasks, WorkLogs — floating-card forms
│   └── intern/     Dashboard, Projects (cards), Tasks (Kanban), WorkLogs (timeline)
└── App.jsx         Route table with role-based protected routes
```

## Connecting to the backend

Make sure the backend's `CORS_ALLOWED_ORIGIN` matches this app's dev URL (`http://localhost:5173`
by default). This redesign makes **no backend changes** — every API call in `src/api/*.js`
matches the existing Spring Boot controllers exactly.
