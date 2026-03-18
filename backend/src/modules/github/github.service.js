import { ApiError } from "../../core/utils/ApiError.js";
import { getCacheJson, setCacheJson } from "../../core/cache/redisCache.js";

const GITHUB_PROFILE_CACHE_TTL_SECONDS = Number(process.env.GITHUB_PROFILE_CACHE_TTL_SECONDS || 180);
const GITHUB_REPOS_CACHE_TTL_SECONDS = Number(process.env.GITHUB_REPOS_CACHE_TTL_SECONDS || 180);
const GITHUB_README_CACHE_TTL_SECONDS = Number(process.env.GITHUB_README_CACHE_TTL_SECONDS || 300);

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
	const cacheKey = `github:profile:${String(username || "").toLowerCase()}`;
	const cachedProfile = await getCacheJson(cacheKey);

	if (cachedProfile) {
		return cachedProfile;
	}

	const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
		headers: buildGithubHeaders()
	});

	const profile = await parseGithubResponse(response);
	await setCacheJson(cacheKey, profile, GITHUB_PROFILE_CACHE_TTL_SECONDS);

	return profile;
};

const fetchGithubRepositories = async (username) => {
	const cacheKey = `github:repos:${String(username || "").toLowerCase()}`;
	const cachedRepositories = await getCacheJson(cacheKey);

	if (cachedRepositories) {
		return cachedRepositories;
	}

	const response = await fetch(
		`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
		{
			headers: buildGithubHeaders()
		}
	);

	const repositories = await parseGithubResponse(response);
	await setCacheJson(cacheKey, repositories, GITHUB_REPOS_CACHE_TTL_SECONDS);

	return repositories;
};

const fetchRepositoryReadme = async (owner, repo) => {
	const cacheKey = `github:readme:${String(owner || "").toLowerCase()}:${String(repo || "").toLowerCase()}`;
	const cachedReadme = await getCacheJson(cacheKey);

	if (cachedReadme) {
		return cachedReadme;
	}

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

	const readmePayload = {
		owner,
		repo,
		path: readmeMeta.path,
		url: readmeMeta.html_url,
		content
	};

	await setCacheJson(cacheKey, readmePayload, GITHUB_README_CACHE_TTL_SECONDS);

	return readmePayload;
};

export { fetchGithubProfile, fetchGithubRepositories, fetchRepositoryReadme };
