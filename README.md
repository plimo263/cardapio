# Cardápio

Projeto de cardápio online feito em Flask (backend) e React (frontend). Que tal ter um sistema de cardápio extremamente simples
onde você possa controlar os itens a serem exibidos e com um site responsivo ? O objetivo deste projeto é este, unir a simplicidade
junto da eficiência de se ter um cardápio pronto em questão de minutos.

[DOCUMENTAÇÃO DA API](https://plimo263.github.io/cardapio/)

## Como posso começar ?

Primeiro é necessário criar um arquivo _.env_ que vai conter detalhes da configuração do projeto. Os detalhes são a URI de conexão ao banco de dados e a secret_key usada pelo flask para proteger cookies e sessions e também a Recaptcha Key do Google que será usada para dar mais segurança na autenticação. O conteúdo do arquivo deve se parece com o que segue abaixo.

```
URI_DATABASE='sqlite:///cardapio.db'
SECRET_KEY = 'CHAVE_SECRETA'
APP_DEBUG = 1 # 1 Para debug ativo, 0 para inativo
RECAPTCHA = ''
```

**Para criar a SECRET_KEY chave secreta você pode usar o modulo secrets como mostrado abaixo.**

```
import secrets
print(secrets.token_urlsafe(48))
'C2OKGLiOn3uX6nBb_yoz99y-b47hguLxPomJnS24lKo7TJEu5JuKVCUE-H49F6ii'

```

**Copie este código e cole onde deve-se informar a SECRET_KEY**

Depois disto o próximo passo será criar a base de dados.

### Montando o ambiente virtual (venv) do projeto

Antes de iniciar o projeto crie um ambiente virtual.

- Criando ambiente virtual

```
python3 -m venv .venv
```

- Instalando dependências

```
source .venv/bin/activate && pip install -r requirements.txt
```

### Criando a base de dados

Para realizar a criação da base de dados você deve executar o script _create_db_. Com isto as tabelas seram criadas no banco. Você será perguntado também se deseja criar um usuário administrativo, basta digitar 1 (sim) ou 2 (não).

```
python3 create_db.py
```

**Indicado executar este comando acima no .venv do projeto**

### Iniciando o projeto

Dentro da pasta raiz do projeto execute o comando abaixo com uma das opções.

- debug: Caso esteja em periodo de desenvolvimento e quer fazer uso do hotreload
- deploy: Caso ja esteja subindo para um servidor de produção

```
./start_app.sh debug
```

## Assets necessários do projeto

Como este é um projeto publico mas que precisa de fato mencionar a marca de alguma empresa e/ou restaurante faz-se necessário incluir 2 imagens para um melhor uso da aplicação. Estes assets devem ter o nome **logo.png** e **logo2.png** e devem ficar dentro da pasta _static_ raiz do projeto.

```

cd static

ls
logo.png logo2.png

```

Outro asset necessário será a Recaptcha Key do lado do cliente, esta recaptcha deve ser inserida dentro de um arquivo _env.js_ na pasta frontend/src. O conteúdo deste arquivo deve ser o informado abaixo.

```
export const RECAPTCHA = "SEU_RECAPTCHA_CLIENT";

```

Depois de inseridos estes assets basta ir na pasta do frontend e executar os seguintes comandos (suponho que você tenha o nodejs instalado.)

```
yarn install && yarn run build
```
