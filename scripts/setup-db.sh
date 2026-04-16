#!/bin/bash
set -e

# Acadia Media Monitor - Local PostgreSQL Setup
# Creates the database, applies migrations, and seeds data.
#
# Prerequisites:
#   - PostgreSQL installed and running locally
#   - psql command available
#
# Usage:
#   bash scripts/setup-db.sh
#
# Environment variables (all optional, defaults shown):
#   DB_NAME=media_monitoring
#   DB_USER=acadia
#   DB_PASS=acadia
#   DB_HOST=localhost
#   DB_PORT=5432

DB_NAME="${DB_NAME:-media_monitoring}"
DB_USER="${DB_USER:-acadia}"
DB_PASS="${DB_PASS:-acadia}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

CONN="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "=== Acadia Media Monitor - Database Setup ==="
echo "Database: ${DB_NAME} @ ${DB_HOST}:${DB_PORT}"
echo ""

# Create user (ignore error if exists)
echo "Creating user '${DB_USER}'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c \
  "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}' CREATEDB;" 2>/dev/null || \
  echo "  (user already exists, skipping)"

# Create database (ignore error if exists)
echo "Creating database '${DB_NAME}'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c \
  "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || \
  echo "  (database already exists, skipping)"

# Grant privileges
psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c \
  "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" 2>/dev/null || true

echo ""
echo "--- Applying migrations ---"
for f in supabase/migrations/*.sql; do
  echo "  $(basename "$f")..."
  psql "$CONN" -f "$f" -q 2>&1 | grep -v "^$" | head -3 || true
done

echo ""
echo "--- Applying seed data ---"
for f in supabase/seed/*.sql; do
  echo "  $(basename "$f")..."
  psql "$CONN" -f "$f" -q 2>&1 | grep -v "^$" | head -3 || true
done

echo ""
echo "=== Setup complete ==="
echo ""
echo "Connection string for .env.local:"
echo "  DATABASE_URL=${CONN}"
