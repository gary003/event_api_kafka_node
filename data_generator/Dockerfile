# Build stage
FROM node:23-slim AS builder

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Copy source files
COPY src/v1/ ./src/v1/

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:23-slim

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY tsconfig*.json ./

# Environment variables (override in docker-compose)
ENV NODE_ENV=production
ENV KAFKA_BROKERS=kafka:9092
ENV GENERATOR_INTERVAL_MIN=500
ENV GENERATOR_INTERVAL_MAX=2000
ENV LOG_LEVEL=info

# Security best practices
USER node
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start command
CMD ["npm", "run", "start:generator"]
