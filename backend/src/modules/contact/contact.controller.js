import mongoose from "mongoose";
import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import {
	createContactMessage,
	getAllContactMessages,
	getContactMessageById,
	updateContactMessageById,
	deleteContactMessageById
} from "./contact.service.js";
import { validateCreateContactPayload, validateUpdateContactPayload } from "./contact.validation.js";

const createContactMessageController = asyncHandler(async (req, res) => {
	const payload = validateCreateContactPayload(req.body || {});
	const createdMessage = await createContactMessage(payload);

	return res.status(201).json(new ApiResponse(201, "Contact message submitted successfully", createdMessage));
});

const getAllContactMessagesController = asyncHandler(async (req, res) => {
	const messages = await getAllContactMessages();

	return res.status(200).json(new ApiResponse(200, "Contact messages fetched successfully", messages));
});

const getContactMessageByIdController = asyncHandler(async (req, res) => {
	const { messageId } = req.params;

	if (!mongoose.isValidObjectId(messageId)) {
		throw new ApiError(400, "Invalid contact message id");
	}

	const message = await getContactMessageById(messageId);

	if (!message) {
		throw new ApiError(404, "Contact message not found");
	}

	return res.status(200).json(new ApiResponse(200, "Contact message fetched successfully", message));
});

const updateContactMessageByIdController = asyncHandler(async (req, res) => {
	const { messageId } = req.params;

	if (!mongoose.isValidObjectId(messageId)) {
		throw new ApiError(400, "Invalid contact message id");
	}

	const payload = validateUpdateContactPayload(req.body || {});
	const updatedMessage = await updateContactMessageById(messageId, payload);

	if (!updatedMessage) {
		throw new ApiError(404, "Contact message not found");
	}

	return res.status(200).json(new ApiResponse(200, "Contact message updated successfully", updatedMessage));
});

const deleteContactMessageByIdController = asyncHandler(async (req, res) => {
	const { messageId } = req.params;

	if (!mongoose.isValidObjectId(messageId)) {
		throw new ApiError(400, "Invalid contact message id");
	}

	const deletedMessage = await deleteContactMessageById(messageId);

	if (!deletedMessage) {
		throw new ApiError(404, "Contact message not found");
	}

	return res.status(200).json(new ApiResponse(200, "Contact message deleted successfully", deletedMessage));
});

export {
	createContactMessageController,
	getAllContactMessagesController,
	getContactMessageByIdController,
	updateContactMessageByIdController,
	deleteContactMessageByIdController
};
