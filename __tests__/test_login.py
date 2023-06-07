# -*- coding: utf-8 -*-
'''
Autor: Marcos Felipe da Silva Jardim
Data: 07-06-2023
Descrição:
  Testes relacionados ao login do usuario com recebimento de token de autenticacao
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

class TestALogin(unittest.TestCase):

    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self._c = Session()
        self._url = '/acesso_admin'
        self._host = HOST
    
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_a_autenticacao_errado(self):
        ''' Teste para realizar a autenticacao com dados incorretos '''
        global EMAIL
        item = {
            'email': EMAIL,
            'senha': 'sasdfadsf',
        }
        c = self._c.post(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        #
        self.assertIn('erro', result)

    def test_b_autenticacao_correto(self):
        ''' Teste para realizar a autenticacao '''
        global SENHA, EMAIL
        item = {
            'email': EMAIL,
            'senha': SENHA,
        }
        c = self._c.post(self._host + self._url, data = {'dados': json.dumps(item)})

        self.assertEqual(c.status_code, 200)
        #
        result = c.json()
        self.assertIsInstance(result, dict)
        #
        self.assertIn('token', result)


if __name__ == '__main__':
    unittest.main()