"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const promises_1 = require("timers/promises");
const coinName = 'bitcoin';
const COINCAP_API_URL = `https://api.coingecko.com/api/v3/coins/${coinName}`;
const REQUEST_INTERVAL = 20000; // 20 seconds between requests (CoinCap allows 10-30 RPM)
let lastRequestTime = 0;
const fetchWithRateLimit = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    // Enforce rate limiting
    if (timeSinceLastRequest < REQUEST_INTERVAL) {
        const waitTime = REQUEST_INTERVAL - timeSinceLastRequest;
        await (0, promises_1.setTimeout)(waitTime);
    }
    try {
        lastRequestTime = Date.now();
        const response = await (0, node_fetch_1.default)(COINCAP_API_URL);
        if (response.status === 429) {
            console.warn('Rate limit hit, backing off...');
            await (0, promises_1.setTimeout)(10000); // Wait 10 seconds if rate limited
            return null;
        }
        if (!response.ok) {
            console.error({ response });
            throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json());
        return {
            price: data.market_data.current_price.eur,
            // marketCap: data.marketCapUsd ? parseFloat(data.marketCapUsd) : null,
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        console.error('API Error:', error instanceof Error ? error.message : String(error));
        return null;
    }
};
const run = async () => {
    while (true) {
        const data = await fetchWithRateLimit();
        if (data) {
            console.log('Current Bitcoin Price:', {
                price: data.price,
                // marketCap: data.marketCap,
                time: data.timestamp
            });
            // Add your Kafka producer logic here:
            // await producer.send({...});
        }
        await (0, promises_1.setTimeout)(REQUEST_INTERVAL);
    }
};
run().catch(console.error);
