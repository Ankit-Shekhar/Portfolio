import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { fetchGithubProfile, fetchGithubRepositories, fetchRepositoryReadme } from "./github.service.js";
import { validateGithubRepoReadmeParams, validateGithubUsernameQuery } from "./github.validation.js";

const getGithubProfileController = asyncHandler(async (req, res) => {
	const { username } = validateGithubUsernameQuery(req.query || {});
	const profile = await fetchGithubProfile(username);

	return res.status(200).json(new ApiResponse(200, "GitHub profile fetched successfully", profile));
});

const getGithubRepositoriesController = asyncHandler(async (req, res) => {
	const { username } = validateGithubUsernameQuery(req.query || {});
	const repositories = await fetchGithubRepositories(username);

	return res.status(200).json(new ApiResponse(200, "GitHub repositories fetched successfully", repositories));
});

const getRepositoryReadmeController = asyncHandler(async (req, res) => {
	const { owner, repo } = validateGithubRepoReadmeParams(req.params || {});
	const readme = await fetchRepositoryReadme(owner, repo);

	return res.status(200).json(new ApiResponse(200, "Repository README fetched successfully", readme));
});

export { getGithubProfileController, getGithubRepositoriesController, getRepositoryReadmeController };
