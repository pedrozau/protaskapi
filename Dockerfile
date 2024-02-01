FROM node:20

WORKDIR /usr/


COPY package*.json ./



RUN npm install
RUN npx prisma generate

COPY . .

CMD ["npm", "start"]
