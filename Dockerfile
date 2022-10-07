# FROM --platform=linux/amd64 node:lts-buster
FROM --platform=linux/amd64 node:14.17.3-alpine

# installing python for nodegypt
# RUN apk add --no-cache --virtual .build-deps make gcc g++ python \
#  && npm install --production --silent

# SET TIMEZONE
RUN apk update && apk add tzdata
# RUN apt-get update -y && apt-get install -y tzdata
ENV TZ=Asia/Jakarta

# USER app

# initial app
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

# RUN addgroup app && adduser -S -G app app
RUN mkdir tmp
RUN chmod -R 777 tmp
RUN npm install --only=prod
# RUN apk del .build-deps

EXPOSE 5001

RUN touch .env

ENV APP_KEY=N91T-PG82EDN4-MMIJNGKXG-YTX9W2UJ
ENV HOST=0.0.0.0
ENV PORT=5001
ENV NODE_ENV=development

CMD ["node", "server.js"]
