# Stage 1: Build stage
FROM node:23-slim

WORKDIR /app

COPY package*.json .

# Install all dependencies including devDependencies
RUN npm i

# Copy source files
COPY . .

# Expose the application port
EXPOSE 3000

RUN npm run build

# Start the application
CMD ["node", "./dist/src/bin/server.js"]