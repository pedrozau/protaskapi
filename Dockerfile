FROM node:20.11.0 as builder

WORKDIR /app


COPY package*.json ./
COPY .env ./
COPY prisma ./prisma/




RUN npm install
RUN npx prisma migrate dev --name init

COPY . .

RUN npm run build

FROM node:20.11.0


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]