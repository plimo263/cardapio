# -*- coding: utf-8 -*-
'''
Autor: Marcos Felipe da Silva
Data: 09-06-2023
Descricao:
 Usado para criar o preenchimento de dados iniciais
 para testes entre outros. Imagens para testes foram 
 capturadas do site https://unsplash.com/pt-br e podem 
 ser usadas de forma gratuita.
'''
import requests
import os
import json
from dotenv import load_dotenv
load_dotenv()

HOST = os.getenv('HOST')
USER = os.getenv('EMAIL')
PASSWD = os.getenv('SENHA')


def init_data_items():
    ''' Cria os itens iniciais do cardapio no sistema. Usado para uma base teste'''
    imagens = [ 
        './1.jpg', './2.jpg', './3.jpg', 
        './4.jpg', './5.jpg', './6.jpg',
        './7.jpg', './8.jpg', './9.jpg', 
        './10.jpg', './11.jpg',
    ]

    lista_dados = [
        {'nome': 'Café Mirante do Mangabeiras', 'categoria': 'Café', 'descricao': 'Expresso:\nExpresso curto, tradicional: fraco, médio, forte'},
        {'nome': 'Café Praça do PAPA', 'categoria': 'Café', 'descricao': 'Cappuccino\nExpresso, leite vaporizado, chocolate em pó 50%% e calda de caramelo.'},
        {'nome': 'Café Praça da LIBERDADE', 'categoria': 'Café', 'descricao': 'Cappuccino com canela.\nExpresso leite vaporizado, chocolat em po 50%. canela em pó e clda de caramelo'},
        {'nome': 'Café Mercado Central', 'categoria': 'Café', 'descricao': 'Mocaccino\nExpresso leite vaporizdo, calda de chocolate ou caramelo'},
        {'nome': 'Café Guanabara', 'categoria': 'Café', 'descricao': 'Chocolate quente\nLeite vaporizado, chocolate em po 50%% e calda de chocolate'},
        {'nome': 'Café Mineirão', 'categoria': 'Café', 'descricao': 'Latte macchiato\n Leite vaporizado e expresso.'},
        {'nome': 'Suco de laranja', 'categoria': 'Sucos', 'descricao': ''},
        {'nome': 'Suco de Uva', 'categoria': 'Sucos', 'descricao': ''},
        {'nome': 'Chá de camomila', 'categoria': 'Chá', 'descricao': ''},
        {'nome': 'Chá Matte', 'categoria': 'Chá', 'descricao': ''},
        {'nome': 'Licor', 'categoria': 'Alcoólicos', 'descricao': ''},
    ]

    # Recolhe o token para inserir os dados
    resp = requests.post(HOST + '/acesso_admin', data={'dados': json.dumps({'email': USER, 'senha': PASSWD})})
    token = resp.json()['token']

    # Cabecalho de conexao
    headers = {'X-Api-Key': token}


    for i, item in enumerate(lista_dados, 0):
        dados = item
        with open(imagens[i], 'rb') as arq:
            requests.post(HOST + '/cardapio', data={'dados': json.dumps(dados)}, files = {'arquivo': arq}, headers=headers)


if __name__ == '__main__':
    init_data_items()