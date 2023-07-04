import json
import os
from uuid import UUID
from flask import Blueprint, render_template, request
from extensions import db, path_dir_save_normal, path_dir_save_thumb, path_web_thumb, path_web_normal
from models import Item, ImagemItem, Usuario, Favorito, Comentario
from utils.validator import Validator, ValidatorString, ValidatorEnum, ValidatorRegex
from utils.imagens import Imagens
from utils.authenticator import Autenticator
from utils.not_available import not_available

categories_accepts = [
 ['FreeBreakfast', 'Café'],
 ['Fastfood', 'Sucos'],
 ['EmojiFoodBeverage', 'Chá'],
 ['WineBar', 'Alcoólicos']
]

cardapio = Blueprint('cardapio', __name__)

@cardapio.route('/', methods = ['GET'])
def ver_cardapio_view():
    return render_template('template_react.html')

# Rota para recuperar os itens do cardapio
@cardapio.route('/cardapio', methods = ['GET'])
def cardapio_get():
    
    args = request.args
    if len(args) == 0:
        return render_template('template_react.html')
    # Veja qual argumento foi enviado
    if 'tipos' in args:
        items = categories_accepts
    elif 'categoria' in args:
        if args['categoria'] == 'todas':
            items = [ item.to_dict() for item in Item.query.all() ]
        else:
            # Realiza a consulta dos itens
            items = [ item.to_dict() for item in Item.query.filter_by( categoria = args['categoria']) ]

    return json.dumps(items)

@cardapio.route('/cardapio', methods = ['PATCH'])
@not_available
def cardapio_comentario():
    ''' Armazena os comentarios dos clientes quanto ao itens do cardapio.'''
    data = Validator.validate_json(request)
    if 'erro' in data: return json.dumps(data)

    # Itens já cadastrados
    id_items = [ item.id for item in  Item.query.all() ]
    
    # Lista de validadores 
    list_validators = [
        ValidatorEnum('id', id_items, msg_error='Item não encontrado'),
        ValidatorRegex(
            'id_identificador', 
            regex = '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$', 
            msg_error='Necessario informar o identificador'
        ),
        ValidatorString('comentario', min = 0, msg_error='Campo comentário não enviado')
    ]
    requireds = ['id', 'id_identificador', 'comentario'] # Requerimentos (campos obrigatorios)
    
    v = Validator(list_validators, requireds)
    try:
        v.is_valid(data)
    except ValueError as err:
        return json.dumps({'erro': str(err)})
    
    # Verifica se ja esta favoritado
    id_identificador = UUID(data['id_identificador']).bytes
    fav = Favorito(id_item = data['id'], id_identificador = id_identificador )
    if fav.is_fav():
        fav.delete()
    else:
        # Tem algum comentario ?
        if len(data['comentario']) > 0:
            # Insere o comentario
            comentario = Comentario(
                id_item = data['id'], 
                id_identificador = id_identificador, 
                comentario = data['comentario']
            )
            comentario.add()
        fav.add()

    # Retorna o item
    item = Item( id = data['id'] )

    return json.dumps({
        'sucesso': 'Curtida registrada com sucesso',
        'data': item.to_dict()
    })


@cardapio.route('/cardapio', methods = ['POST', 'PUT', 'DELETE'])
@Autenticator()
def cardapio_rota(_):
    data = Validator.validate_json(request)
    if 'erro' in data: return json.dumps(data)

    # Lista de validadores 
    list_validators = [
        ValidatorString('nome', min = 3, msg_error='Mínimo de 3 caracteres'),
        ValidatorString('descricao', msg_error='Campo obrigatório'),
        ValidatorEnum('categoria', [ item[1] for item in categories_accepts], msg_error='O valor enviado não é aceito')
    ]
    requireds = ['nome', 'descricao', 'categoria'] # Requerimentos (campos obrigatorios)
    
    if request.method == 'POST': # Cadastro de um item
        v = Validator(list_validators, requireds)
        try:
            v.is_valid(data)
        except ValueError as err:
            return json.dumps({'erro': str(err)})
        
        # Verifica se a imagem foi enviada
        if not request.files: return json.dumps({'erro': 'Arquivo obrigatório não foi enviado'})
        
        # Salva o arquivo no diretorio normal
        resp = Imagens.save_files(path_dir_save_normal, request.files)

        if 'erro' in resp: return json.dumps(resp)

        image_name = resp[1]
        
        # Salva a imagem em 2 formatos
        path_save = os.path.join(path_dir_save_normal, image_name)
        path_save_thumb = os.path.join(path_dir_save_thumb, image_name)

        # Salva nos dois novos caminhos
        Imagens.resize_image(path_save, (1024,1024))
        Imagens.resize_image(path_save, (320,320), path_save_thumb)
        
        # Cria o registro
        item_reg = Item(nome=data['nome'], descricao=data['descricao'], categoria=data['categoria'])
        item_reg.add()

        # Agora cria a vinculacao da imagem no banco
        imagem_reg = ImagemItem(imagem=image_name, id_item=item_reg.id)
        imagem_reg.add()
        #
        obj_item = item_reg.to_dict()

        return json.dumps(obj_item)
    
    # Itens já cadastrados
    id_items = [ item.id for item in  Item.query.all() ]

    if request.method == 'PUT': # Atualizando um item

        list_validators.append(ValidatorEnum('id', id_items, msg_error='Item não encontrado'))
        requireds.append('id')

        v = Validator(list_validators, requireds)
        try:
            v.is_valid(data)
        except ValueError as err:
            return json.dumps({'erro': str(err)})
        
        # Item existe vamos atualiza-lo
        upd_item = Item.query.filter_by(id=data['id']).first()
        upd_item.update(data['nome'], data['descricao'], data['categoria'])

        return json.dumps(upd_item.to_dict())
    
    if request.method == 'DELETE': # Exclui um item

        list_validators = [
            ValidatorEnum('id', id_items, msg_error='Item não encontrado'),
        ]
        v = Validator(list_validators, ['id'])
        try:
            v.is_valid(data)
        except ValueError as err:
            return json.dumps({'erro': str(err)})
        
        # Item existe vamos recuperar para exclui-lo
        item = Item.query.filter_by(id=data['id']).first()

        # Exclua a imagem fisicamente
        to_filename_item = item.to_filename()
        try:
            os.remove(os.path.join(path_dir_save_thumb, to_filename_item))
            os.remove(os.path.join(path_dir_save_normal, to_filename_item))
        except FileNotFoundError:
            pass

        # Exclui o item e tudo relacionado a ele
        item.delete()
        item = None

        return json.dumps({'sucesso': 'Item excluido com sucesso.'})
