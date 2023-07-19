# Cardapio

Esta ResfulAPI lida com a manutenção dos itens, como listagem, inserção, atualização e exclusão dos mesmos no sistema.
Interagir com esta API necessita estar autenticado pois lida com áreas sensiveis da aplicação como inserção de dados.

_A maioria das rotas aqui necessitam do token, você pode consegui-lo por [aqui](./acesso_admin.md). Lembre-se de passá-lo no Header
junto ao **X-Api-Key**._

## /cardapio/tipos

### GET

Recupera todos os tipos de categorias disponíveis no sistema.

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()

# Realizando o envio
s.get( URL + '/cardapio/tipos')

```

```{.json title='Retorno'}
[
    {
        "descricao": "Café",
        "icone": "FreeBreakfast"
    },
    {
        "descricao": "Sucos",
        "icone": "Fastfood"
    },
    {
        "descricao": "Chá",
        "icone": "EmojiFoodBeverage"
    },
    {
        "descricao": "Alcoólicos",
        "icone": "WineBar"
    }
]
```

## /cardapio/item

Realiza interações com os itens do cardápio.

### GET

Recupera todos os itens do cardapio, indiferente da sua categoria

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()

# Realizando o envio
s.get( URL + '/cardapio/item')

```

```{.json title='Retorno'}
[
    {
        "categoria": "Café",
        "descricao": "Este café é das Arábias, muito bom você vai gostar",
        "id": 2,
        "meu_favorito": false,
        "nome": "Café das arábias",
        "normal": "static/imagens/medio/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "thumb": "static/imagens/pequeno/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "total_favoritos": 2
    }
]
```

### POST

Cria um novo item no cardapio, esta API necessita de um token de autenticação.

| NOME      | DESCRICAO                                                                                          | TIPO   | VALOR DE EXEMPLO                     |
| --------- | -------------------------------------------------------------------------------------------------- | ------ | ------------------------------------ |
| nome      | Nome do item a ser inserido                                                                        | String | 'Capuccino'                          |
| categoria | Define a categoria em que o item irá participar, é aceita no momento uma das categorias do exemplo | String | 'Café', 'Chá', 'Sucos', 'Alcoólicos' |
| descricao | Necessario para descrever detalhes do item.                                                        | String | 'Expresso curto'                     |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
	"categoria": "Café",
	"nome": "Café das arábias",
	"descricao": "Este café é das Arábias, muito bom você vai gostar"
}

# Realizando o envio
s.post( URL + '/cardapio/item', json=obj )

```

```{.py3 title='Retorno'}
{
	"categoria": "Café",
	"descricao": "Este café é das Arábias, muito bom você vai gostar",
	"id": 2,
	"nome": "Café das arábias",
	"normal": "",
	"thumb": "",
	"total_favoritos": 0
}
```

## /cardapio/item/&lt;item_id>

### PUT

Realiza a atualização de um item, descrição nome e categoria são alterados neste envio, necessita de um token de usuário.

| NOME      | DESCRICAO                                                                                          | TIPO   | VALOR DE EXEMPLO                     |
| --------- | -------------------------------------------------------------------------------------------------- | ------ | ------------------------------------ |
| nome      | Novo nome do item a ser atualizado                                                                 | String | 'Capuccino'                          |
| categoria | Define a categoria em que o item irá participar, é aceita no momento uma das categorias do exemplo | String | 'Café', 'Chá', 'Sucos', 'Alcoólicos' |
| descricao | Necessario para descrever detalhes do item.                                                        | String | 'Expresso curto'                     |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
	"categoria": "Café",
	"nome": "Café das arábias loucas",
	"descricao": "Este café é das Arábias, muito bom você vai gostar"
}

# Realizando o envio
s.put( URL + '/cardapio/item/1' )

```

