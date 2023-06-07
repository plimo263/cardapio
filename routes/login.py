import json
import os
from hashlib import sha1
import secrets
from datetime import datetime
from flask import Blueprint, request
from extensions import db
from models import Usuario
from utils.validator import Validator, ValidatorString, ValidatorRegex
from utils.authenticator import Autenticator

login = Blueprint('login', __name__)

@login.route('/acesso_admin', methods = ['POST'])
def acesso_admin():
    data = Validator.validate_json(request)
    if 'erro' in data: return json.dumps(data)

    # Cria os validadores
    list_validators = [
        ValidatorRegex('email', '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+', 'Email enviado incorretamente.'),
        ValidatorString('senha', min = 1, msg_error = 'A senha não foi enviada.')
    ]
    v = Validator(list_validators, ['email', 'senha'])
    
    # Valida os campos do schema
    try:
        v.is_valid(data)
    except ValueError as err:
        return json.dumps({'erro': str(err)})

    # Autentica o usuario
    hash_senha = sha1(data['senha'].encode()).hexdigest()
    email = data['email']
    usuario = Usuario.query.filter_by(email = email, senha = hash_senha).first()
    if usuario is None: # Se nao autenticado com email senha retorna erro
        return json.dumps({'erro': 'Usuário e/ou senha incorretos'})
    
    # gera um novo token e grava o mesmo
    new_token = sha1(secrets.token_urlsafe(40).encode()).hexdigest()

    usuario.token = new_token
    usuario.data_acesso = datetime.now()
    db.session.add(usuario)
    db.session.commit()

    return json.dumps({'token': new_token})