import { runAgentWorkflow } from "../../ai/agent/agentController.js";
import { generateModelResponse } from "../../ai/agent/modelProvider.js";
import { logPipelineEvent, getRecentPipelineEvents } from "../../ai/pipeline/pipelineLogger.js";
import { PIPELINE_EVENTS } from "../../ai/pipeline/pipelineEvents.js";
import { runEmbeddingIndexJob } from "../../jobs/embedding.job.js";
import { runRepositoryIndexerJob } from "../../jobs/repoIndexer.job.js";
import { runSeedDataJob } from "../../jobs/seedData.job.js";

const askPortfolioAgent = async (query) => {
	try {
		const { selectedTool, toolResult, vectorMatches, projects } = await runAgentWorkflow(query);

		const groundedContext = vectorMatches.length > 0
			? vectorMatches.map((match, index) => `${index + 1}. ${match.document}`).join("\n")
			: projects.slice(0, 5).map((project, index) => `${index + 1}. ${project.title}: ${project.description}`).join("\n");

		const { result: modelResult, errors: modelErrors } = await generateModelResponse({
			query,
			context: groundedContext
		});

		const fallbackAnswer = vectorMatches.length > 0
			? `Grounded answer based on vector documents:\n${groundedContext}`
			: `Vector documents were not found for this query yet. Grounded answer from project database:\n${groundedContext}`;

		const answer = modelResult?.text || fallbackAnswer;

		await logPipelineEvent(PIPELINE_EVENTS.RESPONSE_GENERATED, {
			query,
			selectedTool,
			modelProvider: modelResult?.provider || "none",
			modelName: modelResult?.model || null,
			projectCount: projects.length,
			vectorMatchCount: vectorMatches.length,
			fallbackUsed: vectorMatches.length === 0
		});

		return {
			query,
			answer,
			sources: {
				selectedTool,
				toolResult,
				vectorMatches,
				modelProvider: modelResult?.provider || null,
				modelName: modelResult?.model || null,
				modelErrors,
				projectCount: projects.length,
				fallbackUsed: vectorMatches.length === 0
			}
		};
	} catch (error) {
		await logPipelineEvent(PIPELINE_EVENTS.PIPELINE_ERROR, {
			stage: "ask-portfolio-agent",
			message: error?.message || "Unknown error"
		});
		throw error;
	}
};

const indexPortfolioKnowledge = async (payload = {}) => {
	const repositoryDocuments = Array.isArray(payload.repositoryDocuments) ? payload.repositoryDocuments : [];
	await logPipelineEvent(PIPELINE_EVENTS.INDEX_STARTED, {
		repositoryCount: repositoryDocuments.length
	});
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
		await logPipelineEvent(PIPELINE_EVENTS.INDEX_STAGE_COMPLETED, {
			stage: "embedding-index",
			result: embeddingResult
		});
	} catch (error) {
		errors.push({
			stage: "embedding-index",
			message: error?.message || "Failed to index embedding knowledge"
		});
		await logPipelineEvent(PIPELINE_EVENTS.PIPELINE_ERROR, {
			stage: "embedding-index",
			message: error?.message || "Failed to index embedding knowledge"
		});
	}

	try {
		repositoryResult = await runRepositoryIndexerJob(repositoryDocuments);
		await logPipelineEvent(PIPELINE_EVENTS.INDEX_STAGE_COMPLETED, {
			stage: "repository-index",
			result: repositoryResult
		});
	} catch (error) {
		errors.push({
			stage: "repository-index",
			message: error?.message || "Failed to index repository documents"
		});
		await logPipelineEvent(PIPELINE_EVENTS.PIPELINE_ERROR, {
			stage: "repository-index",
			message: error?.message || "Failed to index repository documents"
		});
	}

	await logPipelineEvent(PIPELINE_EVENTS.INDEX_COMPLETED, {
		embeddingResult,
		repositoryResult,
		errorCount: errors.length
	});

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

const getPipelineEvents = async (limit = 25) => {
	const events = await getRecentPipelineEvents(limit);
	return events;
};

export { askPortfolioAgent, indexPortfolioKnowledge, seedPortfolioData, getPipelineEvents };
