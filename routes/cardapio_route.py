import os
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from extensions import path_dir_save_normal, path_dir_save_thumb, path_dir_save_original
from models import Categoria, Item, ImagemItem, Favorito, Comentario
from schemas import (
    CategoriaSchema, ItemSchema, 
    ComentarioSchema, FavoritoSchema, 
    IdClienteSchema,
)
from utils.authenticator import Autenticator
from utils.imagens import Imagens
from extensions import db

def delete_image_item(image_name: str):
    ''' Realiza a exclusão da imagem normal e thumb'''
    image_old_tumb = os.path.join(path_dir_save_thumb, image_name)
    image_old_normal = os.path.join(path_dir_save_normal, image_name)
    image_old_original = os.path.join(path_dir_save_original, image_name)
    for image_path in [image_old_tumb, image_old_normal, image_old_original]:
        try:
            os.remove(image_path)
        except FileNotFoundError:
            pass


cardapio = Blueprint('cardapio', __name__, description='Operações aos itens do cardapio')

@cardapio.route('/cardapio/item')
class Cardapio(MethodView):

    @cardapio.arguments(IdClienteSchema, location="query")
    @cardapio.response(200, ItemSchema(many=True))
    def get(self, item_data):
        ''' Retorna todos os itens de todas as categorias. Caso enviado um id_identificador então verifica os itens que ele curtiu '''
        id_identificador = None
        if 'id_identificador' in item_data:
            id_identificador = item_data['id_identificador'].bytes

        items = Item.get_all_items()
        return [
            item.to_dict(id_identificador) 
            for item in items
        ]

    @cardapio.arguments(ItemSchema)
    @cardapio.response(200, ItemSchema)
    @Autenticator()
    def post(self, item_data):
        ''' Realiza o registro de um novo item no cardapio, recebendo nome, descricao e categoria.'''
        data = item_data

        if not Categoria.query.filter_by(descricao = data['categoria']).first():
            abort(400, message='A categoria informada não existe')

        # Cria o registro
        item_reg = Item(nome=data['nome'], descricao=data['descricao'], categoria=data['categoria'])
        item_reg.add()
        #
        obj_item = item_reg.to_dict()
        return obj_item

@cardapio.route('/cardapio/item/<int:id_item>')
class CardapioUnique(MethodView):

    @cardapio.arguments(ItemSchema)
    @cardapio.response(200, ItemSchema)
    @Autenticator()
    def put(self, item_data, id_item):
        ''' Atualiza o item com descricao, nome e até mesmo categoria '''
        item: Item = Item.query.get_or_404(id_item)
        
        # Verifica a categoria
        if not Categoria.query.filter_by(descricao = item_data['categoria']).first():
            abort(400, message='A categoria informada não existe')
        
        # Realiza a atualização do item
        item.categoria = item_data['categoria']
        item.descricao = item_data['descricao']
        item.nome = item_data['nome']

        item.upd()
        
        return item.to_dict()

    @cardapio.response(200, ItemSchema)
    @Autenticator()
    def patch(self, id_item):
        ''' Usado para atualizar a imagem do item '''

        item = Item.query.get_or_404(id_item)

        # Salva o arquivo no diretorio normal
        resp = Imagens.save_files(path_dir_save_normal, request.files)
        
        if 'erro' in resp: abort(400, message=resp)

        image_name = resp[1]
        
        # Salva a imagem em 2 formatos
        path_original = os.path.join(path_dir_save_original, image_name)
        path_save = os.path.join(path_dir_save_normal, image_name)
        path_save_thumb = os.path.join(path_dir_save_thumb, image_name)

        # Salva nos dois novos caminhos
        Imagens.resize_image(path_save, None, path_original)
        Imagens.resize_image(path_save, (1024,1024))
        Imagens.resize_image(path_save, (320,320), path_save_thumb)
        
        # Veja se ja tem desta imagem registrada
        reg_imagem: ImagemItem = ImagemItem.query.filter_by(id_item = id_item).first()
        
        if reg_imagem:
            # Exclui a imagem do sistema
            delete_image_item(reg_imagem.imagem)

            reg_imagem.imagem = image_name
            reg_imagem.upd()
        else:
            # Agora cria a vinculacao da imagem no banco
            imagem_reg = ImagemItem(imagem=image_name, id_item=id_item)
            imagem_reg.add()

        return item.to_dict()

    @Autenticator()
    def delete(self, id_item):
        ''' Realiza a exclusão de um item no cardapio. Necessário ser um usuário autenticado.'''
        item: Item = Item.query.get_or_404(id_item)
        # Recupera o nome da imagem
        image_reg: ImagemItem = ImagemItem.query.filter_by(id_item = id_item).first()
        image_name = None

        if image_reg:
            image_name = image_reg.imagem

        try:
            db.session.delete(item)
            db.session.commit()
        except SQLAlchemyError as err:
            db.session.rollback()
            print(str(err))
            abort(500, message='Não foi possível excluir o item')
        
        if image_name:
            delete_image_item(image_name)
        

        return {'sucesso': 'Item excluído com sucesso'}

