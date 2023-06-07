'''
Descricao:
  Referencia ao SQLAlchemy para ser usado por toda a aplicação, 
  caminho para salvar as imagens e caminho para montar o acesso 
  web das imagens
'''
import os
from flask_sqlalchemy import SQLAlchemy

dir_base = os.path.dirname(__file__)

db = SQLAlchemy()

# Caminho para salvar as imagens no servidor
path_dir_save_thumb = os.path.join(dir_base, 'static', 'imagens', 'pequeno')
path_dir_save_normal = os.path.join(dir_base, 'static', 'imagens', 'medio')

# Caminho para as imagens a serem acessadas via web
path_web_thumb = os.path.join('static', 'imagens', 'pequeno')
path_web_normal = os.path.join('static', 'imagens', 'medio')