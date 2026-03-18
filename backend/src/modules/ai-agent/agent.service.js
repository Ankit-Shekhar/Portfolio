import { runAgentWorkflow } from "../../ai/agent/agentController.js";
import { generateModelResponse } from "../../ai/agent/modelProvider.js";
import { logPipelineEvent, getRecentPipelineEvents } from "../../ai/pipeline/pipelineLogger.js";
import { PIPELINE_EVENTS } from "../../ai/pipeline/pipelineEvents.js";
import { runEmbeddingIndexJob } from "../../jobs/embedding.job.js";
import { runRepositoryIndexerJob } from "../../jobs/repoIndexer.job.js";
import { runSeedDataJob } from "../../jobs/seedData.job.js";

const githubIndexStatus = {
	isRunning: false,
	lastStartedAt: null,
	lastCompletedAt: null,
	lastRun: null,
	lastError: null
};

const MAX_CONTEXT_CHARS = Number(process.env.AI_MAX_CONTEXT_CHARS || 3500);
const MAX_VECTOR_MATCHES = Number(process.env.AI_MAX_VECTOR_MATCHES || 4);
const MAX_VECTOR_DISTANCE = Number(process.env.AI_MAX_VECTOR_DISTANCE || 2.2);

const selectRelevantVectorMatches = (vectorMatches = []) => {
	if (!Array.isArray(vectorMatches)) {
		return [];
	}

	const uniqueDocuments = new Set();

	return vectorMatches
		.filter((match) => {
			const distance = Number(match?.distance);
			const hasDocument = Boolean(String(match?.document || "").trim());
			if (!hasDocument) {
				return false;
			}
			if (Number.isNaN(distance)) {
				return true;
			}
			return distance <= MAX_VECTOR_DISTANCE;
		})
		.sort((a, b) => Number(a?.distance || 0) - Number(b?.distance || 0))
		.filter((match) => {
			const normalizedDocument = String(match?.document || "").trim().toLowerCase();
			if (uniqueDocuments.has(normalizedDocument)) {
				return false;
			}
			uniqueDocuments.add(normalizedDocument);
			return true;
		})
		.slice(0, MAX_VECTOR_MATCHES);
};

const buildGroundedContext = ({ relevantMatches = [], projects = [] }) => {
	const contextLines = [];
	let currentLength = 0;

	const addLine = (line) => {
		if (!line) {
			return;
		}

		const normalizedLine = String(line).replace(/\s+/g, " ").trim();
		if (!normalizedLine) {
			return;
		}

		if (currentLength + normalizedLine.length > MAX_CONTEXT_CHARS) {
			return;
		}

		contextLines.push(normalizedLine);
		currentLength += normalizedLine.length;
	};

	if (relevantMatches.length > 0) {
		relevantMatches.forEach((match, index) => {
			addLine(`${index + 1}. ${match.document}`);
		});
	} else {
		projects.slice(0, 5).forEach((project, index) => {
			addLine(`${index + 1}. ${project.title}: ${project.description}`);
		});
	}

	return contextLines.join("\n");
};

