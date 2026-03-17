import { TimelineEvent } from "./timeline.model.js";

const createTimelineEvent = async (payload) => {
	const timelineEvent = await TimelineEvent.create(payload);
	return timelineEvent;
};

const getAllTimelineEvents = async () => {
	const timelineEvents = await TimelineEvent.find().sort({ sequence: 1, createdAt: 1 });
	return timelineEvents;
};

const getTimelineEventById = async (timelineEventId) => {
	const timelineEvent = await TimelineEvent.findById(timelineEventId);
	return timelineEvent;
};

const updateTimelineEventById = async (timelineEventId, payload) => {
	const updatedTimelineEvent = await TimelineEvent.findByIdAndUpdate(
		timelineEventId,
		{
			$set: payload
		},
		{
			new: true,
			runValidators: true
		}
	);

	return updatedTimelineEvent;
};

const deleteTimelineEventById = async (timelineEventId) => {
	const deletedTimelineEvent = await TimelineEvent.findByIdAndDelete(timelineEventId);
	return deletedTimelineEvent;
};

export {
	createTimelineEvent,
	getAllTimelineEvents,
	getTimelineEventById,
	updateTimelineEventById,
	deleteTimelineEventById
};
