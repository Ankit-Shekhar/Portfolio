import { Project } from "../../../modules/projects/project.model.js";

const listProjects = async () => {
	const projects = await Project.find().sort({ featured: -1, createdAt: -1 }).select("title slug description technologies githubUrl liveUrl");
	return projects;
};

export { listProjects };
