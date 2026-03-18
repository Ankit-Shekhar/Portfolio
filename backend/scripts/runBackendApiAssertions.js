import "dotenv/config";
import assert from "node:assert/strict";

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

const toJson = async (response) => {
	const text = await response.text();
	if (!text) {
		return {};
	}
	try {
		return JSON.parse(text);
	} catch {
		return { raw: text };
	}
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (method, path, { body, admin = false, retries = 3 } = {}) => {
	const headers = { "Content-Type": "application/json" };
	if (admin) {
		headers["x-admin-key"] = ADMIN_API_KEY;
	}

	let lastError;

	for (let attempt = 1; attempt <= retries; attempt += 1) {
		try {
			const response = await fetch(`${BASE_URL}${path}`, {
				method,
				headers,
				body: body ? JSON.stringify(body) : undefined
			});

			const payload = await toJson(response);
			return { status: response.status, payload };
		} catch (error) {
			lastError = error;
			if (attempt < retries) {
				await sleep(400 * attempt);
			}
		}
	}

	throw new Error(`${method} ${path} failed after ${retries} attempts: ${lastError?.message || "unknown error"}`);
};

const ensureSuccess = (result, label) => {
	assert.equal(result.status >= 200 && result.status < 300, true, `${label} status must be 2xx`);
	assert.equal(result.payload.success, true, `${label} payload.success must be true`);
};

const run = async () => {
	assert.ok(ADMIN_API_KEY, "ADMIN_API_KEY must be present for admin route assertions");

	const health = await request("GET", "/api/v1/health");
	ensureSuccess(health, "health");

	const readiness = await request("GET", "/api/v1/readiness");
	ensureSuccess(readiness, "readiness");
	assert.equal(readiness.payload.services?.mongo, true, "readiness mongo must be true");

	const seed = await request("POST", "/api/v1/ai-agent/seed-data", { body: {} });
	ensureSuccess(seed, "seed-data");

	const index = await request("POST", "/api/v1/ai-agent/index-knowledge", {
		body: {
			repositoryDocuments: [
				{
					id: "assert-repo",
					title: "assertion repo",
					url: "https://github.com/Ankit-Shekhar/Portfolio",
					content: "Assertion test repository content for indexing"
				}
			]
		}
	});
	ensureSuccess(index, "index-knowledge");
	assert.equal(index.payload.data.embeddingResult.knowledgeChunksIndexed > 0, true, "embedding chunks must be indexed");

	const aiQuery = await request("POST", "/api/v1/ai-agent/query", { body: { query: "backend architecture summary" } });
	ensureSuccess(aiQuery, "ai-query");
	assert.ok(String(aiQuery.payload.data.answer || "").length > 0, "ai query answer must not be empty");

	const unauthPipeline = await request("GET", "/api/v1/ai-agent/pipeline-events?limit=3");
	assert.equal(unauthPipeline.status, 401, "pipeline-events without admin key must be 401");

	const pipeline = await request("GET", "/api/v1/ai-agent/pipeline-events?limit=3", { admin: true });
	ensureSuccess(pipeline, "pipeline-events-admin");

	const diagnostics = await request("GET", "/api/v1/ai-agent/pipeline-diagnostics?limit=20", { admin: true });
	ensureSuccess(diagnostics, "pipeline-diagnostics-admin");

	const githubStatus = await request("GET", "/api/v1/ai-agent/index-github/status", { admin: true });
	ensureSuccess(githubStatus, "index-github-status-admin");

	const githubProfile = await request("GET", "/api/v1/github/profile?username=Ankit-Shekhar");
	ensureSuccess(githubProfile, "github-profile");

	const analyticsTrack = await request("POST", "/api/v1/analytics/events", {
		body: {
			eventType: "assertion_event",
			projectId: "ai-portfolio-os",
			sessionId: `assert-${Date.now()}`,
			metadata: { source: "assertions" }
		}
	});
	ensureSuccess(analyticsTrack, "analytics-track");

	const unauthAnalyticsSummary = await request("GET", "/api/v1/analytics/summary");
	assert.equal(unauthAnalyticsSummary.status, 401, "analytics summary without admin key must be 401");

	const analyticsSummary = await request("GET", "/api/v1/analytics/summary", { admin: true });
	ensureSuccess(analyticsSummary, "analytics-summary-admin");

	console.log(
		JSON.stringify(
			{
				success: true,
				message: "Backend API assertions passed",
				checks: {
					health: true,
					readiness: true,
					indexing: true,
					aiQuery: true,
					adminAuthGuards: true,
					pipelineTelemetry: true,
					githubApis: true,
					analytics: true
				}
			},
			null,
			2
		)
	);
};

run().catch((error) => {
	console.error(
		JSON.stringify(
			{
				success: false,
				message: error.message
			},
			null,
			2
		)
	);
	process.exit(1);
});
