"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConsumer = void 0;
const initMQ_1 = require("./initMQ");
const runConsumer = async () => {
    try {
        await initMQ_1.consumer.connect();
        await initMQ_1.consumer.subscribe({ topic: 'event.created', fromBeginning: true });
        await initMQ_1.consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const eventData = '{????????????????}' + message;
                    //   await EventModel.create({
                    //     type: eventData.type,
                    //     data: eventData.data,
                    //     source: eventData.source || 'kafka'
                    //   })
                    console.info(`Processed event: ${eventData} ; message : ${message} on topic`);
                }
                catch (error) {
                    console.error('Error processing message on topic -!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
                }
            }
        });
    }
    catch (error) {
        console.error('Kafka consumer error:', error);
        throw error;
    }
};
exports.runConsumer = runConsumer;
// Handle consumer shutdown
process.on('SIGTERM', async () => {
    console.info('Disconnecting Kafka consumer...');
    await initMQ_1.consumer.disconnect();
    console.info('Kafka consumer disconnected');
});
