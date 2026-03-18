import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import { createRateLimiter } from "../../core/middlewares/rateLimit.middleware.js";
import {
	askAgentController,
	indexKnowledgeController,
	seedDataController,
	getPipelineEventsController,
	getPipelineDiagnosticsController,
	runGithubAutoIndexController,
	getGithubAutoIndexStatusController
} from "./agent.controller.js";

const router = Router();
const queryRateLimiter = createRateLimiter({ windowMs: 60_000, max: 25, keyPrefix: "ai-query" });
const indexRateLimiter = createRateLimiter({ windowMs: 60_000, max: 8, keyPrefix: "ai-index" });
const pipelineRateLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyPrefix: "ai-pipeline" });

router.route("/query").post(queryRateLimiter, askAgentController);
router.route("/index-knowledge").post(indexRateLimiter, indexKnowledgeController);
router.route("/seed-data").post(seedDataController);
router.route("/pipeline-events").get(requireAdminApiKey, pipelineRateLimiter, getPipelineEventsController);
router.route("/pipeline-diagnostics").get(requireAdminApiKey, pipelineRateLimiter, getPipelineDiagnosticsController);
router.route("/index-github").post(requireAdminApiKey, indexRateLimiter, runGithubAutoIndexController);
router.route("/index-github/status").get(requireAdminApiKey, pipelineRateLimiter, getGithubAutoIndexStatusController);

export default router;
