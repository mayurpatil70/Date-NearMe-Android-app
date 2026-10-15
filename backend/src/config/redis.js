const { createClient } = require("redis");

let redisClient;

// Do not attempt persistent Redis connection in Vercel serverless environment or if REDIS_URL is not set
if (process.env.REDIS_URL && !process.env.VERCEL) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 1) {
            return false; // Stop retrying immediately if unreachable
          }
          return 500;
        },
      },
    });

    redisClient.on("error", (err) => console.warn("Redis Warning:", err.message));
    redisClient.on("ready", () => console.log("Redis connected successfully"));

    redisClient.connect().catch((err) => console.warn("Redis connection warning:", err.message));
  } catch (err) {
    console.warn("Redis init error:", err.message);
  }
}

// Fallback mock client so no serverless crash can occur
if (!redisClient) {
  redisClient = {
    get: async () => null,
    set: async () => true,
    del: async () => true,
    on: () => {},
    connect: async () => {},
  };
}

module.exports = redisClient;
