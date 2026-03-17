import { ApiError } from "../../core/utils/ApiError.js";

const validateAgentQueryPayload = (payload = {}) => {
	const query = typeof payload.query === "string" ? payload.query.trim() : "";

	if (!query) {
		throw new ApiError(400, "query is required");
	}

	if (query.length > 2000) {
		throw new ApiError(400, "query is too long");
	}

	return { query };
};

const validateKnowledgeIndexPayload = (payload = {}) => {
	const repositoryDocuments = Array.isArray(payload.repositoryDocuments) ? payload.repositoryDocuments : [];

	for (const repositoryDocument of repositoryDocuments) {
		if (typeof repositoryDocument?.content !== "string") {
			throw new ApiError(400, "Each repositoryDocument must contain string content");
		}
	}

	return { repositoryDocuments };
};

export { validateAgentQueryPayload, validateKnowledgeIndexPayload };