
import os
from flask import Flask 
from flask_smorest import Api
from dotenv import load_dotenv
from extensions import db
# Rotas
from routes import cardapio
from routes import acesso_login
from routes import cardapio_view
from routes import acesso_login_view
from routes import rede_social

load_dotenv()

CHAVE_RECAPTCHA = os.getenv('RECAPTCHA')

def create_app():
    URI_DATABASE = os.getenv('URI_DATABASE') # Variavel de conexão ao banco
    SECRET_KEY = os.getenv('SECRET_KEY') # Secret app flask
    APP_DEBUG = int(os.getenv('APP_DEBUG'))

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = URI_DATABASE
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['API_TITLE'] = 'Cardapio'
    app.config['API_VERSION'] = 'V1'
    app.config['OPENAPI_VERSION'] = '3.0.3'
        
    if APP_DEBUG: # Modo debug exibe a pagina do swagger
        app.config['OPENAPI_URL_PREFIX'] = '/'
        app.config['OPENAPI_SWAGGER_UI_PATH'] = '/swagger-ui'
        app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'
    
    app.debug = True if APP_DEBUG else False

    db.init_app(app)

    api = Api(app)

    api.register_blueprint(cardapio)
    api.register_blueprint(acesso_login)
    api.register_blueprint(rede_social)

    app.register_blueprint(cardapio_view)
    app.register_blueprint(acesso_login_view)

    app.secret_key = SECRET_KEY

    return app