#!/usr/bin/env python3
"""Small helper to add `active` column to `users` table when upgrading existing DB.

Usage:
  python3 backend/scripts/add_active_column.py

This script checks whether the `active` column exists and adds it with a
default value (True) if missing. It's safe to run multiple times.
"""

import os
from app import create_app
from app.extensions import db
from sqlalchemy import inspect, text


def main():
    app = create_app()
    with app.app_context():
        engine = db.get_engine(app)
        insp = inspect(engine)
        cols = [c['name'] for c in insp.get_columns('users')]
        if 'active' in cols:
            print('Column `active` already exists in users table.')
            return

        url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        print('Database URL:', url)

        # SQLite uses INTEGER for boolean
        if url.startswith('sqlite:'):
            sql = 'ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1'
        else:
            sql = 'ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT true'

        print('Running SQL:', sql)
        with engine.begin() as conn:
            conn.execute(text(sql))

        print('Column `active` added successfully.')


if __name__ == '__main__':
    main()
