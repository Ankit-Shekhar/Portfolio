import { getChromaClient } from "./chromaClient.js";

const PROJECT_KNOWLEDGE_COLLECTION = "project_knowledge";

const getProjectKnowledgeCollection = async () => {
	const chromaClient = getChromaClient();

	const collection = await chromaClient.getOrCreateCollection({
		name: PROJECT_KNOWLEDGE_COLLECTION,
		metadata: {
			description: "Project and architecture grounded knowledge"
		}
	});

	return collection;
};

export { getProjectKnowledgeCollection };
