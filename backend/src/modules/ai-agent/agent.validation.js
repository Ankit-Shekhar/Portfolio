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

const validatePipelineEventsQuery = (query = {}) => {
	const limitValue = Number(query.limit);

	if (query.limit !== undefined && Number.isNaN(limitValue)) {
		throw new ApiError(400, "limit must be a number");
	}

	return {
		limit: Number.isNaN(limitValue) ? 25 : limitValue
	};
};

const validateGithubAutoIndexPayload = (payload = {}) => {
	const username = typeof payload.username === "string" ? payload.username.trim() : "";
	const maxRepositoriesValue = Number(payload.maxRepositories);

	if (payload.maxRepositories !== undefined && Number.isNaN(maxRepositoriesValue)) {
		throw new ApiError(400, "maxRepositories must be a number");
	}

	return {
		username: username || undefined,
		maxRepositories: Number.isNaN(maxRepositoriesValue) ? undefined : maxRepositoriesValue
	};
};

const validatePipelineDiagnosticsQuery = (query = {}) => {
	const limitValue = Number(query.limit);

	if (query.limit !== undefined && Number.isNaN(limitValue)) {
		throw new ApiError(400, "limit must be a number");
	}

	return {
		limit: Number.isNaN(limitValue) ? 100 : limitValue
	};
};

export {
	validateAgentQueryPayload,
	validateKnowledgeIndexPayload,
	validatePipelineEventsQuery,
	validatePipelineDiagnosticsQuery,
	validateGithubAutoIndexPayload
};