const askPortfolioAgent = async (query, options = {}) => {
	const requestId = options.requestId || null;
	const startTime = Date.now();
	try {
		const { selectedTool, toolResult, vectorMatches, projects } = await runAgentWorkflow(query, { requestId });
		const relevantMatches = selectRelevantVectorMatches(vectorMatches);

		const groundedContext = buildGroundedContext({
			relevantMatches,
			projects
		});

		const { result: modelResult, errors: modelErrors } = await generateModelResponse({
			query,
			context: groundedContext
		});

		const fallbackAnswer = relevantMatches.length > 0
			? `Grounded answer based on vector documents:\n${groundedContext}`
			: `Vector documents were not found for this query yet. Grounded answer from project database:\n${groundedContext}`;

		const answer = modelResult?.text || fallbackAnswer;

		await logPipelineEvent(PIPELINE_EVENTS.RESPONSE_GENERATED, {
			query,
			requestId,
			selectedTool,
			modelProvider: modelResult?.provider || "none",
			modelName: modelResult?.model || null,
			projectCount: projects.length,
			vectorMatchCount: vectorMatches.length,
			relevantVectorMatchCount: relevantMatches.length,
			fallbackUsed: relevantMatches.length === 0,
			durationMs: Date.now() - startTime
		});

		return {
			query,
			answer,
			sources: {
				selectedTool,
				toolResult,
				vectorMatches: relevantMatches,
				modelProvider: modelResult?.provider || null,
				modelName: modelResult?.model || null,
				modelErrors,
				contextChars: groundedContext.length,
				projectCount: projects.length,
				fallbackUsed: relevantMatches.length === 0
			}
		};
	} catch (error) {
		await logPipelineEvent(PIPELINE_EVENTS.PIPELINE_ERROR, {
			stage: "ask-portfolio-agent",
			requestId,
			durationMs: Date.now() - startTime,
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

const getPipelineDiagnostics = async (limit = 100) => {
	const events = await getRecentPipelineEvents(limit);
	const eventCounts = {};
	const errorEvents = [];
	const responseEvents = [];

	for (const event of events) {
		const eventType = event?.eventType || "unknown";
		eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;

		if (eventType === PIPELINE_EVENTS.PIPELINE_ERROR) {
			errorEvents.push(event);
		}

		if (eventType === PIPELINE_EVENTS.RESPONSE_GENERATED) {
			responseEvents.push(event);
		}
	}

	const averageResponseDurationMs = responseEvents.length > 0
		? Math.round(
			responseEvents.reduce((sum, event) => sum + Number(event?.payload?.durationMs || 0), 0) / responseEvents.length
		)
		: 0;

	return {
		totalEvents: events.length,
		eventCounts,
		errorCount: errorEvents.length,
		recentErrors: errorEvents.slice(-5),
		responseCount: responseEvents.length,
		averageResponseDurationMs
	};
};

const runGithubAutoIndex = async ({ username, maxRepositories } = {}) => {
	if (githubIndexStatus.isRunning) {
		return {
			accepted: false,
			message: "GitHub indexing is already in progress",
			status: githubIndexStatus
		};
	}

	githubIndexStatus.isRunning = true;
	githubIndexStatus.lastStartedAt = new Date().toISOString();
	githubIndexStatus.lastError = null;

	await logPipelineEvent(PIPELINE_EVENTS.INDEX_STARTED, {
		stage: "github-auto-index",
		username,
		maxRepositories
	});

	try {
		const repositoryResult = await runRepositoryIndexerJob([], {
			username,
			maxRepositories
		});

		githubIndexStatus.lastCompletedAt = new Date().toISOString();
		githubIndexStatus.lastRun = {
			repositoryResult,
			username,
			maxRepositories
		};

		await logPipelineEvent(PIPELINE_EVENTS.INDEX_COMPLETED, {
			stage: "github-auto-index",
			repositoryResult,
			username,
			maxRepositories
		});

		return {
			accepted: true,
			message: "GitHub indexing completed successfully",
			repositoryResult,
			status: githubIndexStatus
		};
	} catch (error) {
		githubIndexStatus.lastCompletedAt = new Date().toISOString();
		githubIndexStatus.lastError = error?.message || "GitHub indexing failed";

		await logPipelineEvent(PIPELINE_EVENTS.PIPELINE_ERROR, {
			stage: "github-auto-index",
			message: githubIndexStatus.lastError
		});

		throw error;
	} finally {
		githubIndexStatus.isRunning = false;
	}
};

const getGithubIndexStatus = async () => {
	return githubIndexStatus;
};

export {
	askPortfolioAgent,
	indexPortfolioKnowledge,
	seedPortfolioData,
	getPipelineEvents,
	getPipelineDiagnostics,
	runGithubAutoIndex,
	getGithubIndexStatus
};
