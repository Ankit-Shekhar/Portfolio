import { ApiError } from "../../core/utils/ApiError.js";

const sanitizeTimelinePayload = (payload = {}) => {
	const sanitized = {
		title: typeof payload.title === "string" ? payload.title.trim() : payload.title,
		description: typeof payload.description === "string" ? payload.description.trim() : payload.description,
		yearRange: typeof payload.yearRange === "string" ? payload.yearRange.trim() : payload.yearRange,
		animationScene: typeof payload.animationScene === "string" ? payload.animationScene.trim() : payload.animationScene,
		visualAssets: Array.isArray(payload.visualAssets)
			? payload.visualAssets.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
			: payload.visualAssets,
		sequence: typeof payload.sequence === "number" ? payload.sequence : payload.sequence,
		featured: typeof payload.featured === "boolean" ? payload.featured : payload.featured
	};

	return sanitized;
};

const validateCreateTimelinePayload = (payload = {}) => {
	const sanitized = sanitizeTimelinePayload(payload);

	if (!sanitized.title || !sanitized.description || !sanitized.yearRange) {
		throw new ApiError(400, "title, description and yearRange are required");
	}

	return sanitized;
};

const validateUpdateTimelinePayload = (payload = {}) => {
	const sanitized = sanitizeTimelinePayload(payload);
	const updateKeys = Object.keys(sanitized).filter((key) => sanitized[key] !== undefined);

	if (updateKeys.length === 0) {
		throw new ApiError(400, "At least one field is required to update timeline event");
	}

	return sanitized;
};

export { validateCreateTimelinePayload, validateUpdateTimelinePayload };