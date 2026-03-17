import { ApiError } from "../utils/ApiError.js";

const errorHandler = (error, req, res, next) => {
	const statusCode = error instanceof ApiError ? error.statusCode : 500;
	const message = error?.message || "Internal Server Error";

	return res.status(statusCode).json({
		success: false,
		message,
		errors: error?.errors || [],
		stack: process.env.NODE_ENV === "production" ? undefined : error?.stack
	});
};

export { errorHandler };
