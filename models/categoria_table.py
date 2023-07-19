
from extensions import db
from typing import List, Dict

class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key = True, autoincrement = True, nullable = False)
    descricao = db.Column(db.String(150), nullable = False, unique = True)
    icone = db.Column(db.String(100), nullable = False, unique = True)

    @staticmethod
    def get_all_categories() -> List:
        '''Retorna todas as categorias cadastradas.
        Examples:
            >>> Categoria.get_all_categories()
            [ Categoria, Categoria, Categoria]
        '''
        items = Categoria.query.all()
        return [ item for item in items ]


    def to_dict(self) -> Dict:
        ''' Retorna a representação da categoria como dicionario
        
        Examples:
            >>> c = Categoria(id = 1, descricao = 'Café', icone: 'FreeBreakfast')
            {
                'id': 1,
                'descricao': 'Café',
                'icone': 'FreeBreakfast'
            }
        '''
        self = Categoria.query.filter_by(id = self.id).first()

        return {
            'id': self.id,
            'descricao': self.descricao,
            'icone': self.icone
        }

