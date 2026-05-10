# SnipSnip

A URL shortener built with Express, React, and PostgreSQL.

**Live:** [https://ogp-url-shortener.vercel.app](https://ogp-url-shortener.vercel.app)

## Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Backend  | Express + TypeScript           |
| Database | PostgreSQL (Docker) + Prisma   |
| Frontend | React + Vite + Tailwind CSS    |

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Yarn](https://yarnpkg.com)
- [Docker](https://www.docker.com)

> **NixOS users:** the backend must run inside `nix-shell` for Prisma's schema engine to work. `run.sh` handles this automatically.

## Local Setup

### 1. Install dependencies

```bash
cd backend && yarn install
cd ../frontend && yarn install
cd ..
```

### 2. Configure environment variables

Create `backend/.env`:

```
DATABASE_URL="postgresql://snip:snip@localhost:5432/snipsnip?schema=public"
```

Create `frontend/.env`:

```
VITE_EXPRESS_URL=http://localhost:3000
```

### 3. Run the database migration

The database container must be running first:

```bash
docker run --name snipsnip-db \
  -e POSTGRES_USER=snip \
  -e POSTGRES_PASSWORD=snip \
  -e POSTGRES_DB=snipsnip \
  -p 5432:5432 \
  -d postgres:16
```

Then run the migration (NixOS):

```bash
cd backend
nix-shell --run "yarn prisma migrate deploy"
```

Non-NixOS:

```bash
cd backend && yarn prisma migrate deploy
```

### 4. Start the app

```bash
./run.sh
```

This starts the Postgres container (or creates it on first run), the backend on port 3000, and the frontend on port 5173.

Open [http://localhost:5173](http://localhost:5173).

## API

| Method | Path          | Body                        | Response                        |
|--------|---------------|-----------------------------|---------------------------------|
| GET    | `/health`     | —                           | `{ status: "ok" }`              |
| POST   | `/shorten`    | `{ url, customAlias? }`     | `{ shortUrl }`                  |
| GET    | `/:shortCode` | —                           | 302 redirect or 404             |
| GET    | `/history`    | —                           | `{ urls: [...] }`               |

## Tests

```bash
cd backend && yarn test
```

Requires the Postgres container to be running. Tests wipe the `Url` table before each run.

## Deployment

Deployed on [Render](https://render.com) (backend + PostgreSQL) and [Vercel](https://vercel.com) (frontend).

### Backend (Render)

1. Create a **PostgreSQL** instance on Render (free tier)
2. Create a **Web Service**, set Root Directory to `backend`
3. Set Build Command: `yarn && yarn prisma generate && yarn build`
4. Set Start Command: `yarn prisma migrate deploy && yarn start`
5. Add environment variables:
   - `DATABASE_URL` — Internal Database URL from the Postgres instance
   - `BASE_URL` — public URL of the web service (e.g. `https://your-app.onrender.com`)
   - `FRONTEND_URL` — public URL of the frontend (e.g. `https://your-app.vercel.app`)

### Frontend (Vercel)

1. Import the repo, set Root Directory to `frontend`
2. Add environment variable:
   - `VITE_EXPRESS_URL` — public URL of the backend (e.g. `https://your-app.onrender.com`)
3. Deploy
