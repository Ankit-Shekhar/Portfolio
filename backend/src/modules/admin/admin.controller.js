import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

const verifyAdminModeController = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, "Admin key verified successfully", { adminMode: true }));
});

export { verifyAdminModeController };