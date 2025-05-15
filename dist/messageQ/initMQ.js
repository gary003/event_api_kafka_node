"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
// Initialize Kafka client
const kafka = new kafkajs_1.Kafka({
    clientId: 'event-api',
    brokers: [process.env.KAFKA_BROKERS || ''] // e.g., ['kafka:9092']
});
// Create producer with legacy partitioner to avoid warning
exports.producer = kafka.producer({
    createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner
});
// Create consumer
exports.consumer = kafka.consumer({ groupId: 'event-group' });
