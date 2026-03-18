import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import { askAgentController, indexKnowledgeController, seedDataController, getPipelineEventsController } from "./agent.controller.js";

const router = Router();

router.route("/query").post(askAgentController);
router.route("/index-knowledge").post(indexKnowledgeController);
router.route("/seed-data").post(seedDataController);
router.route("/pipeline-events").get(requireAdminApiKey, getPipelineEventsController);

export default router;
