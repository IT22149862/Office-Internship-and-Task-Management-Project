# Orbit — Internship Management and Task Tracking System

A full-stack web app for running a software internship end to end: manage interns, create
projects, assign and track tasks through a real review workflow, and collect daily work logs.

- **Backend:** Java 17, Spring Boot 3 (Web, Data MongoDB, Security, Validation), JWT auth
- **Frontend:** React 18 (Vite), React Router, Axios, Recharts
- **Database:** MongoDB

## 1. Prerequisites

- Java 17+ and Maven (or use the included `mvnw` if you add the wrapper)
- Node.js 18+ and npm
- A running MongoDB instance (local install or a free Atlas cluster)

## 2. Backend setup

```bash
cd backend
cp .env.example .env      # then edit values, or export them as real env vars
```

Set at minimum:
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/internship_management`
- `JWT_SECRET` — any long random string (32+ characters)

Run it:

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. On first boot, if no admin account exists yet, a
default administrator is seeded using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your
`.env` (defaults: `admin@internship.local` / `Admin@12345`) — the generated credentials are also
printed to the console log.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env      # VITE_API_BASE_URL should point at your backend, e.g. http://localhost:8080/api
npm install
npm run dev
```

The app starts on `http://localhost:5173`. Log in with the seeded admin account, then use the
**Interns** page to create real intern accounts (interns cannot self-register — this matches
the supervisor-managed workflow in the assignment brief).

## 4. Typical demo workflow

1. Log in as the seeded admin.
2. Go to **Interns → Add Intern** and create an intern account (set a password for them).
3. Go to **Projects → New Project**, fill it in, and assign the intern.
4. Go to **Tasks → New Task**, link it to the project, assign the intern, set a deadline.
5. Log out, log back in as the intern (the email/password you set in step 2).
6. As the intern: open **My Tasks**, start the task, then **Submit Work** with a repo link and
   notes. Add a **Work Log** entry for the day.
7. Log back in as admin: on **Tasks**, click **Review** on the submitted task, then **Approve &
   Complete** or **Request Revision**. Check **Work Logs** to leave feedback on the daily entry.
8. **Dashboard** (both roles) reflects the updated counts immediately.

## 5. Project structure

```
internship-management-system/
├── backend/     Spring Boot API (Java 17, MongoDB, JWT)
└── frontend/    React + Vite single-page app
```

See `backend/README.md` and `frontend/README.md` for details specific to each half.

## 6. Notes on the assignment brief

- Backend is Spring Boot as required, with Spring Web, Spring Data MongoDB, Spring Security
  (JWT, BCrypt password hashing, role-based authorization), and Bean Validation.
- Database is MongoDB as specified, with `users`, `projects`, `tasks`, and `work_logs`
  collections and referential fields between them (project ↔ interns, task ↔ project/intern).
- Task status model matches the brief exactly: `TODO → IN_PROGRESS → SUBMITTED →
  REVISION_REQUIRED / COMPLETED`.
- Global exception handling, field-level validation errors, and consistent JSON error
  responses are implemented in `GlobalExceptionHandler`.
- `.env.example` files are provided for both halves; no secrets are committed.
