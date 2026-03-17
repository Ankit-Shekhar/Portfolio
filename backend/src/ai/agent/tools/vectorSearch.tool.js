import { searchKnowledgeDocuments } from "../../vector-db/vectorStore.js";

const vectorSearch = async (queryText, nResults = 3) => {
	const matches = await searchKnowledgeDocuments(queryText, nResults);
	return matches;
};

export { vectorSearch };
