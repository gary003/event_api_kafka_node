"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = void 0;
const initMQ_1 = require("./initMQ");
/**
 * Publish an event to a Kafka topic
 */
const publishEvent = async (topic, message) => {
    try {
        await initMQ_1.producer.connect();
        await initMQ_1.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }]
        });
        console.info(`Published event to topic ${topic}`);
    }
    catch (error) {
        console.error(`Failed to publish event to ${topic}:`, error);
        throw error;
    }
    finally {
        await initMQ_1.producer.disconnect();
    }
};
exports.publishEvent = publishEvent;
