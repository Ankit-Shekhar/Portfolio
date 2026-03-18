import { ApiError } from "../utils/ApiError.js";
import { getRedisClient } from "../database/redis.connection.js";

const rateLimitBuckets = new Map();

const runInMemoryRateLimit = ({ bucketKey, windowMs, max }) => {
	const currentTime = Date.now();
	const bucket = rateLimitBuckets.get(bucketKey);

	if (!bucket || currentTime > bucket.resetAt) {
		rateLimitBuckets.set(bucketKey, {
			count: 1,
			resetAt: currentTime + windowMs
		});
		return;
	}

	if (bucket.count >= max) {
		throw new ApiError(429, "Too many requests, please retry after some time");
	}

	bucket.count += 1;
	rateLimitBuckets.set(bucketKey, bucket);
};

const createRateLimiter = ({ windowMs = 60_000, max = 60, keyPrefix = "global" } = {}) => {
	return async (req, res, next) => {
		const ip = req.ip || req.socket?.remoteAddress || "unknown-ip";
		const redisBucketKey = `${keyPrefix}:${ip}:${Math.floor(Date.now() / windowMs)}`;
		const fallbackBucketKey = `${keyPrefix}:${ip}`;

		try {
			const redisClient = getRedisClient();

			if (redisClient?.isOpen) {
				const requestCount = await redisClient.incr(redisBucketKey);

				if (requestCount === 1) {
					await redisClient.pExpire(redisBucketKey, windowMs);
				}

				if (requestCount > max) {
					throw new ApiError(429, "Too many requests, please retry after some time");
				}

				return next();
			}
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			// Fallback to local memory limiter when Redis is unavailable.
		}

		runInMemoryRateLimit({ bucketKey: fallbackBucketKey, windowMs, max });
		return next();
	};
};

export { createRateLimiter };
