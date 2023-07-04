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
        './1.jpeg', './2.jpeg', './3.jpeg', 
        './4.jpeg', './5.jpeg', './6.jpeg',
        './7.jpeg', './8.jpeg', './9.jpeg', './10.jpeg',
    ]

    lista_dados = [
        {'nome': 'Café Mirante do Mangabeiras', 'categoria': 'Café', 'descricao': 'EXPRESSO CURTO (1, 2 OU 3 GRÃOS)'},
        {'nome': 'Café Praça do PAPA', 'categoria': 'Café', 'descricao': 'CAPPUCCINO (EXPRESSO CURTO 2 GRÃOS, LEITE VAPORIZADO COM CHOCOLATE EM PÓ 50% CACAU E CALDA DE CARAMELO).'},
        {'nome': 'Café Praça da LIBERDADE', 'categoria': 'Café', 'descricao': 'CAPPUCCINO COM CANELA (EXPRESSO CURTO 2 GRÃOS, LEITE VAPORIZADO COM CHOCOLATE EM PÓ 50% CACAU, CANELA E CALDA DE CARAMELO)'},
        {'nome': 'Café Mercado Central', 'categoria': 'Café', 'descricao': 'MOCACCINO (EXPRESSO CURTO 2 GRÃOS, LEITE VAPORIZADO E CALDA DE CHOCOLATE OU CARAMELO)'},
        {'nome': 'Café Guanabara', 'categoria': 'Café', 'descricao': 'CHOCOLATE QUENTE (LEITE VAPORIZADO, CHOCOLATE EM PÓ 50% CACAU E CALDA DE CHOCOLATE)'},
        {'nome': 'Café Mineirão', 'categoria': 'Café', 'descricao': 'LATTE MACCHIATO (EXPRESSO CURTO 2 GRÃO E LEITE VAPORIZADO).'},
        {'nome': 'Chá de camomila', 'categoria': 'Chá', 'descricao': ''},
        {'nome': 'Chá Matte', 'categoria': 'Chá', 'descricao': ''},
        {'nome': 'Licor', 'categoria': 'Alcoólicos', 'descricao': ''},
        {'nome': 'Sucos', 'categoria': 'Sucos', 'descricao': 'Sabores variados, consultar loja'},
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