"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
const consumer_1 = require("../messageQ/consumer");
const initMQ_1 = require("../messageQ/initMQ");
// Create HTTP server
const server = http_1.default.createServer(app_1.default);
// Normalize port
const port = normalizePort(process.env.PORT || '3000');
// Check Kafka connectivity by connecting producer and sending a test message
const checkKafkaConnectivity = async () => {
    try {
        await initMQ_1.producer.connect();
        // Optional: Send a test message to ensure topic creation and broker readiness
        await initMQ_1.producer.send({
            topic: 'test-connectivity',
            messages: [{ value: JSON.stringify({ test: 'ping' }) }]
        });
        console.info('Kafka broker is fully reachable and operational');
        await initMQ_1.producer.disconnect();
        return true;
    }
    catch (error) {
        console.error('Kafka broker not reachable:', error);
        return false;
    }
};
// Start Kafka consumer with retry and connectivity check
const startConsumerWithRetry = async (retries = 5, delay = 5000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        console.info(`Checking Kafka connectivity (attempt ${attempt}/${retries})`);
        const kafkaReady = await checkKafkaConnectivity();
        if (kafkaReady) {
            try {
                console.info('Starting Kafka consumer...');
                await (0, consumer_1.runConsumer)();
                console.info('Kafka consumer started successfully');
                return;
            }
            catch (err) {
                console.error(`Failed to start Kafka consumer: ${err}`);
            }
        }
        else {
            console.warn('Kafka not fully ready yet');
        }
        if (attempt === retries) {
            console.error('Max retries reached. Exiting...');
            process.exit(1);
        }
        console.info(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
};
// Start server and consumer
const startServer = async () => {
    try {
        await startConsumerWithRetry();
        server.listen(port);
    }
    catch (err) {
        console.error('Unexpected error starting server:', err);
        process.exit(1);
    }
};
startServer();
server.on('error', onError);
server.on('listening', onListening);
// Handle graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const portNum = parseInt(val, 10);
    if (isNaN(portNum)) {
        return val;
    }
    if (portNum >= 0) {
        return portNum;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    if (error.code === 'EACCES') {
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
    }
    else if (error.code === 'EADDRINUSE') {
        console.error(`${bind} is already in use`);
        process.exit(1);
    }
    else {
        throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    console.info(`Server listening on ${bind}`);
}
/**
 * Graceful shutdown handler
 */
function shutdown(signal) {
    console.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        console.info('HTTP server closed.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}
