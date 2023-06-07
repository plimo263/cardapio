#!/bin/bash

# Cria e inicializa uma aplicação Flask usando o 
# gunicorn que é um webserver para produção.
#
# Caso precise executar em modo de desenvolvimento 
# digite na linha de comando:
# ./start_app.sh debug # Para iniciar em desenvolvimento
# ./start_app.sh deploy # Para iniciar em producao
#


case "$1" in 
    debug)
        gunicorn -t 240 -w 4 -b 0.0.0.0:5000 --reload --access-logfile - "index:app";;
    deploy)
        gunicorn -t 480 -w 4 -b 0.0.0.0:5000 --access-logfile - "index:app";;
    *)
        echo "Digite debug ou deploy";;
esac
