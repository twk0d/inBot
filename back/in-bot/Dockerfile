# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/contacts_db" npx prisma generate
RUN npm run build

# Stage 2: Run
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]
