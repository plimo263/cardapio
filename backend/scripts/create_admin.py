
#!/usr/bin/env python3
"""Script para criar usuário admin no banco de dados."""

import os
import sys

# Adiciona o diretório `backend` no sys.path para que `from app import ...` funcione
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app import create_app
from app.extensions import db
from app.models.user import User

EMAIL = "admin@cardapio.com.br"
USERNAME = "admin"
PASSWORD = "meu@cardapio"


def main():
    app = create_app()
    with app.app_context():
        # garante que as tabelas existam em ambientes de desenvolvimento
        db.create_all()

        existing = User.query.filter((User.username == USERNAME) | (User.email == EMAIL)).first()
        if existing:
            print(f"Usuário já existe: {existing.username} ({existing.email})")
            return

        user = User(username=USERNAME, email=EMAIL, is_admin=True)
        user.set_password(PASSWORD)
        user.generate_token()

        db.session.add(user)
        db.session.commit()

        print("Usuário admin criado com sucesso.")
        print(f"email: {EMAIL}")
        print(f"senha: {PASSWORD}")


if __name__ == "__main__":
    main()
