
from flask import request
import json
from models import Usuario

class Autenticator:
    ''' Esta classe permite ao utilizador usa-la para autenticar usuarios com acesso as rotas.
    Ela é um decorador e assim pode ser usada abaixo de .route para validar o usuario. 
    A forma como você deve escrever este autenticado é entre o decorador @app e a funcao 
    a ser executada pela rota. Ele irá verificar se o usuário esta autenticado e caso não 
    esteja irá retornar um json com a mensagem de erro.

      @app.route('/')\n
      @Autenticator()\n
      def raiz(usuario):\n
        ...
    
    '''
    def __init__(self, rota = None, pagina_view = False):
        self._rota = rota
        self._pagina_view = pagina_view
    
    def __call__(self, f):
        ''' Valida a autenticacao '''
        def funcao_decorada(*args, **kwargs):
            #
            headers = request.headers
            auth = headers.get('X-Api-Key')
            #
            usuario = Usuario.query.filter_by(token=auth).first()

            if usuario is None:
                return json.dumps({'erro': 'Sem permissão de acesso'})
            
            # Deu certo esta validado
            return f(usuario)
        # Necessario atualizar o nome da funcao_decorada pois 
        # nao se pode usar o mesmo nome em uma funcao retornada
        funcao_decorada.__name__ = f.__name__

        return funcao_decorada