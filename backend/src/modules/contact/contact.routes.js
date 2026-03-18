import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import { createRateLimiter } from "../../core/middlewares/rateLimit.middleware.js";
import {
	createContactMessageController,
	getAllContactMessagesController,
	getContactMessageByIdController,
	updateContactMessageByIdController,
	deleteContactMessageByIdController
} from "./contact.controller.js";

const router = Router();
const contactSubmitRateLimiter = createRateLimiter({ windowMs: 60_000, max: 10, keyPrefix: "contact-submit" });
const contactAdminRateLimiter = createRateLimiter({ windowMs: 60_000, max: 40, keyPrefix: "contact-admin" });

router.route("/").post(contactSubmitRateLimiter, createContactMessageController).get(requireAdminApiKey, contactAdminRateLimiter, getAllContactMessagesController);
router
	.route("/:messageId")
	.get(getContactMessageByIdController)
	.patch(requireAdminApiKey, contactAdminRateLimiter, updateContactMessageByIdController)
	.delete(requireAdminApiKey, contactAdminRateLimiter, deleteContactMessageByIdController);

export default router;
