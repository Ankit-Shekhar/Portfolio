import { getRedisClient } from "../../core/database/redis.connection.js";

const PIPELINE_REDIS_KEY = "ai_pipeline_events";
const IN_MEMORY_PIPELINE_EVENTS = [];
const MAX_EVENTS = 200;

const logPipelineEvent = async (eventType, payload = {}) => {
	const event = {
		eventType,
		timestamp: new Date().toISOString(),
		payload
	};

	const redisClient = getRedisClient();

	if (redisClient?.isOpen) {
		await redisClient.rPush(PIPELINE_REDIS_KEY, JSON.stringify(event));
		await redisClient.lTrim(PIPELINE_REDIS_KEY, -MAX_EVENTS, -1);
		return event;
	}

	IN_MEMORY_PIPELINE_EVENTS.push(event);
	if (IN_MEMORY_PIPELINE_EVENTS.length > MAX_EVENTS) {
		IN_MEMORY_PIPELINE_EVENTS.splice(0, IN_MEMORY_PIPELINE_EVENTS.length - MAX_EVENTS);
	}

	return event;
};

const getRecentPipelineEvents = async (limit = 25) => {
	const cappedLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
	const redisClient = getRedisClient();

	if (redisClient?.isOpen) {
		const rawItems = await redisClient.lRange(PIPELINE_REDIS_KEY, -cappedLimit, -1);
		return rawItems
			.map((item) => {
				try {
					return JSON.parse(item);
				} catch {
					return null;
				}
			})
			.filter(Boolean);
	}

	return IN_MEMORY_PIPELINE_EVENTS.slice(-cappedLimit);
};

export { logPipelineEvent, getRecentPipelineEvents };
