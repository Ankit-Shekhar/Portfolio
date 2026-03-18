import { chunkText } from "../ai/embeddings/chunker.js";
import { buildEmbeddableDocument } from "../ai/embeddings/embedder.js";
import { upsertKnowledgeDocuments } from "../ai/vector-db/vectorStore.js";
import { fetchRepositoriesForIndexing } from "../ai/github-indexer/repoFetcher.js";
import { parseRepositoryDocuments } from "../ai/github-indexer/readmeParser.js";

const runRepositoryIndexerJob = async (repositoryDocuments = []) => {
	let sourceRepositoryDocuments = Array.isArray(repositoryDocuments) ? repositoryDocuments : [];

	if (sourceRepositoryDocuments.length === 0) {
		const { repositoryDocuments: fetchedRepositoryDocuments } = await fetchRepositoriesForIndexing({
			username: process.env.GITHUB_USERNAME || "Ankit-Shekhar",
			maxRepositories: Number(process.env.GITHUB_INDEX_REPO_LIMIT || 5)
		});
		sourceRepositoryDocuments = fetchedRepositoryDocuments;
	}

	const parsedRepositoryDocuments = parseRepositoryDocuments(sourceRepositoryDocuments);

	if (parsedRepositoryDocuments.length === 0) {
		return {
			repositoriesIndexed: 0,
			knowledgeChunksIndexed: 0
		};
	}

	const knowledgeDocuments = [];

	for (const repoDoc of parsedRepositoryDocuments) {
		const repositoryId = repoDoc?.id || repoDoc?.name || "unknown_repo";
		const repositoryText = repoDoc?.content || "";

		const chunks = chunkText(repositoryText, { chunkSize: 900, overlap: 120 });

		for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
			const chunk = chunks[chunkIndex];
			const doc = buildEmbeddableDocument({
				idPrefix: `repo_${repositoryId}_${chunkIndex}`,
				text: chunk,
				metadata: {
					type: "repository",
					repositoryId,
					repositoryName: repoDoc?.name,
					source: repoDoc?.source || "github",
					chunkIndex
				}
			});

			if (doc) {
				knowledgeDocuments.push(doc);
			}
		}
	}

	const result = await upsertKnowledgeDocuments(knowledgeDocuments);

	return {
		repositoriesIndexed: parsedRepositoryDocuments.length,
		knowledgeChunksIndexed: result.upsertedCount
	};
};

export { runRepositoryIndexerJob };
