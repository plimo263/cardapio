#!/usr/bin/env bash
set -euo pipefail

# Dev startup using gunicorn with --reload
cd "$( dirname "${BASH_SOURCE[0]}" )/.."

# Export variables from .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi

export FLASK_ENV=development

# Activate virtualenv if present
if [ -f .venv/bin/activate ]; then
  # shellcheck disable=SC1091
  source .venv/bin/activate
fi

exec gunicorn -w 1 -b 127.0.0.1:5000 --reload --access-logfile - --log-level info wsgi:app
