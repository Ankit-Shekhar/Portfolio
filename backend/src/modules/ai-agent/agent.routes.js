import { Router } from "express";
import { askAgentController, indexKnowledgeController, seedDataController } from "./agent.controller.js";

const router = Router();

router.route("/query").post(askAgentController);
router.route("/index-knowledge").post(indexKnowledgeController);
router.route("/seed-data").post(seedDataController);

export default router;
