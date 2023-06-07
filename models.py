# -*- coding: utf-8 -*-
'''
Autor: Marcos Felipe da Silva Jardim
'''
import os
from extensions import db, path_web_normal, path_web_thumb

class Item(db.Model):
    ''' Tabela de itens do cardapio'''
    id = db.Column(db.Integer, primary_key = True)
    nome = db.Column(db.String(150), nullable = False)
    categoria = db.Column(db.String(100), nullable = False)
    descricao = db.Column(db.Text)

    def to_filename(self):
        ''' Retorna o nome do arquivo vinculado ao item '''
        # Consulta a imagem de referencia
        imagem_reg = ImagemItem.query.filter_by(id_item = self.id).first()
        return imagem_reg.imagem

    def to_dict(self):
        ''' Retorna os dados como um dicionario'''
        # Consulta a imagem de referencia
        imagem_reg = ImagemItem.query.filter_by(id_item = self.id).first()
        
        return {
            'id': self.id, 
            'nome': self.nome, 
            'categoria': self.categoria, 
            'descricao': self.descricao,
            'thumb' : os.path.join(path_web_thumb, imagem_reg.imagem ),
            'normal' : os.path.join(path_web_normal, imagem_reg.imagem ),
        }

class ImagemItem(db.Model):
    ''' Tabela de imagens com referencia ao item do cardapio'''
    id = db.Column(db.Integer, primary_key = True)
    imagem = db.Column(db.String(150), nullable = False)
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False)

    def to_dict(self):
        ''' Retorna os dados como um dicionario'''
        return {'id': self.id, 'imagem': self.imagem, 'id_item': self.id_item}
