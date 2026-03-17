import { Router } from "express";
import {
	createSkillController,
	getAllSkillsController,
	getSkillByIdController,
	updateSkillByIdController,
	deleteSkillByIdController
} from "./skill.controller.js";

const router = Router();

router.route("/").post(createSkillController).get(getAllSkillsController);
router.route("/:skillId").get(getSkillByIdController).patch(updateSkillByIdController).delete(deleteSkillByIdController);

export default router;