```{.py3 title='Retorno'}
{
	"categoria": "Café",
	"descricao": "Este café é das Arábias, muito bom você vai gostar",
	"id": 1,
	"nome": "Café das arábias loucas",
	"normal": "static/imagens/medio/89e276e6874e72f38902b82ceb6bc5e341650105.jpeg",
	"thumb": "static/imagens/pequeno/89e276e6874e72f38902b82ceb6bc5e341650105.jpeg",
	"total_favoritos": 0
}
```

### PATCH

Realiza a atualização da foto de um item se o item tem foto OK se não tem é preenchida com uma nova imagem. Necessita do token.

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

file = open('arquivo.jpg')

# Realizando o envio
s.patch( URL + '/cardapio/item/1', files={'arquivo': file } )

```

```{.py3 title='Retorno'}
{
    "categoria": "Café",
    "descricao": "Este café é das Arábias, muito bom você vai gostar",
    "id": 2,
    "nome": "Café das arábias",
    "normal": "static/imagens/medio/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
    "thumb": "static/imagens/pequeno/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
    "total_favoritos": 0
}
```

### DELETE

Realiza a exclusão de um item, necessita de um token.

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

# Realizando o envio
s.delete( URL + '/cardapio/item/1' )

```

```{.py3 title='Retorno'}

{'sucesso': 'Item excluido com sucesso.'}

```

## /cardapio/comentario

### POST

Esta rota realiza a inserção/atualização de um comentário sobre um determinado item.

| NOME             | DESCRICAO                                                                                                     | TIPO            | VALOR DE EXEMPLO                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------- |
| id               | O identificador do item que é desejado inserir o comentario.                                                  | Integer         | 1                                      |
| id_identificador | Um identificador unico para o cliente. Isto irá permitir que o cliente marque/desmarque o item como favorito. | String (uuidV4) | '68aeea48-add6-43c1-a4f9-1cbf40fc7344' |
| comentario       | O comentário sobre o item, pode ser enviado e/ou não, mas deve seguir como string.                            | String          | 'Muito bom.'                           |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
	"id": 2,
	"id_identificador": "d066aa7f-11bc-42d3-9c5f-47b09784eab6",
	"comentario": "Muito bom, estão de parabéns pelo trabalho"
}

# Realizando o envio
s.post( URL + '/cardapio/comentario', json=obj )

```

```{.py3 title='Retorno'}
{
    "data": {
        "categoria": "Café",
        "descricao": "Este café é das Arábias, muito bom você vai gostar",
        "id": 2,
        "meu_favorito": true,
        "nome": "Café das arábias",
        "normal": "static/imagens/medio/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "thumb": "static/imagens/pequeno/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "total_favoritos": 1
    },
    "sucesso": "Comentário registrado com sucesso."
}
```

## /cardapio/favorito

### PATCH

Esta rota registra a curtida/descurtida do usuário ao sistema, se já teve uma curtida ele registra, se não teve ele não registra.

| NOME             | DESCRICAO                                                                                                     | TIPO            | VALOR DE EXEMPLO                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------- |
| id               | O identificador do item que é desejado inserir o comentario.                                                  | Integer         | 1                                      |
| id_identificador | Um identificador unico para o cliente. Isto irá permitir que o cliente marque/desmarque o item como favorito. | String (uuidV4) | '68aeea48-add6-43c1-a4f9-1cbf40fc7344' |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

obj = {
	"id": 2,
	"id_identificador": "d066aa7f-11bc-42d3-9c5f-47b09784eab6"
}

# Realizando o envio
s.patch( URL + '/cardapio/favorito', json=obj )

```

```{.py3 title='Retorno'}
{
    "data": {
        "categoria": "Café",
        "descricao": "Este café é das Arábias, muito bom você vai gostar",
        "id": 2,
        "meu_favorito": true,
        "nome": "Café das arábias",
        "normal": "static/imagens/medio/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "thumb": "static/imagens/pequeno/55caf098c8969f84ca8b38987d7d2d96c94a754f.jpeg",
        "total_favoritos": 2
    },
    "sucesso": "Item curtido com sucesso."
}
```
