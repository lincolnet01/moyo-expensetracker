# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci --workspace=client

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY client/ client/
COPY server/package.json server/

ARG API_URL=http://server:5000
ENV API_URL=${API_URL}

RUN cd client && npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/client/.next/standalone ./
COPY --from=builder /app/client/.next/static ./client/.next/static
COPY --from=builder /app/client/public ./client/public

EXPOSE 3000

CMD ["node", "client/server.js"]
