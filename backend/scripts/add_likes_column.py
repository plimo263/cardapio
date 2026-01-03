#!/usr/bin/env python3
"""Add `likes` column to `bebidas` table for existing DBs.

Usage:
  python3 backend/scripts/add_likes_column.py

This script checks whether the `likes` column exists and adds it with a
default value (0) if missing. It's safe to run multiple times.
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
        cols = [c['name'] for c in insp.get_columns('bebidas')]
        if 'likes' in cols:
            print('Column `likes` already exists in bebidas table.')
            return

        url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        print('Database URL:', url)

        if url.startswith('sqlite:'):
            sql = 'ALTER TABLE bebidas ADD COLUMN likes INTEGER NOT NULL DEFAULT 0'
        else:
            sql = 'ALTER TABLE bebidas ADD COLUMN likes INTEGER NOT NULL DEFAULT 0'

        print('Running SQL:', sql)
        with engine.begin() as conn:
            conn.execute(text(sql))

        print('Column `likes` added successfully.')


if __name__ == '__main__':
    main()
