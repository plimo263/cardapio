#!/usr/bin/env python3
"""Helper to add `comentarios` table to existing DBs.

Usage:
  python3 backend/scripts/add_comentarios_table.py

Safe to run multiple times.
"""

import os
import sys

# Add backend root to sys.path so `from app import ...` works when running the script
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app import create_app
from app.extensions import db
from sqlalchemy import inspect, text


def main():
    app = create_app()
    with app.app_context():
        try:
            engine = db.get_engine(app)
        except Exception:
            engine = db.engine
        insp = inspect(engine)
        if 'comentarios' in insp.get_table_names():
            print('Tabela `comentarios` já existe.')
            return

        url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        print('Database URL:', url)

        if url.startswith('sqlite:'):
            sql = '''CREATE TABLE comentarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bebida_id INTEGER NOT NULL,
                texto TEXT NOT NULL,
                nota INTEGER NOT NULL,
                autor VARCHAR(100),
                latitude REAL,
                longitude REAL,
                created_at DATETIME DEFAULT (datetime('now')),
                FOREIGN KEY(bebida_id) REFERENCES bebidas(id)
            )'''
        else:
            sql = '''CREATE TABLE comentarios (
                id SERIAL PRIMARY KEY,
                bebida_id INTEGER NOT NULL REFERENCES bebidas(id),
                texto TEXT NOT NULL,
                nota INTEGER NOT NULL,
                autor VARCHAR(100),
                latitude DOUBLE PRECISION,
                longitude DOUBLE PRECISION,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )'''

        print('Running SQL to create comentarios table...')
        with engine.begin() as conn:
            conn.execute(text(sql))

        print('Tabela `comentarios` criada com sucesso.')


if __name__ == '__main__':
    main()
