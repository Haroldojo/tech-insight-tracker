#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! python -c "import socket; s = socket.socket(); s.settimeout(2); s.connect(('db', 5432)); s.close()" 2>/dev/null; do
  echo "  Postgres is unavailable - sleeping 1s"
  sleep 1
done
echo "PostgreSQL is up!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
