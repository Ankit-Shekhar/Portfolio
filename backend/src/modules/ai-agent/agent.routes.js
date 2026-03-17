import { Router } from "express";
import { askAgentController } from "./agent.controller.js";

const router = Router();

router.route("/query").post(askAgentController);

export default router;
