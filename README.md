# API

## Como rodar

Crie um arquivo `.env` com as variaveis de `example.env` e rode com o comando abaixo

```
docker-compose up
```

## Como testar

Para testar a aplicação rode o comando abaixo:

```
docker-compose run --rm -e NODE_ENV=test strongberry_api bash -c  "yarn && yarn jest --coverage --forceExit"
```