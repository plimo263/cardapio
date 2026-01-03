# API - Cardápio (Backend)

Documentação rápida das rotas disponíveis no backend.

Autenticação e cabeçalhos

- `X-Api-Key: <chave>` — chave para chamadas de API (definida em `backend/.env`). Pode ser usada em vez de token Bearer para operações de escrita.
- `Authorization: Bearer <token>` — token obtido em `POST /auth/login` para autenticar usuários no painel.
- Observação: métodos de leitura (`GET`) são públicos por enquanto; métodos de escrita (`POST`, `PUT`, `DELETE`) exigem autenticação (API key ou Bearer token). Para operações administrativas (usuários), é exigido `is_admin`.

Formato de respostas

- A API usa JSON para payloads e respostas (exceto `GET /images/<id>` que retorna o conteúdo binário da imagem).

Resumo por prioridade

**Usuários**

- `POST /auth/login`

  - Descrição: faz login e retorna token Bearer.
  - Body (JSON):
    - `username` (string, obrigatório)
    - `password` (string, obrigatório)
  - Exemplo request:
    ```json
    { "username": "admin", "password": "senha123" }
    ```
  - Resposta 200:
    ```json
    { "token": "<token_hex>" }
    ```

- `POST /auth/logout`

  - Cabeçalho: `Authorization: Bearer <token>`
  - Descrição: revoga o token do usuário.
  - Resposta 200:
    ```json
    { "status": "ok" }
    ```

- `GET /users` (ADMIN)

  - Cabeçalho: `X-Api-Key: <chave>` ou `Authorization: Bearer <token_admin>`
  - Retorna lista de usuários (metadados, sem senha).

- `POST /users` (ADMIN)

  - Cabeçalho: `X-Api-Key: <chave>` ou `Authorization: Bearer <token_admin>`
  - Body (JSON):
    - `username` (string, obrigatório)
    - `password` (string, obrigatório)
    - `email` (string, opcional)
    - `is_admin` (bool, opcional, default: false)
  - Resposta 201 (exemplo):
    ```json
    {
      "id": 1,
      "username": "editor",
      "email": null,
      "is_admin": false,
      "created_at": "..."
    }
    ```

- `GET /users/<id>` (ADMIN)

  - Cabeçalho: `X-Api-Key` ou `Authorization` (admin)
  - Retorna o usuário por id

- `PUT /users/<id>` (ADMIN)

  - Cabeçalho: `X-Api-Key` ou `Authorization` (admin)
  - Body (JSON): campos para atualizar (`username`, `password`, `email`, `is_admin`)

- `DELETE /users/<id>` (ADMIN)

  - Cabeçalho: `X-Api-Key` ou `Authorization` (admin)
  - Remove o usuário do banco (DELETE permanente).

- `GET /users/me`
  - Cabeçalho: `Authorization: Bearer <token>`
  - Retorna os dados do usuário autenticado.

**Upload de imagens (bucket local)**

- `POST /images` (upload)

  - Cabeçalho: `X-Api-Key: <chave>` ou `Authorization: Bearer <token>` (escrita exige autenticação)
  - Request: `multipart/form-data` com campo `file` contendo a imagem.
  - Validações: tipo deve ser `image/*`, tamanho máximo configurado (ex.: 10MB em `Config.MAX_CONTENT_LENGTH`).
  - Processamento: gera e salva 3 versões — `original`, `mobile` (ex.: 800px largura) e `thumb` (ex.: 200px largura).
  - Resposta 201 (exemplo):
    ```json
    {
      "id": 1,
      "filename": "<uuid>.jpg",
      "original_name": "imagem.jpg",
      "mime": "image/jpeg",
      "urls": {
        "original": "/images/1?size=original",
        "mobile": "/images/1?size=mobile",
        "thumb": "/images/1?size=thumb"
      }
    }
    ```

- `GET /images`

  - Descrição: lista todas as imagens com metadados e URLs absolutas para uso no painel.
  - Query: nenhum.
  - Resposta 200: array de objetos com `id`, `filename`, `created_at` e `urls` (original/mobile/thumb).

