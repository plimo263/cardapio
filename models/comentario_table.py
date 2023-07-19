
from sqlalchemy import func
from extensions import db

class Comentario(db.Model):
    ''' Tabela para deixar um comentario sobre o item'''
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False, primary_key = True)
    id_identificador = db.Column(db.BINARY(16), nullable = False, primary_key = True)
    comentario = db.Column(db.Text, nullable = False)
    data = db.Column(db.DateTime, default=func.now())

    item = db.relationship('Item', back_populates='comentarios')

    def delete(self):
        ''' Remove o comentario que foi criado '''
        db.session.delete(self)
        db.session.commit()

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