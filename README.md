# Cardápio

Projeto de cardápio online feito em Flask (backend) e React (frontend). Que tal ter um sistema de cardápio extremamente simples
onde você possa controlar os itens a serem exibidos e com um site responsivo ? O objetivo deste projeto é este, unir a simplicidade
junto da eficiência de se ter um cardápio pronto em questão de segundos.

[DOCUMENTAÇÃO DA API](https://plimo263.github.io/cardapio/)

## Como posso começar ?

Primeiro é necessário criar um arquivo _.env_ que vai conter detalhes da configuração do projeto. Os detalhes são a URI de conexão ao banco de dados e a secret_key usada pelo flask para proteger cookies e sessions. O conteúdo do arquivo deve se parece com o que segue abaixo.

```
URI_DATABASE='sqlite:///cardapio.db'
SECRET_KEY = 'CHAVE_SECRETA'
```

**Para criar esta chave secreta você pode usar o modulo secrets como mostrado abaixo.**

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

Para realizar a criação da base de dados você deve executar o script _create_db_. Com isto as tabelas seram criadas no banco, se você estiver usando este exemplo como guia, verá uma base de dados SQFLITE sendo criada dentro de uma pasta chamada instance.

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

Assim o projeto já estará no ar, caso queira preencher os dados iniciais de produtos veja a próxima sessão.

### Preenchimento de dados de exemplo

Para criar os dados de exemplo disponíveis com os itens já preenchidos primeiro você precisa ter um usuário que pode se autenticar. Caso não tenha um
é possível cria-lo executando o script _create_db.py_ passando o argumento _create_user_default_ para ele.

- Criando o usuário default:

```
python3 create_db.py create_user_default

Usuario: admin@example.com
Senha: admin
```

Com o usuário default criado basta então subir a instancia do servidor (./start\*app.sh debug), abrir outra aba do terminal, ir na pasta **init_data**, abrir o arquivo _.env_ da pasta e colocar os seguintes parametros.

```
HOST = 'http://localhost:5000'
EMAIL = 'admin@example.com'
SENHA = 'admin'
```

Por fim execute o script _init_data.py_ para criar os dados de exemplo.

```
python3 init_data.py
```

**Lembre-se que o servidor precisa estar ativo para funcionar, caso contrário não será possível fazer uso deste script para criar os dados iniciais.**

## Assets necessários do projeto

Como este é um projeto publico mas que precisa de fato mencionar a marca de alguma empresa e/ou restaurante faz-se necessário incluir 2 assets para um melhor uso da aplicação. Estes assets devem ter o nome **logo.png** e **logo2.png** e devem ficar dentro da pasta _static_ raiz do projeto.

```

cd static

ls
logo.png logo2.png

```