- `GET /images/<id>?size=original|mobile|thumb`
  - Descrição: retorna o conteúdo binário da imagem solicitada no tamanho pedido.
  - Exemplo: `GET /images/1?size=thumb` retorna a thumbnail.

Observações:

- URLs retornadas podem ser salvas em `imagem_url` no cadastro de bebidas (use `mobile` para exibição em listas e `original` para detalhe, por exemplo).
- Uploads são armazenados em `backend/uploads/` (ignorados pelo VCS). Para produção, considere MinIO/S3 e CDN.

**Categorias**

- `GET /categorias`

  - Descrição: lista categorias ativas.
  - Resposta 200: array de categorias (`id`, `nome`, `ativo`, `created_at`).

- `POST /categorias`

  - Cabeçalho: `X-Api-Key: <chave>` ou `Authorization: Bearer <token>`
  - Body (JSON):
    - `nome` (string, obrigatório)
    - `ativo` (bool, opcional)
  - Comportamento: se existir categoria com mesmo nome e `ativo = False`, a API a reativa e retorna 200; se existir ativa, retorna 400.
  - Resposta 201 (nova) ou 200 (reativada).

- `GET /categorias/<id>`

  - Retorna a categoria por id.

- `PUT /categorias/<id>`

  - Cabeçalho: `X-Api-Key` ou `Authorization`
  - Body (JSON): `nome`, `ativo` — atualiza a categoria.

- `DELETE /categorias/<id>`
  - Cabeçalho: `X-Api-Key` ou `Authorization`
  - Comportamento: soft-delete (define `ativo = False`).

**Bebidas**

- `GET /bebidas`

  - Lista bebidas ativas (ordenadas por nome). Retorna array de `BebidaSchema`.

- `POST /bebidas`

  - Cabeçalho: `X-Api-Key` ou `Authorization`
  - Body (JSON):
    - `nome` (string, obrigatório)
    - `preco` (string, obrigatório — enviar como string por compatibilidade Decimal)
    - `categoria_id` (int, obrigatório) — deve referenciar uma categoria ativa
    - `descricao` (string, opcional)
    - `imagem_url` (string, opcional) — pode apontar para `/images/<id>?size=mobile` retornado pelo upload
    - `ativo` (bool, opcional)
  - Resposta 201: objeto `Bebida` criado.

- `GET /bebidas/<id>`

  - Retorna a bebida por id.

- `PUT /bebidas/<id>`

  - Cabeçalho: `X-Api-Key` ou `Authorization`
  - Body (JSON): atualizar campos (`nome`, `descricao`, `preco`, `imagem_url`, `ativo`, `categoria_id`). Valida categoria.

- `DELETE /bebidas/<id>`
  - Cabeçalho: `X-Api-Key` ou `Authorization`
  - Soft-delete (define `ativo = False`).

Exemplos rápidos (curl)

- Login (obter token):

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}' http://localhost:5000/auth/login
```

- Upload de imagem (com X-Api-Key):

```bash
curl -X POST -H "X-Api-Key: b9ddb3c7-3185-4475-897a-22b4b92059a6" \
  -F "file=@/caminho/para/img.jpg" http://localhost:5000/images
```

- Criar bebida usando `imagem_url` retornada:

```bash
curl -X POST -H "Content-Type: application/json" -H "X-Api-Key: b9ddb3c7-3185-4475-897a-22b4b92059a6" \
  -d '{"nome":"IPA","preco":"12.50","categoria_id":1,"imagem_url":"http://localhost:5000/images/1?size=mobile"}' \
  http://localhost:5000/bebidas
```

Notas finais

- Para testes locais, verifique `backend/.env` com `API_KEY` e rode `./scripts/dev.sh` a partir de `backend/`.
- Em produção, proteja endpoints com HTTPS, adicione expiração a tokens e use object storage com CDN se necessário.

---

Arquivo gerado automaticamente pelo assistente — se quiser, eu atualizo com exemplos adicionais ou adiciono um Postman/Insomnia collection aninhada ligada a este README.
