import { Project } from "./project.model.js";

const createProject = async (payload) => {
	const project = await Project.create(payload);
	return project;
};

const getAllProjects = async () => {
	const projects = await Project.find().sort({ createdAt: -1 });
	return projects;
};

const getProjectById = async (projectId) => {
	const project = await Project.findById(projectId);
	return project;
};

const updateProjectById = async (projectId, payload) => {
	const updatedProject = await Project.findByIdAndUpdate(
		projectId,
		{
			$set: payload
		},
		{
			returnDocument: "after",
			runValidators: true
		}
	);

	return updatedProject;
};

const deleteProjectById = async (projectId) => {
	const deletedProject = await Project.findByIdAndDelete(projectId);
	return deletedProject;
};

export {
	createProject,
	getAllProjects,
	getProjectById,
	updateProjectById,
	deleteProjectById
};
