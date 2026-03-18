import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { askPortfolioAgent, indexPortfolioKnowledge, seedPortfolioData, getPipelineEvents } from "./agent.service.js";
import { validateAgentQueryPayload, validateKnowledgeIndexPayload, validatePipelineEventsQuery } from "./agent.validation.js";

const askAgentController = asyncHandler(async (req, res) => {
	const { query } = validateAgentQueryPayload(req.body || {});

	const result = await askPortfolioAgent(query);

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

export { askAgentController, indexKnowledgeController, seedDataController, getPipelineEventsController };
