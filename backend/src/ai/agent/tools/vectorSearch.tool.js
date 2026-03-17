import { getProjectKnowledgeCollection } from "../../vector-db/vectorStore.js";

const vectorSearch = async (queryText, nResults = 3) => {
	const collection = await getProjectKnowledgeCollection();

	const result = await collection.query({
		queryTexts: [queryText],
		nResults
	});

	const documents = result?.documents?.[0] || [];
	const metadatas = result?.metadatas?.[0] || [];
	const distances = result?.distances?.[0] || [];

	const matches = documents.map((document, index) => ({
		document,
		metadata: metadatas[index] || {},
		distance: distances[index]
	}));

	return matches;
};

export { vectorSearch };
