import { Project } from "../modules/projects/project.model.js";
import { TimelineEvent } from "../modules/timeline/timeline.model.js";
import { chunkText } from "../ai/embeddings/chunker.js";
import { buildEmbeddableDocument } from "../ai/embeddings/embedder.js";
import { upsertKnowledgeDocuments } from "../ai/vector-db/vectorStore.js";

const runEmbeddingIndexJob = async () => {
	const projects = await Project.find().lean();
	const timelineEvents = await TimelineEvent.find().lean();

	const knowledgeDocuments = [];

	for (const project of projects) {
		const projectText = [
			`Project Title: ${project.title || ""}`,
			`Description: ${project.description || ""}`,
			`Technologies: ${(project.technologies || []).join(", ")}`,
			`Architecture Notes: ${project.architectureNotes || ""}`,
			`Impact: ${project.impactExplanation || ""}`,
			`GitHub: ${project.githubUrl || ""}`,
			`Live URL: ${project.liveUrl || ""}`
		].join("\n");

		const chunks = chunkText(projectText, { chunkSize: 900, overlap: 120 });

		for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
			const chunk = chunks[chunkIndex];
			const doc = buildEmbeddableDocument({
				idPrefix: `project_${project._id}_${chunkIndex}`,
				text: chunk,
				metadata: {
					type: "project",
					projectId: String(project._id),
					slug: project.slug,
					title: project.title,
					chunkIndex
				}
			});

			if (doc) {
				knowledgeDocuments.push(doc);
			}
		}
	}

	for (const event of timelineEvents) {
		const timelineText = [
			`Timeline Event: ${event.title || ""}`,
			`Description: ${event.description || ""}`,
			`Year Range: ${event.yearRange || ""}`,
			`Scene: ${event.animationScene || ""}`,
			`Visual Assets: ${(event.visualAssets || []).join(", ")}`
		].join("\n");

		const chunks = chunkText(timelineText, { chunkSize: 900, overlap: 120 });

		for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
			const chunk = chunks[chunkIndex];
			const doc = buildEmbeddableDocument({
				idPrefix: `timeline_${event._id}_${chunkIndex}`,
				text: chunk,
				metadata: {
					type: "timeline",
					timelineEventId: String(event._id),
					title: event.title,
					yearRange: event.yearRange,
					sequence: event.sequence,
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
		projectsIndexed: projects.length,
		timelineEventsIndexed: timelineEvents.length,
		knowledgeChunksIndexed: result.upsertedCount
	};
};

export { runEmbeddingIndexJob };
