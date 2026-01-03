#!/usr/bin/env bash
set -euo pipefail

# Production startup using gunicorn
cd "$( dirname "${BASH_SOURCE[0]}" )/.."

# Export variables from .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi

export FLASK_ENV=production

# Activate virtualenv if present
if [ -f .venv/bin/activate ]; then
  # shellcheck disable=SC1091
  source .venv/bin/activate
fi

exec gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - wsgi:app
