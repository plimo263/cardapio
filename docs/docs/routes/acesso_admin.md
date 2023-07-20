# Acesso Admin

Esta ResfulAPI lida com a autenticação do usuário trabalhando com dados de acesso enviados pela requisição
para se obter o token de acesso.

Outras formas de acesso a outros recusos necessitam do token passado pelo header **X-Api-Key** o mesmo só pode ser obtido por autenticação nesta rota.

## /acesso_admin

### POST

Realiza a autenticação e se bem sucedido recupera o token

| NOME  | DESCRICAO                                   | TIPO   | VALOR DE EXEMPLO      |
| ----- | ------------------------------------------- | ------ | --------------------- |
| email | Endereço de email de acesso                 | String | 'fulano@ciclano.com'  |
| senha | Uma senha para se autenticar na plataforma. | String | 'minha_senha_secreta' |

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()

obj = {
   'email': 'beltrano@example.com', 'senha': 'minha_super_senha'
}

# Realizando o envio
s.post( URL + '/acesso_admin', json=obj )

```

```{.py3 title='Retorno'}
{
    'token': 'dfadc855249b015fd2bb015c0b099b2189c58748'
}
```

## /usuario

### GET

Obtém detalhes de login do usuário (logicamente se o usuário estiver autenticado.)

```{.py3 title='Exemplo de envio'}

from requests import Session
import json

URL = 'http://localhost:8080'
s = Session()
s.headers.update({'X-Api-Key': 'TOKEN_DE_AUTENTICACAO'})

# Realizando o envio
s.get( URL + '/usuario' )

```

```{.json title='Retorno'}

{
  "data_acesso": "2023-07-20 11:08:16",
  "email": "example@gmail.com",
  "nome": "example@gmail.com"
}

```
