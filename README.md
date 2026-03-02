# 🏢 `multiTenantV1`

A **full-stack Node.js/Express boilerplate with built‑in multi‑tenant support**, currently shipping
robust authentication and tenant API key management.  
This repository demonstrates a layered architecture with clear separation between
controllers, services and repositories, and comes with validation and error-handling middleware.

> **Status (Mar‑2026):** All of authentication, tenant registration and event ingestion/lookup are
implemented and battle‑tested. Future work will add per‑tenant resources and authorization.

---

## 🔧 Core Features

- **User authentication**
  - Sign‑up (verify), login, refresh, logout
  - Password hashing with bcrypt
  - Refresh‑token rotation with revocation strategy
  - JWT access tokens with role/tenant payloads
  - Validation of credentials using `express-validator` schemas
- **Multi‑tenant primitives**
  - Tenant registration with auto‑generated API key
  - API‑key middleware (`X-API-Key` header) to authenticate
  - Event ingestion (`type` + `payload` JSONB) per tenant
  - Event querying with filters, pagination cursor, time window
- Clean MVC layout:
  - `controllers/`, `services/`, `repositories/`
  - `middlewares/` for auth, validation and error handling
  - `utils/` for reusable cryptographic helpers (bcrypt, crypto, JWT)
- PostgreSQL integration via `pg` pool helper (`config/db.js`)
- Basic request/response conventions and error handling using `AppError`

---

## 🛠️ Prerequisites & Setup

Clone, install, and configure environment variables before running the server.

```bash
git clone <https://github.com/RITAKRAJPANDEY/multi-tenent-versions.git>
cd multiTenantV1
npm install
```

Create a `.env` file or export variables:

