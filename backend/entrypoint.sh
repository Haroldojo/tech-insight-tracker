#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! python -c "import socket; s = socket.socket(); s.settimeout(2); s.connect(('${POSTGRES_HOST:-db}', int('${POSTGRES_PORT:-5432}'))); s.close()" 2>/dev/null; do
  echo "  Postgres is unavailable - sleeping 1s"
  sleep 1
done
echo "PostgreSQL is up!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting gunicorn..."
exec gunicorn backend_core.wsgi:application \
  --bind 0.0.0.0:${PORT:-8000} \
  --workers 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
