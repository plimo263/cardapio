
from hashlib import sha1
import secrets
from sqlalchemy import func
from extensions import db

class Usuario(db.Model):
    '''Tabela de cadastro dos usuarios'''
    id = db.Column(db.Integer, primary_key = True, autoincrement = True, nullable = False)
    nome = db.Column(db.String(150), nullable = False)
    email = db.Column(db.String(100), nullable = False, unique = True)
    senha = db.Column(db.String(40), nullable = False)
    token = db.Column(db.String(40), nullable = False, default = sha1(secrets.token_hex(48).encode()).hexdigest() )
    data_acesso = db.Column(db.DateTime, nullable = True)

    def add(self):
        ''' Realiza a insercao do usuário no banco de dados '''
        self.senha = sha1(self.senha.encode()).hexdigest()
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        ''' Realiza a exclusao do usuario '''
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        ''' Retorna os dados como um dicionario'''
        return {
            'id': self.id, 
            'nome': self.nome, 
            'email': self.email,
            'token': self.token,
            'data_acesso': str(self.data_acesso)
        }