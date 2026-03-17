import mongoose from "mongoose";
import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import {
	createProject,
	getAllProjects,
	getProjectById,
	updateProjectById,
	deleteProjectById
} from "./project.service.js";
import { validateCreateProjectPayload, validateUpdateProjectPayload } from "./project.validation.js";

const createProjectController = asyncHandler(async (req, res) => {
	const {
		title,
		slug,
		description,
		technologies,
		githubUrl,
		liveUrl,
		architectureNotes,
		impactExplanation,
		featured
	} = validateCreateProjectPayload(req.body || {});

	const project = await createProject({
		title,
		slug,
		description,
		technologies,
		githubUrl,
		liveUrl,
		architectureNotes,
		impactExplanation,
		featured
	});

	return res.status(201).json(new ApiResponse(201, "Project created successfully", project));
});

const getAllProjectsController = asyncHandler(async (req, res) => {
	const projects = await getAllProjects();

	return res.status(200).json(new ApiResponse(200, "Projects fetched successfully", projects));
});

const getProjectByIdController = asyncHandler(async (req, res) => {
	const { projectId } = req.params;

	if (!mongoose.isValidObjectId(projectId)) {
		throw new ApiError(400, "Invalid project id");
	}

	const project = await getProjectById(projectId);

	if (!project) {
		throw new ApiError(404, "Project not found");
	}

	return res.status(200).json(new ApiResponse(200, "Project fetched successfully", project));
});

const updateProjectByIdController = asyncHandler(async (req, res) => {
	const { projectId } = req.params;

	if (!mongoose.isValidObjectId(projectId)) {
		throw new ApiError(400, "Invalid project id");
	}

	const updatePayload = validateUpdateProjectPayload(req.body || {});

	const updatedProject = await updateProjectById(projectId, updatePayload);

	if (!updatedProject) {
		throw new ApiError(404, "Project not found");
	}

	return res.status(200).json(new ApiResponse(200, "Project updated successfully", updatedProject));
});

const deleteProjectByIdController = asyncHandler(async (req, res) => {
	const { projectId } = req.params;

	if (!mongoose.isValidObjectId(projectId)) {
		throw new ApiError(400, "Invalid project id");
	}

	const deletedProject = await deleteProjectById(projectId);

	if (!deletedProject) {
		throw new ApiError(404, "Project not found");
	}

	return res.status(200).json(new ApiResponse(200, "Project deleted successfully", deletedProject));
});

export {
	createProjectController,
	getAllProjectsController,
	getProjectByIdController,
	updateProjectByIdController,
	deleteProjectByIdController
};
