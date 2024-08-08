FROM node:20.11.1-alpine as backend

RUN apk add --no-cache bash python3 make g++
RUN npm i -g pnpm node-gyp-build nodemon

RUN mkdir -p /tmp/app
COPY package*.json /tmp/app
RUN cd /tmp/app && pnpm install

COPY . /usr/src/app

RUN rm -rf /usr/src/app/node_modules
RUN mv /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app

CMD ["pnpm", "start"]

EXPOSE 3000