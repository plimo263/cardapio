"""

Descricao: 
  Decorador que desativa rotas que ainda não estejam disponiveis para uso.
"""

import json
from functools import wraps

def not_available(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        return json.dumps({'erro': 'Indisponível'})
    return decorator