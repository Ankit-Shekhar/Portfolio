import { ChromaClient } from "chromadb";

let vectorClient = null;

const connectVectorDb = async () => {
	try {
		//if connection is already initialized we return that same client, no need to reconnect
		if (vectorClient) {
			return vectorClient;
		}

		const chromaUrl = process.env.CHROMA_URL || "http://localhost:8000";
		const parsedUrl = new URL(chromaUrl);

		const chromaConfig = {
			host: parsedUrl.hostname,
			port: Number(parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80)),
			ssl: parsedUrl.protocol === "https:",
			tenant: process.env.CHROMA_TENANT,
			database: process.env.CHROMA_DATABASE
		};

		if (process.env.CHROMA_API_KEY) {
			chromaConfig.headers = {
				"x-chroma-token": process.env.CHROMA_API_KEY
			};
		}

		vectorClient = new ChromaClient(chromaConfig);

		//heartbeat call verifies that vector database endpoint is reachable
		await vectorClient.heartbeat();
		console.log("Chroma DB connected successfully!");

		return vectorClient;
	} catch (error) {
		console.log(`Chroma DB connection Failed: ${error}`);

		//whatever process is running now this process below is the reference of it through which we can exit that process
		process.exit(1); // Exit the process with failure
	}
};

export const getVectorClient = () => vectorClient;
export default connectVectorDb;
