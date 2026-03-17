import mongoose, { Schema } from "mongoose";

const timelineEventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		yearRange: {
			type: String,
			required: true,
			trim: true
		},
		animationScene: {
			type: String,
			trim: true
		},
		visualAssets: [
			{
				type: String,
				trim: true
			}
		],
		sequence: {
			type: Number,
			default: 0,
			index: true
		},
		featured: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export const TimelineEvent = mongoose.model("TimelineEvent", timelineEventSchema, "timeline_events");
