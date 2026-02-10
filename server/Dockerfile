# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --workspace=server

# Stage 2: Generate Prisma client and build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY server/ server/
COPY client/package.json client/
RUN cd server && npx prisma generate
RUN cd server && npx tsc

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app/server

ENV NODE_ENV=production

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "dist/index.js"]
