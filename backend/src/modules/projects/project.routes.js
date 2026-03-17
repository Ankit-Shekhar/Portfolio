import { Router } from "express";
import {
	createProjectController,
	getAllProjectsController,
	getProjectByIdController,
	updateProjectByIdController,
	deleteProjectByIdController
} from "./project.controller.js";

const router = Router();

router.route("/").post(createProjectController).get(getAllProjectsController);
router.route("/:projectId").get(getProjectByIdController).patch(updateProjectByIdController).delete(deleteProjectByIdController);

export default router;
