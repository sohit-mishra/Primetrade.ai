const { createClient } = require('redis');
const config = require('@/Config/env');

const redisClient = createClient({
    url: config.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
});

(async () => {
    await redisClient.connect();
    console.log("Connected to Redis");
})();

module.exports = redisClient;