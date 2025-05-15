# Stage 1: Build stage
FROM node:23-slim AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig.json ./
COPY .c8rc.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy source files
COPY src ./src
COPY eslint.config.mjs ./

# Build the project
RUN npm run build

# Stage 2: Production stage
FROM node:23-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy build artifacts from builder
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "./dist/bin/server.js"]