FROM node:latest

RUN mkdir /app

WORKDIR /usr/app
COPY package.json .
COPY tsconfig.json .

RUN npm install

COPY src .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start-server"]