
from extensions import db
from .comentario_table import Comentario

class Favorito(db.Model):
    ''' Tabela para favoritar itens'''
    id_item = db.Column(db.Integer, db.ForeignKey('item.id'), nullable = False, primary_key = True)
    id_identificador = db.Column(db.BINARY(16), nullable = False, primary_key = True)

    item = db.relationship('Item', back_populates='favoritos')

    def add(self):
        ''' Realiza a inserção de um favoritado '''
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        ''' Realiza a remoção de um favoritado '''
        item = Favorito.query.filter_by(id_item = self.id_item, id_identificador = self.id_identificador ).first()
        db.session.delete(item)
        db.session.commit()
        # Remove comentarios
        comentario = Comentario.query.filter_by(id_item = self.id_item, id_identificador = self.id_identificador).first()
        db.session.delete(comentario)
        db.session.commit()
    
    @staticmethod
    def total_of_fav(id_item: int) -> int:
        ''' Retorna o total de favoritos aplicados a um certo item 
        Parameters:
            id_item: Um inteiro que identifica o item e sua quantidade de favoritos.
        Examples:
            >>> Favorito.total_of_fav(1)
            >>> 4
        '''
        items = Favorito.query.filter_by(id_item = id_item ).all()
        return len(items)
    
    def to_dict(self):
        ''' Retorna uma representação em dicionario do favoritado '''

        return {
            "id_item": self.id_item,
            "id_identificador": self.id_identificador
        }