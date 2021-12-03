FROM --platform=linux/amd64 node:16.3-alpine3.12

WORKDIR /app

COPY package*.json /app/
RUN npm ci

COPY lib/ /app

ENTRYPOINT [ "node", "cli.js" ]
