import mongoose, { Schema } from "mongoose";
import { deleteCacheKey, getCacheJson, setCacheJson } from "../../core/cache/redisCache.js";

const ANALYTICS_SUMMARY_CACHE_KEY = "analytics:summary:v1";
const ANALYTICS_SUMMARY_CACHE_TTL_SECONDS = Number(process.env.ANALYTICS_SUMMARY_CACHE_TTL_SECONDS || 120);

const analyticsEventSchema = new Schema(
	{
		eventType: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		projectId: {
			type: String,
			trim: true,
			index: true
		},
		sessionId: {
			type: String,
			trim: true,
			index: true
		},
		metadata: {
			type: Schema.Types.Mixed,
			default: {}
		}
	},
	{
		timestamps: true
	}
);

const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", analyticsEventSchema, "analytics_events");

const trackAnalyticsEvent = async (payload) => {
	const event = await AnalyticsEvent.create(payload);
	await deleteCacheKey(ANALYTICS_SUMMARY_CACHE_KEY);
	return event;
};

const getAnalyticsEvents = async (limit = 50) => {
	const cappedLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
	const events = await AnalyticsEvent.find().sort({ createdAt: -1 }).limit(cappedLimit);

	return events;
};

const getAnalyticsSummary = async () => {
	const cachedSummary = await getCacheJson(ANALYTICS_SUMMARY_CACHE_KEY);

	if (cachedSummary) {
		return cachedSummary;
	}

	const [totalEvents, eventTypeStats, projectStats] = await Promise.all([
		AnalyticsEvent.countDocuments(),
		AnalyticsEvent.aggregate([
			{ $group: { _id: "$eventType", count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		]),
		AnalyticsEvent.aggregate([
			{ $match: { projectId: { $exists: true, $ne: "" } } },
			{ $group: { _id: "$projectId", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 }
		])
	]);

	const summary = {
		totalEvents,
		eventsByType: eventTypeStats.map((item) => ({ eventType: item._id, count: item.count })),
		topProjects: projectStats.map((item) => ({ projectId: item._id, count: item.count }))
	};

	await setCacheJson(ANALYTICS_SUMMARY_CACHE_KEY, summary, ANALYTICS_SUMMARY_CACHE_TTL_SECONDS);

	return summary;
};

export { trackAnalyticsEvent, getAnalyticsEvents, getAnalyticsSummary };
