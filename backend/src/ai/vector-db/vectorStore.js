import { getChromaClient } from "./chromaClient.js";
import { createDeterministicEmbedding } from "../embeddings/embedder.js";

const PROJECT_KNOWLEDGE_COLLECTION = "project_knowledge";

const getProjectKnowledgeCollection = async () => {
	const chromaClient = getChromaClient();

	return chromaClient.getOrCreateCollection({
		name: PROJECT_KNOWLEDGE_COLLECTION,
		metadata: {
			description: "Project and architecture grounded knowledge"
		}
	});
};

const upsertKnowledgeDocuments = async (documents = []) => {
	if (!Array.isArray(documents) || documents.length === 0) {
		return { upsertedCount: 0 };
	}

	const collection = await getProjectKnowledgeCollection();

	const ids = documents.map((entry) => entry.id);
	const docs = documents.map((entry) => entry.document);
	const metadatas = documents.map((entry) => entry.metadata || {});
	const embeddings = docs.map((document) => createDeterministicEmbedding(document));

	await collection.upsert({
		ids,
		documents: docs,
		metadatas,
		embeddings
	});

	return { upsertedCount: documents.length };
};

const searchKnowledgeDocuments = async (queryText, nResults = 4) => {
	const collection = await getProjectKnowledgeCollection();
	const queryEmbedding = createDeterministicEmbedding(queryText || "");

	const result = await collection.query({
		queryEmbeddings: [queryEmbedding],
		nResults
	});

	const documents = result?.documents?.[0] || [];
	const metadatas = result?.metadatas?.[0] || [];
	const distances = result?.distances?.[0] || [];

	return documents.map((document, index) => ({
		document,
		metadata: metadatas[index] || {},
		distance: distances[index]
	}));
};

export { getProjectKnowledgeCollection, upsertKnowledgeDocuments, searchKnowledgeDocuments };
