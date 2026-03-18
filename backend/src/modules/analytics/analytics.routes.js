import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import { createRateLimiter } from "../../core/middlewares/rateLimit.middleware.js";
import {
	trackAnalyticsEventController,
	getAnalyticsEventsController,
	getAnalyticsSummaryController
} from "./analytics.controller.js";

const router = Router();
const analyticsTrackRateLimiter = createRateLimiter({ windowMs: 60_000, max: 50, keyPrefix: "analytics-track" });
const analyticsAdminRateLimiter = createRateLimiter({ windowMs: 60_000, max: 40, keyPrefix: "analytics-admin" });

router.post("/events", analyticsTrackRateLimiter, trackAnalyticsEventController);
router.get("/events", requireAdminApiKey, analyticsAdminRateLimiter, getAnalyticsEventsController);
router.get("/summary", requireAdminApiKey, analyticsAdminRateLimiter, getAnalyticsSummaryController);

export default router;
