import { Router } from "express";
import { createRateLimiter } from "../../core/middlewares/rateLimit.middleware.js";
import {
	getGithubProfileController,
	getGithubRepositoriesController,
	getRepositoryReadmeController
} from "./github.controller.js";

const router = Router();
const githubReadRateLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyPrefix: "github-read" });

router.get("/profile", githubReadRateLimiter, getGithubProfileController);
router.get("/repos", githubReadRateLimiter, getGithubRepositoriesController);
router.get("/repos/:owner/:repo/readme", githubReadRateLimiter, getRepositoryReadmeController);

export default router;
