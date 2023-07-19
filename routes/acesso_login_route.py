
import secrets
from hashlib import sha1
from datetime import datetime
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from extensions import db 
from models import Usuario
from schemas import AcessLoginSchema

acesso_login = Blueprint('acesso_login', __name__, description='Operações para login')


@acesso_login.route('/acesso_admin')
class AcessoAdmin(MethodView):

    @acesso_login.arguments(AcessLoginSchema)
    @acesso_login.response(200, schema=AcessLoginSchema)
    def post(self, data_login):
        
        # Autentica o usuario
        hash_senha = sha1(data_login['senha'].encode()).hexdigest()
        email = data_login['email']

        usuario = Usuario.query.filter_by(email = email, senha = hash_senha).first()
        if usuario is None: # Se nao autenticado com email senha retorna erro
            abort(400, message='Usuário e/ou senha incorretos')
        
        # gera um novo token e grava o mesmo
        new_token = sha1(secrets.token_urlsafe(40).encode()).hexdigest()

        usuario.token = new_token
        usuario.data_acesso = datetime.now()
        db.session.add(usuario)
        db.session.commit()

        return {'token': new_token}