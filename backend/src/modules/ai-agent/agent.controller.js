import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import {
	askPortfolioAgent,
	indexPortfolioKnowledge,
	seedPortfolioData,
	getPipelineEvents,
	getPipelineDiagnostics,
	runGithubAutoIndex,
	getGithubIndexStatus
} from "./agent.service.js";
import {
	validateAgentQueryPayload,
	validateKnowledgeIndexPayload,
	validatePipelineEventsQuery,
	validatePipelineDiagnosticsQuery,
	validateGithubAutoIndexPayload
} from "./agent.validation.js";

const askAgentController = asyncHandler(async (req, res) => {
	const { query } = validateAgentQueryPayload(req.body || {});
	const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

	const result = await askPortfolioAgent(query, { requestId });

	return res.status(200).json(new ApiResponse(200, "AI response generated successfully", result));
});

const indexKnowledgeController = asyncHandler(async (req, res) => {
	const payload = validateKnowledgeIndexPayload(req.body || {});
	const result = await indexPortfolioKnowledge(payload);

	return res.status(200).json(new ApiResponse(200, "Knowledge indexing completed successfully", result));
});

const seedDataController = asyncHandler(async (req, res) => {
	const result = await seedPortfolioData();

	return res.status(200).json(new ApiResponse(200, "Sample data seeded successfully", result));
});

const getPipelineEventsController = asyncHandler(async (req, res) => {
	const { limit } = validatePipelineEventsQuery(req.query || {});
	const events = await getPipelineEvents(limit);

	return res.status(200).json(new ApiResponse(200, "Pipeline events fetched successfully", events));
});

const getPipelineDiagnosticsController = asyncHandler(async (req, res) => {
	const { limit } = validatePipelineDiagnosticsQuery(req.query || {});
	const diagnostics = await getPipelineDiagnostics(limit);

	return res.status(200).json(new ApiResponse(200, "Pipeline diagnostics fetched successfully", diagnostics));
});

const runGithubAutoIndexController = asyncHandler(async (req, res) => {
	const payload = validateGithubAutoIndexPayload(req.body || {});
	const result = await runGithubAutoIndex(payload);

	return res.status(result.accepted ? 200 : 202).json(new ApiResponse(200, result.message, result));
});

const getGithubAutoIndexStatusController = asyncHandler(async (req, res) => {
	const status = await getGithubIndexStatus();

	return res.status(200).json(new ApiResponse(200, "GitHub index status fetched successfully", status));
});

export {
	askAgentController,
	indexKnowledgeController,
	seedDataController,
	getPipelineEventsController,
	getPipelineDiagnosticsController,
	runGithubAutoIndexController,
	getGithubAutoIndexStatusController
};
