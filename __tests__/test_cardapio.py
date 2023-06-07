# -*- coding: utf-8 -*-
'''
Autor: Marcos Felipe da Silva Jardim
Data: 06-06-2023
Descrição:
  Testes relacionados a rota que realiza a manutenção de itens do cardapio.
'''

import unittest
import os
import json
from requests import Session
from dotenv import load_dotenv
load_dotenv()

HOST = os.getenv('HOST')
EMAIL = os.getenv('EMAIL')
SENHA = os.getenv('SENHA')

ID = None
TOKEN = None

class TestACardapio(unittest.TestCase):

    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self._c = Session()
        self._url = '/cardapio'
        self._host = HOST
    
    @classmethod
    def setUpClass(cls):
        ''' Realiza a autenticacao'''
        global TOKEN, EMAIL, SENHA
        dados = {'email': EMAIL, 'senha': SENHA}

        resp = Session().post(HOST + '/acesso_admin', data = {'dados': json.dumps(dados)}).json()
        TOKEN = resp['token']

    def setUp(self) -> None:

        self._c.headers.update({'X-Api-Key': TOKEN})
        self.imagem = open('./cafe.jpg', 'rb')
    
    def tearDown(self) -> None:
        self.imagem.close()

    def test_a_adicionar_item(self):
        ''' Teste para inserção de um novo item '''
        global ID
        item = {
            'nome': 'Café', 
            'categoria': 'Café', 
            'descricao': 'Expresso curto, tradicional: fraco, médio, forte!'
        }
        c = self._c.post(self._host + self._url, data = {'dados': json.dumps(item)}, files= {'arquivo': self.imagem})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        #
        self.assertIn('id', result)
        self.assertIn('nome', result)
        self.assertIn('categoria', result)
        self.assertIn('descricao', result)
        self.assertIn('thumb', result)
        self.assertIn('normal', result)
        ID = result['id']
    
    def test_b_listar_itens(self):
        ''' Realiza a listagem dos itens de uma determinada categoria  '''
        c = self._c.get(self._host + self._url + '?categoria=Café')
        self.assertEqual(c.status_code, 200)
        result = c.json()
        self.assertIsInstance(result, list)
        #
        for item in result:
            self.assertIn('id', item)
            self.assertIn('nome', item)
            self.assertIn('categoria', item)
            self.assertIn('descricao', item)
            self.assertIn('thumb', item)
            self.assertIn('normal', item)
    
    def test_c_atualizar_item(self):
        ''' Realiza a atualização de um item passando o seu ID '''
        global ID
        item = {'id': ID, 'nome': 'Café claro', 'categoria': 'Sucos', 'descricao': 'Expresso curto, tradicional: fraco, médio, forte!'}
        c = self._c.put(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        #
        self.assertIn('id', result)
        self.assertIn('nome', result)
        self.assertIn('categoria', item)
        self.assertIn('descricao', result)
        self.assertIn('thumb', result)
        self.assertIn('normal', result)
        
    
    def test_d_deletar_item(self):
        ''' Realiza a Remoção de um item '''
        global ID
        item = {'id': ID}
        c = self._c.delete(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        #
        self.assertIn('sucesso', result)


if __name__ == '__main__':
    unittest.main()