#!/bin/sh
set -e

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] DATABASE_URL detected, checking migrations..."
  node scripts/migrate.mjs || {
    echo "[entrypoint] Migration failed! Aborting container start."
    exit 1
  }
fi

exec "$@"

