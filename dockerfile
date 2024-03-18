# Dockerfile
FROM node:20.9.0-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm i

copy .env ./.env
COPY src src
COPY tsconfig.json ./tsconfig.json

CMD npm start