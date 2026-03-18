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

const verifyTurnstileForContactSubmit = async (req) => {
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
	const isTurnstileRequired = String(process.env.TURNSTILE_REQUIRED || "false").toLowerCase() === "true";

	if (!turnstileSecretKey) {
		return;
	}

	const tokenFromBody =
		typeof req.body?.turnstileToken === "string"
			? req.body.turnstileToken
			: typeof req.body?.cfTurnstileResponse === "string"
				? req.body.cfTurnstileResponse
				: "";

	const token = tokenFromBody.trim();

	if (!token) {
		if (isTurnstileRequired) {
			throw new ApiError(400, "Turnstile token is required");
		}

		return;
	}

	const remoteIp = (req.ip || req.socket?.remoteAddress || "").trim();
	const formData = new URLSearchParams();

	formData.append("secret", turnstileSecretKey);
	formData.append("response", token);

	if (remoteIp) {
		formData.append("remoteip", remoteIp);
	}

	let verificationResponse;

	try {
		verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded"
			},
			body: formData.toString()
		});
	} catch {
		throw new ApiError(503, "Turnstile verification service is unavailable");
	}

	if (!verificationResponse.ok) {
		throw new ApiError(503, "Turnstile verification failed due to upstream error");
	}

	const verificationPayload = await verificationResponse.json();

	if (!verificationPayload?.success) {
		throw new ApiError(400, "Turnstile verification failed");
	}
};

const createContactMessageController = asyncHandler(async (req, res) => {
	await verifyTurnstileForContactSubmit(req);
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
