import { ApiError } from "../../core/utils/ApiError.js";

const sanitizeProjectPayload = (payload = {}) => {
	const sanitized = {
		title: typeof payload.title === "string" ? payload.title.trim() : payload.title,
		slug: typeof payload.slug === "string" ? payload.slug.trim().toLowerCase() : payload.slug,
		description: typeof payload.description === "string" ? payload.description.trim() : payload.description,
		technologies: Array.isArray(payload.technologies)
			? payload.technologies.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
			: payload.technologies,
		githubUrl: typeof payload.githubUrl === "string" ? payload.githubUrl.trim() : payload.githubUrl,
		liveUrl: typeof payload.liveUrl === "string" ? payload.liveUrl.trim() : payload.liveUrl,
		architectureNotes: typeof payload.architectureNotes === "string" ? payload.architectureNotes.trim() : payload.architectureNotes,
		impactExplanation: typeof payload.impactExplanation === "string" ? payload.impactExplanation.trim() : payload.impactExplanation,
		featured: typeof payload.featured === "boolean" ? payload.featured : payload.featured
	};

	return sanitized;
};

const validateCreateProjectPayload = (payload = {}) => {
	const sanitized = sanitizeProjectPayload(payload);

	if (!sanitized.title || !sanitized.slug || !sanitized.description) {
		throw new ApiError(400, "title, slug and description are required");
	}

	return sanitized;
};

const validateUpdateProjectPayload = (payload = {}) => {
	const sanitized = sanitizeProjectPayload(payload);
	const updateKeys = Object.keys(sanitized).filter((key) => sanitized[key] !== undefined);

	if (updateKeys.length === 0) {
		throw new ApiError(400, "At least one field is required to update project");
	}

	return sanitized;
};

export { validateCreateProjectPayload, validateUpdateProjectPayload };