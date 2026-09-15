# Stage 1: Build Frontend (React / Vite)
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production Server (Node.js / Express)
FROM node:20-alpine AS runner
WORKDIR /app

# Copy server dependencies and install production modules
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Copy compiled static frontend assets from stage 1
COPY --from=client-builder /app/client/dist /app/client/dist

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start Express Server
CMD ["node", "server.js"]
