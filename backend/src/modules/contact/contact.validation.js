import { ApiError } from "../../core/utils/ApiError.js";

const sanitizeContactPayload = (payload = {}) => {
	const sanitized = {
		name: typeof payload.name === "string" ? payload.name.trim() : payload.name,
		email: typeof payload.email === "string" ? payload.email.trim().toLowerCase() : payload.email,
		message: typeof payload.message === "string" ? payload.message.trim() : payload.message,
		status: typeof payload.status === "string" ? payload.status.trim().toLowerCase() : payload.status
	};

	return sanitized;
};

const validateCreateContactPayload = (payload = {}) => {
	const sanitized = sanitizeContactPayload(payload);

	if (!sanitized.name || !sanitized.email || !sanitized.message) {
		throw new ApiError(400, "name, email and message are required");
	}

	if (!sanitized.email.includes("@")) {
		throw new ApiError(400, "A valid email is required");
	}

	return sanitized;
};

const validateUpdateContactPayload = (payload = {}) => {
	const sanitized = sanitizeContactPayload(payload);
	const allowedStatuses = ["new", "read", "resolved"];

	if (!sanitized.status || !allowedStatuses.includes(sanitized.status)) {
		throw new ApiError(400, "status must be one of: new, read, resolved");
	}

	return { status: sanitized.status };
};

export { validateCreateContactPayload, validateUpdateContactPayload };
