# Stage: Production image
FROM node:23-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install production dependencies only
RUN npm ci

COPY ./src ./

# Create the dist folder
RUN npm run build

# Environment variables (will be overridden by compose)
ENV KAFKA_BROKERS=kafka:9092
ENV REQUEST_INTERVAL=6000

# Start the data generator
CMD ["node", "./dist/index.js"]
