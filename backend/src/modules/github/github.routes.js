import { Router } from "express";
import {
	getGithubProfileController,
	getGithubRepositoriesController,
	getRepositoryReadmeController
} from "./github.controller.js";

const router = Router();

router.get("/profile", getGithubProfileController);
router.get("/repos", getGithubRepositoriesController);
router.get("/repos/:owner/:repo/readme", getRepositoryReadmeController);

export default router;
