FROM node:20

WORKDIR /usr/src/app


COPY package*.json ./
COPY prisma ./prisma/



RUN npm install
RUN npx prisma generate

COPY . .


EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]