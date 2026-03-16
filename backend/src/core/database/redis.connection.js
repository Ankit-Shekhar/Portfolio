import { createClient } from "redis";

let redisClient = null;

const connectRedis = async () => {
	try {
		//if REDIS_URL is present we can directly use that single URI
		const redisConfig = process.env.REDIS_URL
			? {
				url: process.env.REDIS_URL
			}
			: {
				username: process.env.REDIS_USERNAME || "default",
				password: process.env.REDIS_PASSWORD,
				socket: {
					host: process.env.REDIS_HOST,
					port: Number(process.env.REDIS_PORT || 6379)
				}
			};

		//if connection is already open we return that same instance, no need to reconnect
		if (redisClient?.isOpen) {
			return redisClient;
		}

		redisClient = createClient(redisConfig);

		redisClient.on("error", (error) => {
			console.log(`Redis connection Failed: ${error}`);
		});

		await redisClient.connect();
		console.log("Redis connected successfully!");

		return redisClient;
	} catch (error) {
		console.log(`Redis connection Failed: ${error}`);

		//whatever process is running now this process below is the reference of it through which we can exit that process
		process.exit(1); // Exit the process with failure
	}
};

export const getRedisClient = () => redisClient;
export default connectRedis;
