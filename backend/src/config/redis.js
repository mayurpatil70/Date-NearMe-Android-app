const { createClient } = require("redis");

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    pingInterval: 10000,
    socket: {
      keepAlive: 10000,
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error("Redis max retries reached");
        return Math.min(retries * 50, 2000);
      },
    },
  });

  redisClient.on("error", (err) => console.error("Redis Client Error:", err));
  redisClient.on("ready", () => console.log("Redis connected successfully"));

  redisClient.connect().catch((err) => console.warn("Redis connection warning:", err.message));
} else {
  // Fallback dummy client if REDIS_URL is not configured
  redisClient = {
    get: async () => null,
    set: async () => true,
    del: async () => true,
    on: () => {},
    connect: async () => {},
  };
}

module.exports = redisClient;
