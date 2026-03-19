import { Project } from "../modules/projects/project.model.js";
import { TimelineEvent } from "../modules/timeline/timeline.model.js";

const SAMPLE_PROJECTS = [
	{
		title: "AI Portfolio Operating System",
		slug: "ai-portfolio-os",
		description: "Interactive operating system style portfolio with AI assistant and timeline storytelling.",
		technologies: ["Node.js", "Express", "React", "MongoDB", "Redis", "ChromaDB"],
		githubUrl: "https://github.com/Ankit-Shekhar/ai-portfolio-os",
		architectureNotes: "DDD backend modules with integrated AI retrieval pipeline.",
		impactExplanation: "Demonstrates full stack and AI engineering capabilities.",
		featured: true
	},
	{
		title: "AroundU",
		slug: "aroundu",
		description: "Community and location focused application with modern backend architecture.",
		technologies: ["Node.js", "Express", "MongoDB"],
		githubUrl: "https://github.com/Ankit-Shekhar/aroundu",
		architectureNotes: "Modular services with scalable API boundaries.",
		impactExplanation: "Showcases product thinking and backend-first development.",
		featured: true
	}
];

const SAMPLE_TIMELINE_EVENTS = [
	{
		title: "Dream of Joining Air Force",
		description: "Early ambition that shaped discipline and long term focus.",
		yearRange: "2014-2018",
		animationScene: "airforce_dream",
		visualAssets: ["runway.jpg", "uniform.png"],
		sequence: 1,
		featured: true
	},
	{
		title: "Discovering Programming",
		description: "Shift from uncertainty to building solutions through code.",
		yearRange: "2019-2021",
		animationScene: "coding_discovery",
		visualAssets: ["terminal.png", "code_editor.jpg"],
		sequence: 2,
		featured: true
	}
];

const runSeedDataJob = async () => {
	let projectsSeeded = 0;
	let timelineEventsSeeded = 0;

	for (const sampleProject of SAMPLE_PROJECTS) {
		await Project.findOneAndUpdate(
			{ slug: sampleProject.slug },
			{ $set: sampleProject },
			{ upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
		);
		projectsSeeded += 1;
	}

	for (const sampleTimelineEvent of SAMPLE_TIMELINE_EVENTS) {
		await TimelineEvent.findOneAndUpdate(
			{ title: sampleTimelineEvent.title, yearRange: sampleTimelineEvent.yearRange },
			{ $set: sampleTimelineEvent },
			{ upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
		);
		timelineEventsSeeded += 1;
	}

	return {
		projectsSeeded,
		timelineEventsSeeded
	};
};

export { runSeedDataJob };