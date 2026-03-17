import { vectorSearch } from "../../ai/agent/tools/vectorSearch.tool.js";
import { listProjects } from "../../ai/agent/tools/listProjects.tool.js";
import { runEmbeddingIndexJob } from "../../jobs/embedding.job.js";
import { runRepositoryIndexerJob } from "../../jobs/repoIndexer.job.js";
import { runSeedDataJob } from "../../jobs/seedData.job.js";

const askPortfolioAgent = async (query) => {
	let vectorMatches = [];

	try {
		vectorMatches = await vectorSearch(query, 4);
	} catch (error) {
		vectorMatches = [];
	}

	const projects = await listProjects();

	const groundedContext = vectorMatches.length > 0
		? vectorMatches.map((match, index) => `${index + 1}. ${match.document}`).join("\n")
		: projects.slice(0, 5).map((project, index) => `${index + 1}. ${project.title}: ${project.description}`).join("\n");

	const answer = vectorMatches.length > 0
		? `Grounded answer based on vector documents:\n${groundedContext}`
		: `Vector documents were not found for this query yet. Grounded answer from project database:\n${groundedContext}`;

	return {
		query,
		answer,
		sources: {
			vectorMatches,
			projectCount: projects.length,
			fallbackUsed: vectorMatches.length === 0
		}
	};
};

const indexPortfolioKnowledge = async (payload = {}) => {
	const repositoryDocuments = Array.isArray(payload.repositoryDocuments) ? payload.repositoryDocuments : [];
	const errors = [];
	let embeddingResult = {
		projectsIndexed: 0,
		timelineEventsIndexed: 0,
		knowledgeChunksIndexed: 0
	};
	let repositoryResult = {
		repositoriesIndexed: repositoryDocuments.length,
		knowledgeChunksIndexed: 0
	};

	try {
		embeddingResult = await runEmbeddingIndexJob();
	} catch (error) {
		errors.push({
			stage: "embedding-index",
			message: error?.message || "Failed to index embedding knowledge"
		});
	}

	try {
		repositoryResult = await runRepositoryIndexerJob(repositoryDocuments);
	} catch (error) {
		errors.push({
			stage: "repository-index",
			message: error?.message || "Failed to index repository documents"
		});
	}

	return {
		embeddingResult,
		repositoryResult,
		errors
	};
};

const seedPortfolioData = async () => {
	const result = await runSeedDataJob();
	return result;
};

export { askPortfolioAgent, indexPortfolioKnowledge, seedPortfolioData };
