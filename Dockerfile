# Stage 1: Build stage
FROM node:23-slim

WORKDIR /app

# Copy source files
COPY . .

# Install all dependencies including devDependencies
RUN npm i

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "./dist/bin/server.js"]