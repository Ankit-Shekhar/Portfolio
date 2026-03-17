import { ApiError } from "../../core/utils/ApiError.js";

const buildGithubHeaders = () => {
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "ai-portfolio-os"
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	return headers;
};

const parseGithubResponse = async (response) => {
	if (!response.ok) {
		if (response.status === 404) {
			throw new ApiError(404, "Requested GitHub resource was not found");
		}

		if (response.status === 403) {
			throw new ApiError(403, "GitHub API rate limit exceeded or access forbidden");
		}

		throw new ApiError(response.status, "GitHub API request failed");
	}

	return response.json();
};

const fetchGithubProfile = async (username) => {
	const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
		headers: buildGithubHeaders()
	});

	return parseGithubResponse(response);
};

const fetchGithubRepositories = async (username) => {
	const response = await fetch(
		`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
		{
			headers: buildGithubHeaders()
		}
	);

	return parseGithubResponse(response);
};

const fetchRepositoryReadme = async (owner, repo) => {
	const response = await fetch(
		`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
		{
			headers: buildGithubHeaders()
		}
	);

	const readmeMeta = await parseGithubResponse(response);

	if (!readmeMeta?.download_url) {
		throw new ApiError(404, "README not found for repository");
	}

	const rawResponse = await fetch(readmeMeta.download_url);

	if (!rawResponse.ok) {
		throw new ApiError(rawResponse.status, "Failed to download README content");
	}

	const content = await rawResponse.text();

	return {
		owner,
		repo,
		path: readmeMeta.path,
		url: readmeMeta.html_url,
		content
	};
};

export { fetchGithubProfile, fetchGithubRepositories, fetchRepositoryReadme };
