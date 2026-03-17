import mongoose from "mongoose";
import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";
import {
	createTimelineEvent,
	getAllTimelineEvents,
	getTimelineEventById,
	updateTimelineEventById,
	deleteTimelineEventById
} from "./timeline.service.js";

const createTimelineEventController = asyncHandler(async (req, res) => {
	const {
		title,
		description,
		yearRange,
		animationScene,
		visualAssets,
		sequence,
		featured
	} = req.body;

	if (!title || !description || !yearRange) {
		throw new ApiError(400, "title, description and yearRange are required");
	}

	const timelineEvent = await createTimelineEvent({
		title,
		description,
		yearRange,
		animationScene,
		visualAssets,
		sequence,
		featured
	});

	return res.status(201).json(new ApiResponse(201, "Timeline event created successfully", timelineEvent));
});

const getAllTimelineEventsController = asyncHandler(async (req, res) => {
	const timelineEvents = await getAllTimelineEvents();

	return res.status(200).json(new ApiResponse(200, "Timeline events fetched successfully", timelineEvents));
});

const getTimelineEventByIdController = asyncHandler(async (req, res) => {
	const { timelineEventId } = req.params;

	if (!mongoose.isValidObjectId(timelineEventId)) {
		throw new ApiError(400, "Invalid timeline event id");
	}

	const timelineEvent = await getTimelineEventById(timelineEventId);

	if (!timelineEvent) {
		throw new ApiError(404, "Timeline event not found");
	}

	return res.status(200).json(new ApiResponse(200, "Timeline event fetched successfully", timelineEvent));
});

const updateTimelineEventByIdController = asyncHandler(async (req, res) => {
	const { timelineEventId } = req.params;

	if (!mongoose.isValidObjectId(timelineEventId)) {
		throw new ApiError(400, "Invalid timeline event id");
	}

	const updatedTimelineEvent = await updateTimelineEventById(timelineEventId, req.body);

	if (!updatedTimelineEvent) {
		throw new ApiError(404, "Timeline event not found");
	}

	return res.status(200).json(new ApiResponse(200, "Timeline event updated successfully", updatedTimelineEvent));
});

const deleteTimelineEventByIdController = asyncHandler(async (req, res) => {
	const { timelineEventId } = req.params;

	if (!mongoose.isValidObjectId(timelineEventId)) {
		throw new ApiError(400, "Invalid timeline event id");
	}

	const deletedTimelineEvent = await deleteTimelineEventById(timelineEventId);

	if (!deletedTimelineEvent) {
		throw new ApiError(404, "Timeline event not found");
	}

	return res.status(200).json(new ApiResponse(200, "Timeline event deleted successfully", deletedTimelineEvent));
});

export {
	createTimelineEventController,
	getAllTimelineEventsController,
	getTimelineEventByIdController,
	updateTimelineEventByIdController,
	deleteTimelineEventByIdController
};
