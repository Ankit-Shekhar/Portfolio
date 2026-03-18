import { fetchGithubRepositories, fetchRepositoryReadme } from "../../../modules/github/github.service.js";

const githubFetch = async (query) => {
	const username = process.env.GITHUB_USERNAME || "Ankit-Shekhar";
	const loweredQuery = String(query || "").toLowerCase();

	const repositories = await fetchGithubRepositories(username);

	if (!Array.isArray(repositories) || repositories.length === 0) {
		return {
			username,
			repositories: [],
			readme: null
		};
	}

	const matchedRepository = repositories.find((repository) => {
		const name = String(repository?.name || "").toLowerCase();
		const description = String(repository?.description || "").toLowerCase();
		return loweredQuery.includes(name) || (description && loweredQuery.includes(description));
	});

	const repositoryForReadme = matchedRepository || repositories[0];
	let readme = null;

	try {
		readme = await fetchRepositoryReadme(username, repositoryForReadme.name);
	} catch {
		readme = null;
	}

	return {
		username,
		repositories: repositories.slice(0, 5).map((repository) => ({
			name: repository.name,
			description: repository.description,
			url: repository.html_url,
			language: repository.language,
			updatedAt: repository.updated_at
		})),
		readme: readme
			? {
				repo: readme.repo,
				url: readme.url,
				excerpt: String(readme.content || "").slice(0, 800)
			}
			: null
	};
};

export { githubFetch };
