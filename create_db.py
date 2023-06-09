'''
Descricao:
 Usado para criar as tabelas da aplicação. Basta chamar este modulo 
 na linha de comando.

 python3 create_db.py
'''

import sys
from hashlib import sha1
from models import *
from extensions import db
from __init__ import create_app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if len(sys.argv) > 1 and sys.argv[1] == 'create_user_default':
            usuario = Usuario(nome='admin', email='admin@example.com', senha=sha1('admin'.encode()).hexdigest())
            db.session.add(usuario)
            db.session.commit()
            print('Usuario: {}\nSenha: {}'.format('admin@example.com', 'admin'))