import { Router } from "express";
import { requireAdminApiKey } from "../../core/middlewares/adminAuth.middleware.js";
import {
	createContactMessageController,
	getAllContactMessagesController,
	getContactMessageByIdController,
	updateContactMessageByIdController,
	deleteContactMessageByIdController
} from "./contact.controller.js";

const router = Router();

router.route("/").post(createContactMessageController).get(requireAdminApiKey, getAllContactMessagesController);
router
	.route("/:messageId")
	.get(getContactMessageByIdController)
	.patch(requireAdminApiKey, updateContactMessageByIdController)
	.delete(requireAdminApiKey, deleteContactMessageByIdController);

export default router;
