import mongoose from "mongoose";
import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { createSkill, getAllSkills, getSkillById, updateSkillById, deleteSkillById } from "./skill.service.js";
import { validateCreateSkillPayload, validateUpdateSkillPayload } from "./skill.validation.js";

const createSkillController = asyncHandler(async (req, res) => {
	const payload = validateCreateSkillPayload(req.body || {});
	const skill = await createSkill(payload);

	return res.status(201).json(new ApiResponse(201, "Skill created successfully", skill));
});

const getAllSkillsController = asyncHandler(async (req, res) => {
	const skills = await getAllSkills();

	return res.status(200).json(new ApiResponse(200, "Skills fetched successfully", skills));
});

const getSkillByIdController = asyncHandler(async (req, res) => {
	const { skillId } = req.params;

	if (!mongoose.isValidObjectId(skillId)) {
		throw new ApiError(400, "Invalid skill id");
	}

	const skill = await getSkillById(skillId);

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	return res.status(200).json(new ApiResponse(200, "Skill fetched successfully", skill));
});

const updateSkillByIdController = asyncHandler(async (req, res) => {
	const { skillId } = req.params;

	if (!mongoose.isValidObjectId(skillId)) {
		throw new ApiError(400, "Invalid skill id");
	}

	const updatePayload = validateUpdateSkillPayload(req.body || {});
	const updatedSkill = await updateSkillById(skillId, updatePayload);

	if (!updatedSkill) {
		throw new ApiError(404, "Skill not found");
	}

	return res.status(200).json(new ApiResponse(200, "Skill updated successfully", updatedSkill));
});

const deleteSkillByIdController = asyncHandler(async (req, res) => {
	const { skillId } = req.params;

	if (!mongoose.isValidObjectId(skillId)) {
		throw new ApiError(400, "Invalid skill id");
	}

	const deletedSkill = await deleteSkillById(skillId);

	if (!deletedSkill) {
		throw new ApiError(404, "Skill not found");
	}

	return res.status(200).json(new ApiResponse(200, "Skill deleted successfully", deletedSkill));
});

export {
	createSkillController,
	getAllSkillsController,
	getSkillByIdController,
	updateSkillByIdController,
	deleteSkillByIdController
};
