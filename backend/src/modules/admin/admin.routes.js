import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import { createRateLimiter } from "../../core/middlewares/rateLimit.middleware.js";
import { verifyAdminModeController } from "./admin.controller.js";

const router = Router();
const adminVerifyRateLimiter = createRateLimiter({ windowMs: 60_000, max: 20, keyPrefix: "admin-verify" });

router.get("/verify", requireAdminApiKey, adminVerifyRateLimiter, verifyAdminModeController);

export default router;