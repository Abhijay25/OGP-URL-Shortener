# SnipSnip

A URL shortener built with Express, React, and PostgreSQL.

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

## Setup

### 1. Install dependencies

```bash
cd backend && yarn install
cd ../frontend && yarn install
cd ..
```

### 2. Configure the database URL

Create `backend/.env`:

```
DATABASE_URL="postgresql://snip:snip@localhost:5432/snipsnip?schema=public"
```

### 3. Run the database migration

This creates the `Url` table in Postgres. The database container must be running first:

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

## Deployment

This project is configured for local development. To deploy:

1. Provision a PostgreSQL instance and update `DATABASE_URL` in your environment.
2. Build the frontend: `cd frontend && yarn build` 
3. Run the backend on a server: set `NODE_ENV=production` and start with `node dist/index.js` (after `yarn build` in the backend).
4. Update the hardcoded `http://localhost:3000` references in the frontend to your backend's public URL before building.
