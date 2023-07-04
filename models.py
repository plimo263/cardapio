# -*- coding: utf-8 -*-
'''
Autor: Marcos Felipe da Silva Jardim
'''
import os
from hashlib import sha1
from sqlalchemy import func
from extensions import db, path_web_normal, path_web_thumb

class Usuario(db.Model):
    '''Tabela de cadastro dos usuarios'''
    id = db.Column(db.Integer, primary_key = True)
    nome = db.Column(db.String(150), nullable = False)
    email = db.Column(db.String(100), nullable = False, unique = True)
    senha = db.Column(db.String(40), nullable = False)
    token = db.Column(db.String(40))
    data_acesso = db.Column(db.DateTime)

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
    
    def add(self):
        ''' Realiza a inserção do item no banco de dados '''
        db.session.add(self)
        db.session.commit()
    
    def update(self, name: str, description: str, category: str):
        ''' Realiza a atualização do item recebendo os campos necessarios para atualizacao
        
        Parameters:
            name: Novo nome do item
            description: Nova descrição para o item
            category: Nova categoria a encaixar o item
        '''
        self.nome = name
        self.descricao = description
        self.categoria = category
        db.session.add(self)
        db.session.commit()

    def delete(self):
        ''' Realiza a exclusao do item '''
        # Recebe a referencia da imagem e a exclui
        imagem_reg = ImagemItem.query.filter_by(id_item = self.id).first()
        if not imagem_reg is None:
            db.session.delete(imagem_reg)
            db.session.commit()
        # Agora exclui o item em questao
        db.session.delete(self)
        db.session.commit()


class ImagemItem(db.Model):
    ''' Tabela de imagens com referencia ao item do cardapio'''
    id = db.Column(db.Integer, primary_key = True)
    imagem = db.Column(db.String(150), nullable = False)
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False)

    def add(self):
        ''' Realiza a inserção do registro no banco de dados '''
        db.session.add(self)
        db.session.commit()

    def to_dict(self):
        ''' Retorna os dados como um dicionario'''
        return {'id': self.id, 'imagem': self.imagem, 'id_item': self.id_item}


class Favorito(db.Model):
    ''' Tabela para favoritar itens'''
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False, primary_key = True)
    id_identificador = db.Column(db.BINARY(16), nullable = False, primary_key = True)

    def add(self):
        ''' Realiza a inserção de um favoritado '''
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        ''' Realiza a remoção de um favoritado '''
        db.session.delete(self)
        db.session.commit()
    
    def to_dict(self):
        ''' Retorna uma representação em dicionario do favoritado '''

        return {
            "id_item": self.id_item,
            "id_identificador": self.id_identificador
        }


class Comentario(db.Model):
    ''' Tabela para deixar um comentario sobre o item'''
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False, primary_key = True)
    id_identificador = db.Column(db.BINARY(16), nullable = False, primary_key = True)
    comentario = db.Column(db.Text, nullable = False)
    data = db.Column(db.DateTime, default=func.now)

    def add(self):
        ''' Realiza a inserção de um comentario '''
        db.session.add(self)
        db.session.commit()
    
    def to_dict(self):
        ''' Retorna uma representação em dicionario do comentario '''

        return {
            "id_item": self.id_item,
            "id_identificador": self.id_identificador,
            "comentario": self.comentario,
            "data": str(self.data)
        }