@cardapio.route('/cardapio/tipos')
class CardapioTipos(MethodView):

    @cardapio.response(200, CategoriaSchema(many=True))
    def get(self):
        ''' Recupera a lista dos tipos de produtos do cardápio, esta lista contém o icone e a descrição.'''
        return [
            {
                "descricao": item.descricao,
                "icone": item.icone 
            }
            for item in Categoria.query.all()
        ]

@cardapio.route('/cardapio/comentario')
class CardapioComentario(MethodView):

    @cardapio.arguments(ComentarioSchema)
    def post(self, item_data):
        ''' Registra novos comentarios dos clientes'''

        item = Item.query.get_or_404(item_data['id'])
        
        id_identificador = item_data['id_identificador'].bytes

        # Insere o comentario
        comentario = Comentario(
            id_item = item_data['id'], 
            id_identificador = id_identificador, 
            comentario = item_data['comentario']
        )
        try:
            comentario.add()
        except IntegrityError:
            db.session.rollback()
            # Remove o comentario que existe
            comentario = Comentario(
                id_item = item_data['id'], 
                id_identificador = id_identificador, 
                comentario = item_data['comentario']
            )
            db.session.delete(
                Comentario.query.filter_by(
                    id_identificador = id_identificador, 
                    id_item = item_data['id']
                ).first()
            )
            db.session.commit()

            # Inclui o novo
            comentario = Comentario(
                id_item = item_data['id'], 
                id_identificador = id_identificador, 
                comentario = item_data['comentario']
            )
            comentario.add()

        # Retorna o item
        item = Item.query.get(item_data['id'])

        return {
            'sucesso': 'Comentário registrado com sucesso.',
            'data': item.to_dict(id_identificador)
        }

@cardapio.route('/cardapio/favorito')
class CardapioFavorito(MethodView):

    @cardapio.arguments(FavoritoSchema)
    def patch(self, item_data):
        ''' Realiza a curtida do produto por parte do cliente. '''

        item = Item.query.get_or_404(item_data['id'])
        
        id_identificador = item_data['id_identificador'].bytes

        fav = Favorito.query.filter_by(
            id_item = item_data['id'], 
            id_identificador = id_identificador 
        ).first()

        msg = "Item descurtido com sucesso."

        # Se favoritou remove
        if fav:
            try:
                db.session.delete(fav)
                db.session.commit()
            except SQLAlchemyError:
                db.session.rollback()
        else: # Favorita o item
            fav = Favorito(
                id_item = item_data['id'], 
                id_identificador = id_identificador 
            )
            fav.add()
            msg = "Item curtido com sucesso."
        
        item = Item.query.get(item_data['id'])
        
        return {
            "sucesso": msg,
            "data": item.to_dict(id_identificador),
        }