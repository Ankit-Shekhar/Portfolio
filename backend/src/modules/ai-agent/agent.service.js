import { vectorSearch } from "../../ai/agent/tools/vectorSearch.tool.js";
import { listProjects } from "../../ai/agent/tools/listProjects.tool.js";

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

export { askPortfolioAgent };