```
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=multi_tenant
DB_PASSWORD=secret
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

Start the application:

```bash
npm start                # or `node server.js`
# for development prefer `nodemon server.js` with a `dev` script
```

The Express app listens on `PORT` (default 3000).

---

## 🔗 API Endpoints

All routes are prefixed with `/api` by default (`server.js` config).

### Authentication

| Method | Path                  | Body schema                   | Description                       | Response codes                     |
|--------|-----------------------|-------------------------------|-----------------------------------|------------------------------------|
| POST   | `/api/auth/verify`    | `{username, password, role}`  | Register a new user (hash stored) | 201 created / 409 user exists      |
| POST   | `/api/auth/login`     | `{username, password}`        | Issue access + refresh tokens     | 202 accepted / 401/403 errors      |
| POST   | `/api/auth/refresh`   | `{refreshToken}`              | Rotate tokens (access/refresh)    | 200 OK / 401/403                   |
| POST   | `/api/auth/logout`    | `{refreshToken}`              | Revoke a refresh token            | 204 no content / 401              |

> **Validation**: The `validator/user.validator.js` schema enforces
> username length 3‑30, password 8‑12 characters with mixed case, digits, special
> characters. Errors are handled by `validator.middleware.js`.

**Token handling details**

- Access tokens are JWTs signed with `JWT_SECRET`. Payload contains `userId` and
  `role` (tenant will be added later).
- Refresh tokens are unpredictable 64‑byte hex strings; a SHA‑256 hash is
  stored in the `refresh_tokens` table. Rotation uses a DB transaction to
  mark the old token revoked and insert the new hash, preventing replay.
- Revoked or expired refresh tokens produce `401` or `403` errors as
  appropriate. See `services/auth.service.js` for logic.

### Tenant Management & Events

| Method | Path                  | Header/Body                                        | Description                                           |
|--------|-----------------------|----------------------------------------------------|-------------------------------------------------------|
| POST   | `/api/tenant/register`| `{tenantname}`                                     | Create tenant; returns generated API key             |
| POST   | `/api/tenant/add/events` | Header: `X-API-Key: <key>`<br/>Body `{payload,type}` | Ingest an arbitrary JSON event for the tenant        |
| GET    | `/api/tenant/view/events`| Header: `X-API-Key`<br/>Query params (see below)   | List events with filters and cursor pagination       |

> **API key middleware**: `middlewares/tenant.apiKey.middleware.js` hashes
> incoming key and looks up `api_keys` table. Revoked keys are rejected. On
> success `req.client` gains `{tenant_id}` for downstream handlers.

**Event filtering parameters**

- `type` — string equality filter
- `from`, `to` — ISO‑8601 timestamps bounding `created_at`
- `limit` — maximum number of rows to return (default 100)
- `cursor` — object `{created_at,id}` used for cursor‑based pagination
  (descending order). Requires previous response values.

Server-side code composes SQL queries dynamically to support combinations of
these filters (see `repositories/tenant.repo.js`).

### Error Structure

All operational errors use the custom `AppError` class. The error middleware
(`middlewares/error.middleware.js`) returns JSON:

```json
{ "success": false, "message": "<reason>", "status": <httpStatus> }
```

Validation failures produce a `400` with an array of field errors.

---

## 📁 Project Structure Overview

```
config/           – PostgreSQL helper (pg Pool)
controllers/      – Express route handlers (thin layer)
middlewares/      – auth, tenant api‑key, validation, error handling
repositories/     – raw SQL queries & transactions
routers/          – Express routers wired to controllers
services/         – business logic & domain rules
utils/            – bcrypt util, crypto hashing, JWT token helpers
validator/        – express-validator schemas for request bodies
errors/           – custom AppError class
```

Each layer returns plain JavaScript objects; Express handles JSON serialization.

---

## 🧠 Internal Utilities

- `utils/bcrypt.util.js` – wraps `bcrypt.hash`/`compare` with sensible defaults
- `utils/crypto.util.js` – `genRandomBytes` (hex), SHA‑256 hashing
- `utils/jwt.util.js` – functions for signing/verify access tokens

These utilities are deliberately small so the core logic remains readable.

---

## 🛠 Development Tips

- Add environment variables via `.env` or your process manager.
- Run `npm run dev` (if configured) to use `nodemon` for auto‑reload.
- SQL tables expected by the repos include `tenant_users`, `refresh_tokens`,
  `tenants`, `api_keys`, and `tenant_events`; migrations are not included here.
- You can test API key middleware by hitting `/api/tenant/register` then
  copying the returned `apiKey` for subsequent requests.

---

## 🎯 Roadmap & TODOs

1. Add per‑tenant authorization and associate users with tenants.
2. Implement tenant resource CRUD operations (e.g. projects, documents).
3. Migrate SQL queries into a proper query builder or ORM for maintainability.
4. Write unit/integration tests and add CI configuration.
5. Improve error messages and log correlation IDs.
6. Add rate limiting per tenant using the API key.

Contributions welcome! The code is intentionally minimal so you can pivot
quickly into new feature work.

---

## 📄 License

[Insert license here, e.g. MIT]

---

Feel free to fork and build your own multi‑tenant backends – this boilerplate is
meant to give you a head start on the hard bits.

1. **Clone the repo**

   ```bash
   git clone <your‑repo‑url>
   cd multiTenantV1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` (or set environment variables) with at least:

   ```
   PORT=3000
   DATABASE_URL=postgres://user:pass@localhost:5432/dbname
   JWT_SECRET=your_secret
   ```

   Adjust as needed for your DB and JWT settings.

4. **Run the server**

   ```bash
   npm start
   ```

   By default the Express app listens on `PORT` (3000).

---

## 🧩 Authentication Endpoints

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/auth/signup`| Register a new user      |
| POST   | `/api/auth/login` | Authenticate & receive JWT |

> Requests should be JSON; validation is enforced by `validator/userValidator.js` and middleware.

---

## 🗂 Project Structure

```
config/           – db connection
controllers/      – request handlers
middlewares/      – auth, validation, error handling
repositories/     – data access
routers/          – endpoint definitions
services/         – business logic
utils/            – bcrypt, crypto, jwt helpers
validator/        – Joi schemas, etc.
```

---

## 🛠️ Development Notes

- Authentication logic lives in `auth.*` files across layers.
- Database logic currently uses PostgreSQL (see `config/db.js`).
- Run `node server.js` or define a `dev` script with nodemon for hot reload.

---

## 🎯 Next Steps (TODO)

1. Flesh out tenant creation / selection.
2. Add authorization checks based on tenant membership.
3. Expand the router/controller/service layers for tenant resources.
4. Write tests and improve error handling.

---

## 📄 License

[Specify your license here]

---

