import os
import secrets
import requests
from hashlib import sha1
from datetime import datetime
from flask import session
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from extensions import db 
from models import Usuario
from schemas import AcessLoginSchema, UsuarioSchema
from utils.authenticator import Autenticator
from extensions import CHAVE_RECAPTCHA


acesso_login = Blueprint('acesso_login', __name__, description='Operações para login')

@acesso_login.route('/acesso_admin')
class AcessoAdmin(MethodView):

    @acesso_login.arguments(AcessLoginSchema)
    @acesso_login.response(200, schema=AcessLoginSchema)
    def post(self, data_login):
        ''' Autentica o usuário responsável por atualizar as informações, descrições e modelos dos itens do cardápio.'''

        URL = 'https://www.google.com/recaptcha/api/siteverify'
        resposta = requests.post(URL, data = { 'secret': CHAVE_RECAPTCHA, 'response': data_login['captcha'] }).json()

        if not resposta['success']:
            return abort( 400, message='O captcha não foi validado.')
        
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

        session['token'] = new_token

        return {'token': new_token}

@acesso_login.route('/usuario')
class UsuarioDadosRest(MethodView):

    @Autenticator(retornar_usuario=True)
    @acesso_login.response(200, UsuarioSchema)
    def get(self, **kwargs):
        ''' Recupera dados informativos do usuário autenticado no momento.'''
        return kwargs['user']

