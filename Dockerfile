FROM node:20

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/



RUN npm install
RUN npx prisma generate

COPY . .

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]