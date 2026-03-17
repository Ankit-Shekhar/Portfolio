import { getVectorClient } from "../../core/database/vector.connection.js";

const getChromaClient = () => {
	const client = getVectorClient();

	if (!client) {
		throw new Error("Vector DB client is not initialized");
	}

	return client;
};

export { getChromaClient };
