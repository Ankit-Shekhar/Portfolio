import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			index: true
		},
		message: {
			type: String,
			required: true,
			trim: true
		},
		status: {
			type: String,
			enum: ["new", "read", "resolved"],
			default: "new",
			index: true
		}
	},
	{
		timestamps: true
	}
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema, "contact_messages");
