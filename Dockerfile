ARG BASEIMAGE_VERSION=18-alpine

FROM node:${BASEIMAGE_VERSION} AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]