FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN prisma generate

COPY . .

CMD ["npm", "start"]
