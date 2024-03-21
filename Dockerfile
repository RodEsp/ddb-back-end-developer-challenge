FROM node:lts AS build
ENV NODE_ENV=dev

WORKDIR /build
COPY . .

RUN npm install
RUN npm run build:prod

# Using lts-alpine for the smallest possible image
FROM node:lts-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production
COPY --from=build /build/dist ./
COPY ./data ./data

EXPOSE 80
ENTRYPOINT [ "node", "./src/server.js", "--port", "80" ]
