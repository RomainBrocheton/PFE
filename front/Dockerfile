FROM node:lts-alpine3.14 AS build
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist/front /usr/share/nginx/html

EXPOSE 80