
import os
from flask import Flask 
from dotenv import load_dotenv
from extensions import db
# Rotas
from routes.cardapio import cardapio

load_dotenv()

def create_app():
    URI_DATABASE = os.getenv('URI_DATABASE') # Variavel de conexão ao banco

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = URI_DATABASE
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(cardapio)

    return app