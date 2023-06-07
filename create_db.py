'''
Descricao:
 Usado para criar as tabelas da aplicação. Basta chamar este modulo 
 na linha de comando.

 python3 create_db.py
'''

from models import *
from extensions import db
from __init__ import create_app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()