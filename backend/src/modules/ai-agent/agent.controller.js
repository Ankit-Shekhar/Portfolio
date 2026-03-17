import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { askPortfolioAgent } from "./agent.service.js";

const askAgentController = asyncHandler(async (req, res) => {
	const { query } = req.body;

	if (!query || typeof query !== "string") {
		throw new ApiError(400, "query is required");
	}

	const result = await askPortfolioAgent(query);

	return res.status(200).json(new ApiResponse(200, "AI response generated successfully", result));
});

export { askAgentController };
