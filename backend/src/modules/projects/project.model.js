import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			index: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		technologies: [
			{
				type: String,
				trim: true
			}
		],
		githubUrl: {
			type: String,
			trim: true
		},
		liveUrl: {
			type: String,
			trim: true
		},
		architectureNotes: {
			type: String,
			trim: true
		},
		impactExplanation: {
			type: String,
			trim: true
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

export const Project = mongoose.model("Project", projectSchema);
