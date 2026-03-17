import { Router } from "express";
import {
	createTimelineEventController,
	getAllTimelineEventsController,
	getTimelineEventByIdController,
	updateTimelineEventByIdController,
	deleteTimelineEventByIdController
} from "./timeline.controller.js";

const router = Router();

router.route("/").post(createTimelineEventController).get(getAllTimelineEventsController);
router.route("/:timelineEventId").get(getTimelineEventByIdController).patch(updateTimelineEventByIdController).delete(deleteTimelineEventByIdController);

export default router;
