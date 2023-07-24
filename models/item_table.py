import os
from sqlalchemy import func
from extensions import db, path_web_normal, path_web_thumb, path_web_original
from .imagem_item_table import ImagemItem
from .favorito_table import Favorito

class Item(db.Model):
    ''' Tabela de itens do cardapio'''
    id = db.Column(db.Integer, primary_key = True)
    nome = db.Column(db.String(150), nullable = False)
    categoria = db.Column(db.String(100), nullable = False)
    descricao = db.Column(db.Text)

    images = db.relationship('ImagemItem', back_populates='item', lazy='dynamic', cascade='all, delete')
    comentarios = db.relationship('Comentario', back_populates='item', lazy='dynamic', cascade='all, delete')
    favoritos = db.relationship('Favorito', back_populates='item', lazy='dynamic', cascade='all, delete')

    @staticmethod
    def get_all_items():
        '''Retorna todos os itens cadastrados no sistema.
        Examples:
            >>> Item.get_all_items()
            [Item, Item, Item]
        '''
        return [ item for item in Item.query.all() ]

    def to_filename(self):
        ''' Retorna o nome do arquivo vinculado ao item '''
        # Consulta a imagem de referencia
        imagem_reg = ImagemItem.query.filter_by(id_item = self.id).first()
        return imagem_reg.imagem

    def to_dict(self, uuid_user: str = None):
        ''' Retorna os dados como um dicionario'''
        sub_favs = db.session.query(
            Favorito.id_item,
            Favorito.id_identificador,
        ).subquery()

        sub_image = db.session.query(
            ImagemItem.id_item,
            ImagemItem.imagem
        ).subquery()

        # Consulta a imagem de referencia
        result = db.session.query(
            Item.id,
            Item.nome,
            Item.categoria,
            Item.descricao,
            func.BIN_TO_UUID(sub_favs.c.id_identificador),
            sub_image.c.imagem
        ).outerjoin(
            sub_favs,
            ( sub_favs.c.id_item == Item.id ) &
            ( sub_favs.c.id_identificador == uuid_user )
        ).outerjoin(
            sub_image,
            sub_image.c.id_item == Item.id
        ).filter(Item.id == self.id).first()
        
        #imagem_reg = ImagemItem.query.filter_by(id_item = self.id).first()
        total_de_favoritos = Favorito.total_of_fav(self.id)

        obj = {
            'id': self.id, 
            'nome': self.nome, 
            'categoria': self.categoria, 
            'descricao': self.descricao,
            'thumb' : os.path.join(path_web_thumb, result[5] ) if result[5] else '',
            'normal' : os.path.join(path_web_normal, result[5] ) if result[5] else '',
            'original': os.path.join(path_web_original, result[5]) if result[5] and os.path.exists(os.path.join(path_web_original, result[5]))  else '',
            'meu_favorito': True if result[4] else False,
            'total_favoritos': total_de_favoritos,
        }

        # Caso não tenha o original mas tenha o normal, coloca-se a imagem do normal
        if len(obj['normal']) > 0 and len(obj['original']) == 0:
            obj['original'] = obj['normal']
        
        return obj
    
    def add(self):
        ''' Realiza a inserção do item no banco de dados '''
        db.session.add(self)
        db.session.commit()
    
    def upd(self):
        ''' Realiza a atualização do item no banco de dados '''
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