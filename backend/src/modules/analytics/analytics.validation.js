import { ApiError } from "../../core/utils/ApiError.js";

const sanitizeAnalyticsPayload = (payload = {}) => {
	return {
		eventType: typeof payload.eventType === "string" ? payload.eventType.trim() : payload.eventType,
		projectId: typeof payload.projectId === "string" ? payload.projectId.trim() : payload.projectId,
		sessionId: typeof payload.sessionId === "string" ? payload.sessionId.trim() : payload.sessionId,
		metadata: typeof payload.metadata === "object" && payload.metadata !== null ? payload.metadata : {}
	};
};

const validateAnalyticsEventPayload = (payload = {}) => {
	const sanitized = sanitizeAnalyticsPayload(payload);

	if (!sanitized.eventType) {
		throw new ApiError(400, "eventType is required");
	}

	return sanitized;
};

const validateAnalyticsListQuery = (query = {}) => {
	const limitValue = Number(query.limit);

	if (query.limit !== undefined && Number.isNaN(limitValue)) {
		throw new ApiError(400, "limit must be a number");
	}

	return {
		limit: Number.isNaN(limitValue) ? 50 : limitValue
	};
};

export { validateAnalyticsEventPayload, validateAnalyticsListQuery };
