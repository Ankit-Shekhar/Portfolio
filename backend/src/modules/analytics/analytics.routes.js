import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import {
	trackAnalyticsEventController,
	getAnalyticsEventsController,
	getAnalyticsSummaryController
} from "./analytics.controller.js";

const router = Router();

router.post("/events", trackAnalyticsEventController);
router.get("/events", requireAdminApiKey, getAnalyticsEventsController);
router.get("/summary", requireAdminApiKey, getAnalyticsSummaryController);

export default router;
