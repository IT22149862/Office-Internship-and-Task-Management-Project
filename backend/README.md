# Backend — Orbit API

Spring Boot 3 / Java 17 REST API backed by MongoDB, secured with JWT.

## Run

```bash
cp .env.example .env   # edit values
mvn spring-boot:run
```

Environment variables (see `.env.example`): `MONGODB_URI`, `SERVER_PORT`, `JWT_SECRET`,
`JWT_EXPIRATION_MS`, `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`,
`CORS_ALLOWED_ORIGIN`.

## Architecture

```
config/       Security, CORS, Mongo auditing, default-admin seeding
security/     JWT util + filter, Spring Security UserDetails integration
model/        MongoDB documents (User, Project, Task, WorkLog) + enums
repository/   Spring Data MongoDB repositories
dto/          Request/response payloads, kept separate from persistence models
service/      Business logic and authorization-adjacent rules
controller/   REST endpoints
exception/    Centralized error handling → consistent ApiError JSON responses
```

## Auth

`POST /api/auth/login` with `{ email, password }` returns a JWT. Send it as
`Authorization: Bearer <token>` on every subsequent request. `GET /api/auth/me` returns the
current user's profile.

Roles are `ADMIN` and `INTERN`. Admin-only routes (`/api/interns/**`, task/project mutation
routes, feedback endpoints) are enforced both by Spring Security URL rules and inside the
service layer where per-record ownership matters (e.g. an intern can only update or submit
their own tasks).

## Key endpoints

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | anyone | Sign in |
| GET | `/api/interns` | admin | List/search/filter interns |
| POST | `/api/interns` | admin | Create intern account |
| PUT/PATCH/DELETE | `/api/interns/{id}` | admin | Edit / activate-deactivate / remove |
| GET/POST/PUT/DELETE | `/api/projects` | admin (write), all (read, scoped) | Project CRUD |
| GET/POST/PUT/DELETE | `/api/tasks` | admin (write), all (read, scoped) | Task CRUD |
| PATCH | `/api/tasks/{id}/status` | owner intern | Move task e.g. to IN_PROGRESS |
| POST | `/api/tasks/{id}/submit` | owner intern | Submit work for review |
| POST | `/api/tasks/{id}/feedback` | admin | Approve or request revision |
| GET/POST | `/api/worklogs` | intern (own), admin (all) | Daily logs |
| PATCH | `/api/worklogs/{id}/feedback` | admin | Leave feedback on a log |
| GET | `/api/dashboard/admin` | admin | Aggregate stats |
| GET | `/api/dashboard/intern` | intern | Personal stats |

## Notes

- Passwords are hashed with BCrypt; never stored or returned in plain text.
- MongoDB auditing (`@CreatedDate`) is enabled via `MongoAuditingConfig`.
- A default admin is created on first boot only if no `ADMIN` user exists yet — safe to run
  repeatedly.
