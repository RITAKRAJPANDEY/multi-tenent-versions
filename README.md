# 🏢 `multiTenantV1`

A lightweight Node.js/Express boilerplate for a multi‑tenant backend.  
Currently the only implemented feature is **user authentication**; further tenant‑specific APIs are on the roadmap.

> **Note:** This README reflects the state of the project as of Feb‑2026: auth only.

---

## 🔧 Features (so far)

- Email/password signup & login  
- JWT‑based sessions  
- Organized MVC structure with:
  - `controllers/`, `services/`, `repositories/`
  - middleware for validation, errors, and auth
- Utilities for bcrypt, crypto, and JWT handling
- Database connection helper in `config/db.js`
- Route definitions in `routers/auth.rout.js`

*Multi‑tenant logic (tenant controller, repo, etc.) exists but is not yet wired into business logic.*

---

## 🚀 Getting Started

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

Feel free to extend this README as you build out the multi‑tenant features – it’s already set up to grow with the project.