#!/usr/bin/env bash
set -e

echo "Starting DB..."
if docker ps -a --format '{{.Names}}' | grep -q '^snipsnip-db$'; then
  docker start snipsnip-db
else
  docker run --name snipsnip-db \
    -e POSTGRES_USER=snip \
    -e POSTGRES_PASSWORD=snip \
    -e POSTGRES_DB=snipsnip \
    -p 5432:5432 \
    -d postgres:16
fi

echo "Starting backend and frontend..."
cd "$(dirname "$0")"
(cd backend && nix-shell --run "PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 yarn dev") &
(cd frontend && yarn dev) &

wait
