import { ApiError } from "../../core/utils/ApiError.js";

const validateGithubUsernameQuery = (query = {}) => {
	const username = typeof query.username === "string" ? query.username.trim() : "";

	if (!username) {
		throw new ApiError(400, "username query parameter is required");
	}

	return { username };
};

const validateGithubRepoReadmeParams = (params = {}) => {
	const owner = typeof params.owner === "string" ? params.owner.trim() : "";
	const repo = typeof params.repo === "string" ? params.repo.trim() : "";

	if (!owner || !repo) {
		throw new ApiError(400, "owner and repo route parameters are required");
	}

	return { owner, repo };
};

export { validateGithubUsernameQuery, validateGithubRepoReadmeParams };
