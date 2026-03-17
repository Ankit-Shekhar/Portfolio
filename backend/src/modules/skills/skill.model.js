import mongoose, { Schema } from "mongoose";

const skillSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		category: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		proficiency: {
			type: Number,
			default: 0,
			min: 0,
			max: 100
		},
		icon: {
			type: String,
			trim: true
		},
		displayOrder: {
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

export const Skill = mongoose.model("Skill", skillSchema, "skills");
