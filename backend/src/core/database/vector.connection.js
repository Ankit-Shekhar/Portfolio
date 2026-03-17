import { ChromaClient, CloudClient } from "chromadb";

let vectorClient = null;

const resolveCloudHost = () => {
	if (process.env.CHROMA_HOST) {
		return process.env.CHROMA_HOST;
	}

	if (process.env.CHROMA_URL) {
		try {
			const parsedUrl = new URL(process.env.CHROMA_URL);
			if (parsedUrl.hostname?.includes("trychroma.com")) {
				return "api.trychroma.com";
			}

			return parsedUrl.hostname;
		} catch {
			//keep default host when CHROMA_URL is not a valid URL
		}
	}

	return "api.trychroma.com";
};

const buildLocalClient = () => {
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

	return new ChromaClient(chromaConfig);
};

const buildCloudClient = () => {
	if (!process.env.CHROMA_TENANT || !process.env.CHROMA_DATABASE) {
		throw new Error("CHROMA_TENANT and CHROMA_DATABASE are required when CHROMA_API_KEY is set");
	}

	return new CloudClient({
		apiKey: process.env.CHROMA_API_KEY,
		host: resolveCloudHost(),
		tenant: process.env.CHROMA_TENANT,
		database: process.env.CHROMA_DATABASE
	});
};

const connectVectorDb = async () => {
	try {
		//if connection is already initialized we return that same client, no need to reconnect
		if (vectorClient) {
			return vectorClient;
		}

		vectorClient = process.env.CHROMA_API_KEY ? buildCloudClient() : buildLocalClient();

		//heartbeat call verifies that vector database endpoint is reachable
		await vectorClient.heartbeat();
		await vectorClient.getUserIdentity();
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
