import { getChromaClient } from "./chromaClient.js";

const PROJECT_KNOWLEDGE_COLLECTION = "project_knowledge";
const DEFAULT_CHROMA_TENANT = "default_tenant";
const DEFAULT_CHROMA_DATABASE = "default_database";

const getProjectKnowledgeCollection = async () => {
	const chromaClient = getChromaClient();
	let collection;

	try {
		collection = await chromaClient.getOrCreateCollection({
			name: PROJECT_KNOWLEDGE_COLLECTION,
			metadata: {
				description: "Project and architecture grounded knowledge"
			}
		});
	} catch (error) {
		//if tenant/database values are not valid in current chroma server, fallback to defaults and retry once
		if (error?.message?.toLowerCase()?.includes("could not be found")) {
			chromaClient.tenant = process.env.CHROMA_TENANT_FALLBACK || DEFAULT_CHROMA_TENANT;
			chromaClient.database = process.env.CHROMA_DATABASE_FALLBACK || DEFAULT_CHROMA_DATABASE;

			collection = await chromaClient.getOrCreateCollection({
				name: PROJECT_KNOWLEDGE_COLLECTION,
				metadata: {
					description: "Project and architecture grounded knowledge"
				}
			});
		} else {
			throw error;
		}
	}

	return collection;
};

const upsertKnowledgeDocuments = async (documents = []) => {
	if (!Array.isArray(documents) || documents.length === 0) {
		return { upsertedCount: 0 };
	}

	const collection = await getProjectKnowledgeCollection();

	const ids = documents.map((entry) => entry.id);
	const docs = documents.map((entry) => entry.document);
	const metadatas = documents.map((entry) => entry.metadata || {});

	await collection.upsert({
		ids,
		documents: docs,
		metadatas
	});

	return { upsertedCount: documents.length };
};

const searchKnowledgeDocuments = async (queryText, nResults = 4) => {
	const collection = await getProjectKnowledgeCollection();

	const result = await collection.query({
		queryTexts: [queryText],
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
