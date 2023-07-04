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
    
    def validar_campos(self, resultado):
        ''' Realiza a validação dos campos em comumn no retorno de um item'''
        self.assertIsInstance(resultado, dict)
        #
        self.assertIn('id', resultado)
        self.assertIn('nome', resultado)
        self.assertIn('categoria', resultado)
        self.assertIn('descricao', resultado)
        self.assertIn('thumb', resultado)
        self.assertIn('normal', resultado)
        self.assertIn('total_favoritos', resultado)


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
        self.validar_campos(result)
        ID = result['id']
    
    def test_b_listar_itens(self):
        ''' Realiza a listagem dos itens de uma determinada categoria  '''
        c = self._c.get(self._host + self._url + '?categoria=Café')
        self.assertEqual(c.status_code, 200)
        result = c.json()
        self.assertIsInstance(result, list)
        #
        for item in result:
            self.validar_campos(item)
    
    def test_c_atualizar_item(self):
        ''' Realiza a atualização de um item passando o seu ID '''
        global ID
        item = {'id': ID, 'nome': 'Café claro', 'categoria': 'Sucos', 'descricao': 'Expresso curto, tradicional: fraco, médio, forte!'}
        c = self._c.put(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.validar_campos(result)
    
    def test_d_marcar_desmarcar_item_favorito(self):
        ''' Realiza a marcação/desmarcação do item como favorito informando seu id'''
        global ID
        item = {'id': ID, 'id_identificador': '61edca5b-2cc1-43c4-a02e-022486965235', 'comentario': 'Produto muito bom.'}
        c = self._c.patch(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        self.assertIn('data', result)
        self.assertIn('sucesso', result)
        result = result['data']
        #
        self.validar_campos(result)

        # Outra chamada para desfavoritar item
        item = {'id': ID, 'id_identificador': '61edca5b-2cc1-43c4-a02e-022486965235', 'comentario': ''}
        c = self._c.patch(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        self.assertIn('data', result)
        self.assertIn('sucesso', result)
        result = result['data']
        #
        self.validar_campos(result)

    def test_e_deletar_item(self):
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