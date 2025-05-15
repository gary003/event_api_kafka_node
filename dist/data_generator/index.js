"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("timers/promises");
const REQUEST_INTERVAL = 6000;
let lastRequestTime = 0;
const fetchWithRateLimit = async () => {
    const planetsArr = ['nova', 'black hole', 'star', 'comet', 'dwarf'];
    const planetsCount = Math.floor(Math.random() * 1000);
    const planetIndex = Math.floor(Math.random() * planetsArr.length);
    const data = `Found in picture - ${planetsCount} ${planetsArr[planetIndex]}(s)`;
    return {
        data,
        timestamp: Date.now()
    };
};
const run = async () => {
    while (true) {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        // Enforce rate limiting
        if (timeSinceLastRequest < REQUEST_INTERVAL) {
            const waitTime = REQUEST_INTERVAL - timeSinceLastRequest;
            await (0, promises_1.setTimeout)(waitTime);
        }
        const response = await fetchWithRateLimit().catch((err) => null);
        await (0, promises_1.setTimeout)(REQUEST_INTERVAL);
        // console.log({response})
        if (!!response) {
            console.log(`Astronomy - ${JSON.stringify(response)}`);
            lastRequestTime = Number(response.timestamp);
            // Add your Kafka producer logic here:
            // await producer.send({...});
        }
    }
};
run().catch(console.error);
