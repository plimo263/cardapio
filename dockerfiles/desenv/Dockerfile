FROM python:3.9

# DIRETORIO INICIAL
WORKDIR /dados

ADD requirements.txt /dados

RUN pip install -r requirements.txt && \
    apt-get update && apt-get install tzdata locales locales-all -y && apt clean 

ENV TZ='America/Sao_Paulo'
ENV LC_ALL="pt_BR.UTF-8"
ENV LANG='pt_BR.UTF-8'
ENV LC_CTYPE="pt_BR.UTF-8"
ENV LC_NUMERIC="pt_BR.UTF-8"
ENV LC_MONETARY="pt_BR.UTF-8"

#EXPONDO A PORTA 5000
EXPOSE 5000
## ATIVANDO O SERVICE
ENTRYPOINT ./start_app.sh debug
