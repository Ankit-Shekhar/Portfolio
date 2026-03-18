import { selectToolForQuery, TOOL_TYPES } from "./toolSelector.js";
import { vectorSearch } from "./tools/vectorSearch.tool.js";
import { listProjects } from "./tools/listProjects.tool.js";
import { readFileContext } from "./tools/readFile.tool.js";
import { githubFetch } from "./tools/githubFetch.tool.js";
import { logPipelineEvent } from "../pipeline/pipelineLogger.js";
import { PIPELINE_EVENTS } from "../pipeline/pipelineEvents.js";

const runAgentWorkflow = async (query) => {
	const selectedTool = selectToolForQuery(query);
	let vectorMatches = [];
	let toolResult = null;

	await logPipelineEvent(PIPELINE_EVENTS.QUERY_RECEIVED, {
		query
	});

	await logPipelineEvent(PIPELINE_EVENTS.TOOL_SELECTED, {
		query,
		selectedTool
	});

	if (selectedTool === TOOL_TYPES.VECTOR_SEARCH) {
		toolResult = await vectorSearch(query, 4);
		vectorMatches = Array.isArray(toolResult) ? toolResult : [];
		await logPipelineEvent(PIPELINE_EVENTS.TOOL_EXECUTED, {
			selectedTool,
			resultCount: vectorMatches.length
		});
	}

	if (selectedTool === TOOL_TYPES.LIST_PROJECTS) {
		const projects = await listProjects();
		toolResult = projects;
		await logPipelineEvent(PIPELINE_EVENTS.TOOL_EXECUTED, {
			selectedTool,
			resultCount: projects.length
		});
	}

	if (selectedTool === TOOL_TYPES.READ_FILE) {
		toolResult = await readFileContext(query, 5);
		await logPipelineEvent(PIPELINE_EVENTS.TOOL_EXECUTED, {
			selectedTool,
			resultCount: Array.isArray(toolResult) ? toolResult.length : 0
		});
	}

	if (selectedTool === TOOL_TYPES.GITHUB_FETCH) {
		toolResult = await githubFetch(query);
		await logPipelineEvent(PIPELINE_EVENTS.TOOL_EXECUTED, {
			selectedTool,
			repositoryCount: Array.isArray(toolResult?.repositories) ? toolResult.repositories.length : 0
		});
	}

	if (vectorMatches.length === 0) {
		try {
			vectorMatches = await vectorSearch(query, 4);
		} catch {
			vectorMatches = [];
		}
	}

	await logPipelineEvent(PIPELINE_EVENTS.VECTOR_RETRIEVED, {
		query,
		matchCount: vectorMatches.length
	});

	const projects = await listProjects();

	return {
		selectedTool,
		toolResult,
		vectorMatches,
		projects
	};
};

export { runAgentWorkflow };
