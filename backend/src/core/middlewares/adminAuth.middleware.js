import { ApiError } from "../utils/ApiError.js";

const requireAdminApiKey = (req, res, next) => {
	const configuredAdminKey = process.env.ADMIN_API_KEY;

	if (!configuredAdminKey) {
		throw new ApiError(500, "ADMIN_API_KEY is not configured on the server");
	}

	const receivedAdminKey = req.header("x-admin-key") || "";

	if (!receivedAdminKey || receivedAdminKey !== configuredAdminKey) {
		throw new ApiError(401, "Unauthorized admin request");
	}

	next();
};

export { requireAdminApiKey };