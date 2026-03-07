<div align="center">

# ⚡ Tech Insight Tracker

**A full-stack research management tool for developers, researchers, and innovators.**

Organize your research into **Projects** and capture **Insights** — notes, patents, articles — with tags, source links, and rich content.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Docker (Full Stack)](#option-a-docker-recommended)
  - [Local Dev (No Docker)](#option-b-local-dev-no-docker)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Frontend Pages](#-frontend-pages)
- [Authentication Flow](#-authentication-flow)
- [Security Model](#-security-model)
- [Development Guide](#-development-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Tech Insight Tracker** is a single-page application (SPA) that gives researchers and developers a private workspace to:

- Create **Projects** to group related research areas
- Log **Insights** within each project — capturing content, source URLs, and comma-separated tags
- Browse and search insights visually with color-coded tag pills
- Secure every action behind DRF Token Authentication — each user can only see their own data

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Register, login, logout with token-based auth |
| 📁 Projects | Create, view, and delete personal research projects |
| 💡 Insights | Add notes/articles/patents with rich content, source links, and tags |
| 🏷️ Tag Pills | Color-coded badges dynamically generated per tag |
| 🔗 Source URLs | Clickable truncated links per insight |
| 🛡️ Authorization | All data scoped to authenticated owner — no cross-user access |
| 🌙 Dark UI | Premium dark theme (#0f1117 bg, #6366f1 accent) with Inter font |
| 📱 Responsive | Flexible CSS grid, works on desktop and tablet |
| ⚡ Vite HMR | Hot module replacement for instant frontend dev feedback |

---

## 🧰 Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Python | 3.11 | Runtime |
| Django | 4.2.x | Web framework / ORM |
| Django REST Framework | 3.15.x | REST API layer |
| django-cors-headers | 4.4.x | Cross-Origin Resource Sharing |
| psycopg2-binary | 2.9.x | PostgreSQL adapter |
| gunicorn | 22.x | Production WSGI server |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 18.x | UI library |
| react-router-dom | 6.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| Vite | 5.x | Dev server + bundler |

### Infrastructure
| Tool | Purpose |
|---|---|
| PostgreSQL 16 | Primary relational database |
| Docker + Compose | Containerized multi-service setup |
| SQLite | Drop-in local dev database |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│            React SPA — http://localhost:5173                │
│   (React Router, Axios, AuthContext, localStorage token)    │
└────────────────────────┬────────────────────────────────────┘
                         │ /api/* (proxied by Vite dev server)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Django REST Framework                          │
│               http://localhost:8000                         │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │  accounts/   │  │            tracker/                 │  │
│  │  Register    │  │  Projects CRUD  │  Insights CRUD    │  │
│  │  Login       │  │  owner-scoped   │  project-scoped   │  │
│  │  Logout / Me │  └─────────────────────────────────────┘  │
│  └──────────────┘                                           │
│           Token Auth ── DRF Authtoken Table                 │
└────────────────────────┬────────────────────────────────────┘
                         │ ORM / psycopg2
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          PostgreSQL 16 (or SQLite for local dev)            │
└─────────────────────────────────────────────────────────────┘
```

**Request flow for a protected API call:**
1. React app reads `token` from `localStorage`
2. Axios request interceptor injects `Authorization: Token <token>` header
3. DRF `TokenAuthentication` validates the token and resolves to a `User`
4. Queryset filters data to `owner == request.user` before returning results

---

## 📁 Project Structure

```
tech-insight-tracker/
│
├── docker-compose.yml          # Multi-service Docker orchestration
├── .dockerignore               # Root-level Docker build exclusions
├── start.bat                   # Windows: launches both dev servers
├── start.ps1                   # PowerShell: launches both dev servers
├── README.md
│
├── backend/
│   ├── Dockerfile              # Python 3.11-slim image
│   ├── entrypoint.sh           # Wait-for-postgres → migrate → runserver
│   ├── manage.py               # Django CLI entry point
│   ├── requirements.txt        # Pinned Python dependencies
│   ├── .dockerignore
│   │
│   ├── backend_core/           # Django project package
│   │   ├── __init__.py
│   │   ├── settings.py         # Main Django settings (env-driven)
│   │   ├── urls.py             # Root URL router
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── accounts/               # Auth app
│   │   ├── __init__.py
│   │   ├── serializers.py      # Register / Login / User serializers
│   │   ├── views.py            # Register / Login / Logout / Me views
│   │   └── urls.py             # /api/auth/* URL patterns
│   │
│   └── tracker/                # Core research app
│       ├── __init__.py
│       ├── models.py           # Project + Insight ORM models
│       ├── serializers.py      # CRUD serializers
│       ├── views.py            # Owner-scoped viewsets
│       ├── urls.py             # /api/projects/ + /api/insights/ URLs
│       └── admin.py            # Django admin registrations
│
└── frontend/
    ├── Dockerfile              # node:20-alpine image
    ├── index.html              # SPA shell with Inter font
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js          # Proxy /api → Django backend
    ├── .dockerignore
    │
    └── src/
        ├── main.jsx            # ReactDOM.createRoot entry
        ├── App.jsx             # Routes, Navbar, Protected/Guest route wrappers
        ├── api.js              # Axios instance + request/response interceptors
        ├── AuthContext.jsx     # Auth state, login/register/logout helpers
        ├── index.css           # Dark theme CSS variables + global styles
        │
        └── pages/
            ├── Login.jsx           # /login
            ├── Register.jsx        # /register
            ├── ProjectList.jsx     # / — project card grid
            └── ProjectDetail.jsx   # /projects/:id — insight list
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:

| Tool | Version | Check |
|---|---|---|
| Git | any | `git --version` |
| Docker & Docker Compose | 24+ | `docker compose version` |
| — OR — | | |
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

### Option A: Docker (Recommended)

The cleanest way to run the entire stack with **one command**.

```bash
# 1. Clone the repository
git clone https://github.com/Haroldojo/tech-insight-tracker.git
cd tech-insight-tracker

# 2. Start all services (db + web + frontend)
docker compose up --build
```

That's it. Docker will:
- Pull `postgres:16` and start the database
- Build the Django image, wait for Postgres, run `migrate`, then `runserver`
- Build the Node image and start Vite on port 5173

| Service | URL |
|---|---|
| 🌐 Frontend (Vite) | http://localhost:5173 |
| 🔌 Backend API | http://localhost:8000/api/ |
| 🛠️ Django Admin | http://localhost:8000/admin/ |

**Stopping:**
```bash
docker compose down          # stop containers
docker compose down -v       # stop + delete database volume
```

---

### Option B: Local Dev (No Docker)

If you don't have Docker, run each layer directly.

#### 1. Clone the repo
```bash
git clone https://github.com/Haroldojo/tech-insight-tracker.git
cd tech-insight-tracker
```

#### 2. Set up the Python backend
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install Django==4.2.16 djangorestframework==3.15.2 django-cors-headers==4.4.0

# SQLite is used by default for local dev — no Postgres needed.
# Run migrations
python manage.py migrate

# (Optional) Create an admin superuser
python manage.py createsuperuser

# Start the backend
python manage.py runserver
# → http://localhost:8000
```

#### 3. Set up the React frontend
```bash
# New terminal tab / window
cd frontend

npm install
npm run dev
# → http://localhost:5173
```

> **Windows shortcut:** Double-click `start.bat` in the project root to open both servers in separate windows automatically.

---

## 🔧 Environment Variables

The Django backend reads all configuration from environment variables with sensible defaults for development.

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | Hardcoded dev key | Django secret key — **change in production** |
| `DJANGO_DEBUG` | `True` | Set to `False` in production |
| `DJANGO_ALLOWED_HOSTS` | `*` | Comma-separated list of allowed hostnames |
| `POSTGRES_DB` | `techinsight` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `postgres` | Database password — **change in production** |
| `POSTGRES_HOST` | `db` | Hostname of the Postgres service |
| `POSTGRES_PORT` | `5432` | Postgres port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Allowed CORS origins |

Set them in `docker-compose.yml` for Docker, or export them in your shell for local dev:
```bash
export DJANGO_SECRET_KEY="your-real-secret-key-here"
export DJANGO_DEBUG=False
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/`. Token authentication is required unless marked **Public**.

### Auth Endpoints

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register/` | 🌐 Public | `{username, email, password}` | `{token, user}` |
| `POST` | `/api/auth/login/` | 🌐 Public | `{username, password}` | `{token, user}` |
| `POST` | `/api/auth/logout/` | 🔒 Token | — | `204 No Content` |
| `GET` | `/api/auth/me/` | 🔒 Token | — | `{id, username, email}` |

### Project Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects/` | 🔒 Token | List all projects owned by user |
| `POST` | `/api/projects/` | 🔒 Token | Create a new project |
| `GET` | `/api/projects/:id/` | 🔒 Token | Get project detail |
| `PATCH` | `/api/projects/:id/` | 🔒 Token | Partially update a project |
| `DELETE` | `/api/projects/:id/` | 🔒 Token | Delete a project (and all its insights) |

### Insight Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects/:id/insights/` | 🔒 Token | List all insights in a project |
| `POST` | `/api/projects/:id/insights/` | 🔒 Token | Add an insight to a project |
| `GET` | `/api/insights/:id/` | 🔒 Token | Get insight detail |
| `PATCH` | `/api/insights/:id/` | 🔒 Token | Partially update an insight |
| `DELETE` | `/api/insights/:id/` | 🔒 Token | Delete an insight |

### Example Requests

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com", "password": "securepass123"}'
```

**Create a project (with token):**
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -d '{"name": "AI Research 2025", "description": "Tracking AI paper findings"}'
```

**Add an insight to a project:**
```bash
curl -X POST http://localhost:8000/api/projects/1/insights/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -d '{
    "title": "Attention Is All You Need",
    "content": "Introduces the Transformer architecture for NLP tasks.",
    "source_url": "https://arxiv.org/abs/1706.03762",
    "tags": "transformers,attention,NLP,deep-learning"
  }'
```

---

## 🗄️ Database Schema

```sql
-- auth_user (Django built-in)
-- id, username, email, password (hashed), ...

-- authtoken_token (DRF built-in)
-- key (varchar 40, PK), user_id (FK → auth_user)

CREATE TABLE tracker_project (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(255)  NOT NULL,
    description TEXT          NOT NULL DEFAULT '',
    owner_id    INTEGER       NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    created_at  DATETIME      NOT NULL,
    updated_at  DATETIME      NOT NULL
);

CREATE TABLE tracker_insight (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       VARCHAR(255)  NOT NULL,
    content     TEXT          NOT NULL,
    source_url  VARCHAR(200)  NOT NULL DEFAULT '',
    tags        VARCHAR(500)  NOT NULL DEFAULT '',
    project_id  INTEGER       NOT NULL REFERENCES tracker_project(id) ON DELETE CASCADE,
    created_at  DATETIME      NOT NULL,
    updated_at  DATETIME      NOT NULL
);
```

**Key design decisions:**
- `tags` is stored as a comma-separated string for simplicity. A `ManyToMany` Tag model would be a natural next step for filtering.
- All `owner` checks happen at the queryset level — no insight or project can be accessed by a different user even if the ID is guessed.
- `ON DELETE CASCADE` ensures deleting a project removes all its insights atomically.

---

## 🖥️ Frontend Pages

### `/register`
New user registration form. On success, receives a token that is stored in `localStorage` and redirected to `/`.

### `/login`
Credential form. On success, token and user are stored in `localStorage`. Invalid credentials show an inline error.

### `/` — Project List
- Displays all user projects as an animated card grid
- **Hover** a card: subtle lift + purple glow + a **✕ delete button** appears
- **+ New Project** button opens a backdrop-blur modal
- Shows insight count badge per project

### `/projects/:id` — Project Detail
- Project name, description, and date metadata at the top
- Scrollable insight cards with:
  - Title + content (preserved whitespace)
  - **Colored tag pills** — each tag gets a consistent color derived from its hash
  - Clickable **🔗 source URL** (truncated if >60 chars)
  - Timestamp and **Delete** button per insight
- **+ Add Insight** button opens a modal with all fields

---

## 🔐 Authentication Flow

```
User fills /register or /login form
        │
        ▼
POST /api/auth/register/ or /api/auth/login/
        │
        ▼
DRF creates or retrieves Token from authtoken_token table
        │
        ▼
{ token: "abc123...", user: { id, username, email } }
        │
        ▼
AuthContext stores token in localStorage
Axios request interceptor reads localStorage on every request
Header: Authorization: Token abc123...
        │
        ▼
On 401 response → Axios response interceptor clears localStorage
& redirects to /login (auto-logout)
```

---

## 🛡️ Security Model

| Concern | Implementation |
|---|---|
| **Password storage** | Django's PBKDF2 hashing (built-in) |
| **Authentication** | Stateless token in `Authorization` header |
| **Authorization** | All querysets filtered by `owner=request.user` |
| **CORS** | `django-cors-headers` — restricted to known origins in production |
| **No sensitive data in URLs** | Tokens sent in headers only, never in query params |
| **Token invalidation** | `DELETE authtoken_token` on logout — instant revocation |

> ⚠️ **For production**, make sure to set `DJANGO_DEBUG=False`, use a strong `DJANGO_SECRET_KEY`, configure `ALLOWED_HOSTS`, and enforce HTTPS.

---

## 🛠️ Development Guide

### Running Django shell
```bash
cd backend
.\venv\Scripts\activate
python manage.py shell
```

### Creating a superuser for Django Admin
```bash
python manage.py createsuperuser
# → http://localhost:8000/admin/
```

### Running Django migrations after model changes
```bash
python manage.py makemigrations
python manage.py migrate
```

### Resetting the local SQLite database
```bash
rm backend/db.sqlite3
python manage.py migrate
```

### Checking API without a client (HTTPie)
```bash
pip install httpie
http POST localhost:8000/api/auth/login/ username=alice password=securepass123
```

### Frontend — adding a new page
1. Create `frontend/src/pages/NewPage.jsx`
2. Add a `<Route>` in `App.jsx`
3. Wrap with `<ProtectedRoute>` if auth is required

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "feat: add tag filtering"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a **Pull Request** against `main`

Please follow these conventions:
- Commit messages in [Conventional Commits](https://www.conventionalcommits.org/) style
- Backend: PEP 8 formatting (`black backend/`)
- Frontend: consistent use of inline `style` objects with CSS variables

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ⚡ by <a href="https://github.com/Haroldojo">Haroldojo</a>
</div>