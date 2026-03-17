import "dotenv/config";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

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

const request = async (method, path, { body, admin = false } = {}) => {
	const headers = { "Content-Type": "application/json" };

	if (admin) {
		headers["x-admin-key"] = ADMIN_API_KEY;
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	});

	const payload = await toJson(response);

	if (!response.ok) {
		throw new Error(`${method} ${path} failed: ${response.status} ${JSON.stringify(payload)}`);
	}

	return payload;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestWithRetry = async (method, path, options = {}, retries = 3) => {
	let lastError;

	for (let attempt = 1; attempt <= retries; attempt += 1) {
		try {
			return await request(method, path, options);
		} catch (error) {
			lastError = error;
			if (attempt < retries) {
				await sleep(500 * attempt);
			}
		}
	}

	throw lastError;
};

const run = async () => {
	if (!ADMIN_API_KEY) {
		throw new Error("ADMIN_API_KEY is required for admin endpoint checks");
	}

	const summary = {};

	summary.health = await request("GET", "/api/v1/health");
	summary.readiness = await request("GET", "/api/v1/readiness");

	summary.seed = await request("POST", "/api/v1/ai-agent/seed-data", { body: {} });
	summary.index = await request("POST", "/api/v1/ai-agent/index-knowledge", {
		body: {
			repositoryDocuments: [
				{
					id: "portfolio-main",
					title: "ai-portfolio-os",
					url: "https://github.com/Ankit-Shekhar/ai-portfolio-os",
					content: "Portfolio repository with backend and AI modules"
				}
			]
		}
	});
	summary.aiQuery = await request("POST", "/api/v1/ai-agent/query", {
		body: { query: "Summarize my portfolio projects and backend architecture" }
	});

	const createdProject = await request("POST", "/api/v1/projects", {
		body: {
			title: "Backend Sequence Test Project",
			slug: `backend-sequence-test-${Date.now()}`,
			description: "Project created by API sequence test",
			technologies: ["Node.js", "Express", "MongoDB"],
			featured: false
		}
	});
	const projectId = createdProject?.data?._id;
	summary.projectsList = await request("GET", "/api/v1/projects");
	summary.projectById = await request("GET", `/api/v1/projects/${projectId}`);
	summary.projectUpdated = await request("PATCH", `/api/v1/projects/${projectId}`, {
		body: { impactExplanation: "Updated by API sequence test" }
	});
	summary.projectDeleted = await request("DELETE", `/api/v1/projects/${projectId}`);

	const createdTimeline = await request("POST", "/api/v1/timeline", {
		body: {
			title: "Backend Sequence Timeline Event",
			description: "Timeline event created by API sequence test",
			yearRange: "2026",
			sequence: 999
		}
	});
	const timelineId = createdTimeline?.data?._id;
	summary.timelineList = await request("GET", "/api/v1/timeline");
	summary.timelineById = await request("GET", `/api/v1/timeline/${timelineId}`);
	summary.timelineUpdated = await request("PATCH", `/api/v1/timeline/${timelineId}`, {
		body: { description: "Updated by API sequence test" }
	});
	summary.timelineDeleted = await request("DELETE", `/api/v1/timeline/${timelineId}`);

	const createdSkill = await request("POST", "/api/v1/skills", {
		body: {
			name: "Express.js",
			category: "Backend",
			proficiency: 85,
			displayOrder: 2,
			featured: true
		}
	});
	const skillId = createdSkill?.data?._id;
	summary.skillsList = await request("GET", "/api/v1/skills");
	summary.skillById = await request("GET", `/api/v1/skills/${skillId}`);
	summary.skillUpdated = await request("PATCH", `/api/v1/skills/${skillId}`, {
		body: { proficiency: 88 }
	});
	summary.skillDeleted = await request("DELETE", `/api/v1/skills/${skillId}`);

	const createdContact = await request("POST", "/api/v1/contact", {
		body: {
			name: "Sequence Test User",
			email: "sequence.test@example.com",
			message: "Contact message from backend sequence test"
		}
	});
	const messageId = createdContact?.data?._id;
	summary.contactList = await request("GET", "/api/v1/contact", { admin: true });
	summary.contactById = await request("GET", `/api/v1/contact/${messageId}`);
	summary.contactUpdated = await request("PATCH", `/api/v1/contact/${messageId}`, {
		admin: true,
		body: { status: "read" }
	});
	summary.contactDeleted = await request("DELETE", `/api/v1/contact/${messageId}`, { admin: true });

	summary.analyticsEvent = await request("POST", "/api/v1/analytics/events", {
		body: {
			eventType: "ai_question",
			projectId: "ai-portfolio-os",
			sessionId: `sequence-${Date.now()}`,
			metadata: { source: "backend-sequence-script" }
		}
	});
	summary.analyticsList = await request("GET", "/api/v1/analytics/events?limit=10", { admin: true });
	summary.analyticsSummary = await request("GET", "/api/v1/analytics/summary", { admin: true });

	try {
		summary.githubProfile = await requestWithRetry("GET", "/api/v1/github/profile?username=Ankit-Shekhar");
		summary.githubRepos = await requestWithRetry("GET", "/api/v1/github/repos?username=Ankit-Shekhar");
		summary.githubReadme = await requestWithRetry("GET", "/api/v1/github/repos/Ankit-Shekhar/Pithu-ChatBot/readme");
	} catch (error) {
		summary.githubWarning = error.message;
	}

	console.log(
		JSON.stringify(
			{
				success: true,
				message: "Backend API sequence completed successfully",
				checkpoints: {
					health: summary.health?.success,
					readiness: summary.readiness?.success,
					projectsCount: summary.projectsList?.data?.length,
					timelineCount: summary.timelineList?.data?.length,
					skillsCount: summary.skillsList?.data?.length,
					contactCount: summary.contactList?.data?.length,
					analyticsTotal: summary.analyticsSummary?.data?.totalEvents,
					githubLogin: summary.githubProfile?.data?.login || null,
					githubReposCount: summary.githubRepos?.data?.length || 0,
					githubWarning: summary.githubWarning || null,
					knowledgeChunksIndexed: summary.index?.data?.embeddingResult?.knowledgeChunksIndexed
				}
			},
			null,
			2
		)
	);
};

run().catch((error) => {
	console.error(JSON.stringify({ success: false, message: error.message }, null, 2));
	process.exit(1);
});
