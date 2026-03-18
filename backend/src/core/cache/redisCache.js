import { getRedisClient } from "../database/redis.connection.js";

const getCacheJson = async (key) => {
	const redisClient = getRedisClient();

	if (!redisClient?.isOpen) {
		return null;
	}

	const rawValue = await redisClient.get(key);

	if (!rawValue) {
		return null;
	}

	try {
		return JSON.parse(rawValue);
	} catch {
		return null;
	}
};

const setCacheJson = async (key, value, ttlSeconds = 60) => {
	const redisClient = getRedisClient();

	if (!redisClient?.isOpen) {
		return false;
	}

	await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
	return true;
};

const deleteCacheKey = async (key) => {
	const redisClient = getRedisClient();

	if (!redisClient?.isOpen) {
		return false;
	}

	await redisClient.del(key);
	return true;
};

export { getCacheJson, setCacheJson, deleteCacheKey };