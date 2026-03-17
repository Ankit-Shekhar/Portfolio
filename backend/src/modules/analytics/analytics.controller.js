import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { trackAnalyticsEvent, getAnalyticsEvents, getAnalyticsSummary } from "./analytics.service.js";
import { validateAnalyticsEventPayload, validateAnalyticsListQuery } from "./analytics.validation.js";

const trackAnalyticsEventController = asyncHandler(async (req, res) => {
	const payload = validateAnalyticsEventPayload(req.body || {});
	const trackedEvent = await trackAnalyticsEvent(payload);

	return res.status(201).json(new ApiResponse(201, "Analytics event tracked successfully", trackedEvent));
});

const getAnalyticsEventsController = asyncHandler(async (req, res) => {
	const { limit } = validateAnalyticsListQuery(req.query || {});
	const events = await getAnalyticsEvents(limit);

	return res.status(200).json(new ApiResponse(200, "Analytics events fetched successfully", events));
});

const getAnalyticsSummaryController = asyncHandler(async (req, res) => {
	const summary = await getAnalyticsSummary();

	return res.status(200).json(new ApiResponse(200, "Analytics summary fetched successfully", summary));
});

export { trackAnalyticsEventController, getAnalyticsEventsController, getAnalyticsSummaryController };
