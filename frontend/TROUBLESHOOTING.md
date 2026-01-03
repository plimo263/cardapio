# Troubleshooting - Login Admin

## Alterações Realizadas

### 1. Configuração de CORS no Backend

- Adicionado `flask_cors` no `app/__init__.py`
- Permite requisições do frontend (desenvolvimento)

### 2. Configuração do Proxy no Frontend

- Modificado `api.js` para usar URLs relativas em desenvolvimento
- O Vite proxy intercepta `/auth/*` e redireciona para `localhost:5000`

### 3. Logs de Debug

- Adicionados logs no `authService.js` para facilitar debug
- Console mostrará:
  - 🔐 Tentando fazer login com: [email]
  - ✅ Resposta do login: [dados]
  - ❌ Erro no login: [detalhes]

## Como Testar

1. Certifique-se que o backend está rodando na porta 5000:

```bash
cd backend
python3 run.py
```

2. Inicie o frontend:

```bash
cd frontend
npm run dev
```

3. Acesse: http://localhost:5173/admin

4. Use as credenciais:

   - Email: `admin@cardapio.com.br`
   - Senha: `meu@cardapio`

5. Abra o Console do navegador (F12) para ver os logs

## Verificando se o Backend Está Funcionando

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@cardapio.com.br","password":"meu@cardapio"}'
```

Deve retornar:

```json
{ "token": "algum-token-aqui" }
```

## Problemas Comuns

### CORS Error

Se aparecer erro de CORS no console, verifique:

- Backend tem `flask-cors` instalado
- Backend foi reiniciado após adicionar CORS

### Network Error

Se não conseguir conectar:

- Verifique se o backend está rodando na porta 5000
- Verifique se o proxy está configurado no `vite.config.js`

### Token não é salvo

- Verifique localStorage no DevTools (Application tab)
- Deve ter uma chave `authToken` após login bem-sucedido
