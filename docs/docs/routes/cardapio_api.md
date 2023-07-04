# Cardapio

Esta ResfulAPI lida com a manutenção dos itens, como listagem, inserção, atualização e exclusão dos mesmos no sistema.
Interagir com esta API necessita estar autenticado pois lida com áreas sensiveis da aplicação como inserção de dados.

_Todas as rotas aqui (com excessão de GET) necessitam do token você pode consegui-lo por [aqui](./acesso_admin.md). Lembre-se de passá-lo no Header
junto ao **X-Api-Key**._

## /cardapio

### GET

Recupera itens baseado no parametro informado.

- categoria: Retorna itens que atendam a esta categoria
  - todas: Caso enviado retorna todas as categorias disponiveis.
- tipos: Retorna os tipos de categorias disponiveis

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()

# Realizando o envio
s.get( URL + '/cardapio?categoria=Café')

```

```{.py3 title='Retorno'}
[
 {
  'id': 1,
  'nome': 'Café',
  'categoria': 'Café',
  'descricao': 'Expresso curto, tradicional: fraco, médio, forte!',
  'thumb': 'static/imagens/pequeno/89318b7008da0bb9086ba55f7911681f9ade367b.jpg',
  'normal': 'static/imagens/medio/89318b7008da0bb9086ba55f7911681f9ade367b.jpg',
  'total_favoritos': 10,
 }
]
```

```{.py3 title='Exemplo de envio com tipos'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()

# Realizando o envio
s.get( URL + '/cardapio?tipos=true')

```

```{.py3 title='Retorno'}

[
 ['FreeBreakfast', 'Café'],
 ['Fastfood', 'Sucos'],
 ['EmojiFoodBeverage', 'Chá'],
 ['WineBar', 'Alcoólicos']
]
```

### POST

Cria um novo item no cardapio

| NOME      | DESCRICAO                                                                                           | TIPO   | VALOR DE EXEMPLO                     |
| --------- | --------------------------------------------------------------------------------------------------- | ------ | ------------------------------------ |
| nome      | Nome do item a ser inserido                                                                         | String | 'Capuccino'                          |
| categoria | Define a categoria em que o item irá participar, é aceita no momento uma das categorias do exemplo  | String | 'Café', 'Chá', 'Sucos', 'Alcoólicos' |
| descricao | Necessario para descrever detalhes do item.                                                         | String | 'Expresso curto'                     |
| arquivo   | Este é um campo no body onde tem a indicação de um arquivo a ser a representação da imagem do item. | File   | File('imagem.jpg')                   |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
   'nome': 'Capuccino', 'categoria': 'Café', 'descricao': 'Expresso curto',
}
arquivo = open('imagem.jpg', 'rb)

# Realizando o envio
s.post(
    URL + '/cardapio',
    data={'dados': json.dumps(obj) },
    file = {'arquivo': arquivo }
)

```

```{.py3 title='Retorno'}
{
    'id': 1,
    'nome': 'Capuccino',
    'categoria': 'Café',
    'descricao': 'Expresso curto',
    'thumb': 'static/imagens/pequeno/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'normal': 'static/imagens/medio/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'total_favoritos': 0,
}
```

### PUT

Realiza a atualização de um item, descrição nome e categoria são alterados neste envio.

| NOME      | DESCRICAO                                                                                          | TIPO    | VALOR DE EXEMPLO                     |
| --------- | -------------------------------------------------------------------------------------------------- | ------- | ------------------------------------ |
| id        | O identificador do item a ser alterado.                                                            | Integer | 1                                    |
| nome      | Novo nome do item a ser atualizado                                                                 | String  | 'Capuccino'                          |
| categoria | Define a categoria em que o item irá participar, é aceita no momento uma das categorias do exemplo | String  | 'Café', 'Chá', 'Sucos', 'Alcoólicos' |
| descricao | Necessario para descrever detalhes do item.                                                        | String  | 'Expresso curto'                     |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
    'id': 1,
   'nome': 'Capuccino',
   'categoria': 'Sucos',
   'descricao': 'Expresso curto com leite',
}

# Realizando o envio
s.put(
    URL + '/cardapio',
    data={'dados': json.dumps(obj) },
)

```

```{.py3 title='Retorno'}
{
    'id': 1,
    'nome': 'Capuccino',
    'categoria': 'Sucos',
    'descricao': 'Expresso curto com leite',
    'thumb': 'static/imagens/pequeno/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'normal': 'static/imagens/medio/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'total_favoritos': 0,
}
```

### PATCH

Realiza a marcação/desmarcação de um item como favorito, é possível enviar um comentario sobre o item.

| NOME             | DESCRICAO                                                                                                     | TIPO            | VALOR DE EXEMPLO                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------- |
| id               | O identificador do item a ser favoritado.                                                                     | Integer         | 1                                      |
| id_identificador | Um identificador unico para o cliente. Isto irá permitir que o cliente marque/desmarque o item como favorito. | String (uuidV4) | '68aeea48-add6-43c1-a4f9-1cbf40fc7344' |
| comentario       | O comentário sobre o item, pode ser enviado e/ou não, mas deve seguir como string.                            | String          | 'Muito bom.'                           |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
    'id': 1,
   'id_identificador': '68aeea48-add6-43c1-a4f9-1cbf40fc7344',
   'comentario': 'Muito bom, parabéns',
}

# Realizando o envio
s.patch(
    URL + '/cardapio',
    data={'dados': json.dumps(obj) },
)

```

```{.py3 title='Retorno'}
{
    'id': 1,
    'nome': 'Capuccino',
    'categoria': 'Sucos',
    'descricao': 'Expresso curto com leite',
    'thumb': 'static/imagens/pequeno/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'normal': 'static/imagens/medio/427b834de1d5dd430439b13fdf8631606cbe1d42.jpg',
    'total_favoritos': 0,
}
```

### DELETE

Realiza a exclusão de um item.

| NOME | DESCRICAO                               | TIPO    | VALOR DE EXEMPLO |
| ---- | --------------------------------------- | ------- | ---------------- |
| id   | O identificador do item a ser excluido. | Integer | 1                |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
    'id': 1,
}

# Realizando o envio
s.delete(
    URL + '/cardapio',
    data={'dados': json.dumps(obj) },
)

```

```{.py3 title='Retorno'}

{'sucesso': 'Item excluido com sucesso.'}

```
