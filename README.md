# Simple Node.js API

## Описание

Простая реализация REST-API с CRUD операциями на основе собственного минималистичного [фреймворка](https://github.com/Shustenkov/nodejs-simple-framework)

## Начало работы

1. Скопировать и переименовать файл `.env.example` в `.env`, указать в нём ссылку для подключения к MongoDB `DB_CONNECTION_STRING`.<br>
   Примеры ссылок (при самохосте и в облаке MongoDB соответственно)

   ```
   mongodb://127.0.0.1:27017/myapp
   mongodb+srv://exampleUser:examplePassword@exampleCluster.exmpl77.mongodb.net/?retryWrites=true&w=majority&appName=exampleCluster
   ```

   подробнее про подключение в [документации](https://mongoosejs.com/docs/connections.html)

2. `npm install`
