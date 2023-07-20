
from functools import wraps
from flask import request, session, redirect
from flask_smorest import abort
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
    def __init__(self, rota: str = None, pagina_view: bool = False, retornar_usuario: bool = False):
        self._rota = rota
        self._pagina_view = pagina_view
        self._retornar_usuario = retornar_usuario
    
    def __call__(self, f):
        ''' Valida a autenticacao '''
        @wraps(f)
        def funcao_decorada(*args, **kwargs):
            #
            headers = request.headers
            auth = None

            if 'token' in session:
                auth = session['token']

            auth = headers.get('X-Api-Key') if 'X-Api-Key' in headers else auth
            
            #
            usuario = Usuario.query.filter_by(token=auth).first()

            if usuario is None and self._pagina_view:
                return redirect('/acesso_login')
            elif usuario is None:
                return abort(400, message='Sem permissão de acesso')
            
            if self._retornar_usuario:
                kwargs['user'] = usuario
            # Deu certo esta validado
            return f(*args, **kwargs)
        

        return funcao_decorada