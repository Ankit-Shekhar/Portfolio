import { ContactMessage } from "./contact.model.js";

const createContactMessage = async (payload) => {
	const createdMessage = await ContactMessage.create(payload);
	return createdMessage;
};

const getAllContactMessages = async () => {
	const messages = await ContactMessage.find().sort({ createdAt: -1 });
	return messages;
};

const getContactMessageById = async (messageId) => {
	const message = await ContactMessage.findById(messageId);
	return message;
};

const updateContactMessageById = async (messageId, payload) => {
	const updatedMessage = await ContactMessage.findByIdAndUpdate(
		messageId,
		{
			$set: payload
		},
		{
			new: true,
			runValidators: true
		}
	);

	return updatedMessage;
};

const deleteContactMessageById = async (messageId) => {
	const deletedMessage = await ContactMessage.findByIdAndDelete(messageId);
	return deletedMessage;
};

export {
	createContactMessage,
	getAllContactMessages,
	getContactMessageById,
	updateContactMessageById,
	deleteContactMessageById
};
