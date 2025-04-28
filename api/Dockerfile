# Base image: Node.js 20 (LTS) on Alpine for smaller size
FROM node:23-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for building native modules (if needed)
RUN apk add --no-cache python3 make g++ linux-headers

# Copy package files first for caching
COPY . ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Stage 1: Build (compile TypeScript to JavaScript)
FROM base AS build

# Compile TypeScript
RUN npm run build

# Stage 2: Production (slim image with only runtime needs)
FROM node:23-alpine AS production

# Set working directory
WORKDIR /app

# Install runtime dependencies only
COPY . ./
RUN npm ci

# Copy compiled JavaScript from build stage
COPY --from=build /app/dist ./dist

# Expose port (matches server.ts and docker-compose.yml)
EXPOSE 3000

# Set environment (overridden by docker-compose.yml)
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/bin/server.js"]

# Healthcheck for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1