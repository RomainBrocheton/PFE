FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app

COPY . .

EXPOSE 8080
CMD ["npm", "start"]