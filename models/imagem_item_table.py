
from extensions import db

class ImagemItem(db.Model):
    ''' Tabela de imagens com referencia ao item do cardapio'''
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    imagem = db.Column(db.String(150), nullable = False)
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False)

    item = db.relationship('Item', back_populates='images')

    def upd(self):
        ''' Realiza a atualização do registro'''
        db.session.add(self)
        db.session.commit()

    def add(self):
        ''' Realiza a inserção do registro no banco de dados '''
        db.session.add(self)
        db.session.commit()

    def to_dict(self):
        ''' Retorna os dados como um dicionario'''
        return {'id': self.id, 'imagem': self.imagem, 'id_item': self.id_item}