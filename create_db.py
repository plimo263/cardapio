'''
Descricao:
  usado para criar a estrutura do banco de dados. Alguns dados 
  também são inicializados como é o caso das categorias.
'''

import sys
import re
from hashlib import sha1
from time import sleep
from sqlalchemy.exc import IntegrityError
from models import *
from utils.validator import validar_senha
from extensions import db
from __init__ import create_app

app = create_app()

regex_email = re.compile('([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

def criar_categorias():
    ''' Criar as categorias padrao '''
    categorias = [
        ['FreeBreakfast', 'Café'],
        ['Fastfood', 'Sucos'],
        ['EmojiFoodBeverage', 'Chá'],
        ['WineBar', 'Alcoólicos']
    ]
    for icone, descricao in categorias:
        db.session.add(Categoria( descricao = descricao, icone = icone))
    db.session.commit()

def criar_usuario():
    ''' Funcao que cria o usuario para interagir com outra opções da API.
    Esta funcao te pergunta nome de usuário e senha para então criar o usuario.
    '''
    sim = '1 SIM'
    nao = '2 NÃO'

    prosseguir = int(input(f'Deseja criar um novo usuário: {sim!r} {nao!r}: '))
    if prosseguir != 1:
        print('Saindo...')
        return False

    email = None 
    senha = None 

    while not email:
        resp = input('Informe o email para criar o usuário: ')
        if not regex_email.match(resp):
            print('E-mail não aceito...')
            continue
        email = resp
    
    print('E-mail aceito, agora vamos criar a senha')
    
    msg_senha = '1 Letra Maiuscula, 1 minuscula, um caractere especial #@!$'
    
    while not senha:
        print(f'Informe a senha, ela deve conter um mínimo de 8 caracteres e {msg_senha!r}')
        resp = input('')
        if not validar_senha(resp):
            print('Senha não atende o padrão aceito')
            print(f'{msg_senha!r} e tamanho minimo de 8 caracteres')
            continue
        senha = resp
    
    print('Criando usuário: ')
    novo_usuario = Usuario(nome = email, email = email, senha = sha1(senha.encode()).hexdigest() )
    try:
        db.session.add(novo_usuario)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        print(f'O email {email!r} já existe não é possível cria-lo novamente')
        return False
    
    print('Usuário criado com sucesso. Os dados para login são: ')
    print('')
    print(f'E-mail: {email!r}')
    print(f'Senha: {senha!r}')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Realizar preenchimento das categorias default
        try:
            criar_categorias()
        except IntegrityError:
            db.session.rollback()
            print('Categorias já existentes na tabela.')
        
        criar_usuario()