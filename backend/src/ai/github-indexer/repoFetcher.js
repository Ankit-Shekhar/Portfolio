import { fetchGithubRepositories, fetchRepositoryReadme } from "../../modules/github/github.service.js";

const fetchRepositoriesForIndexing = async (options = {}) => {
	const username = options.username || process.env.GITHUB_USERNAME || "Ankit-Shekhar";
	const maxRepositories = Math.min(Math.max(Number(options.maxRepositories) || 5, 1), 20);

	const repositories = await fetchGithubRepositories(username);
	const selectedRepositories = Array.isArray(repositories) ? repositories.slice(0, maxRepositories) : [];

	const repositoryDocuments = [];

	for (const repository of selectedRepositories) {
		try {
			const readme = await fetchRepositoryReadme(username, repository.name);
			repositoryDocuments.push({
				id: `repo_${repository.name}`,
				name: repository.name,
				source: "github",
				url: repository.html_url,
				content: readme.content
			});
		} catch {
			//skip repositories that do not have accessible README content
		}
	}

	return {
		username,
		repositoryDocuments
	};
};

export { fetchRepositoriesForIndexing };
