const callGeminiModel = async ({ query, context }) => {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		return null;
	}

	const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [
						{
							text: `You are a portfolio AI assistant. Answer using the provided context only.\n\nQuery: ${query}\n\nContext:\n${context}`
						}
					]
				}
			]
		})
	});

	if (!response.ok) {
		throw new Error(`Gemini request failed with status ${response.status}`);
	}

	const payload = await response.json();
	const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

	if (!text) {
		throw new Error("Gemini response did not contain text output");
	}

	return {
		provider: "gemini",
		model,
		text
	};
};

const callOpenAIModel = async ({ query, context }) => {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		return null;
	}

	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
	const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

	const response = await fetch(`${baseUrl}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [
				{
					role: "system",
					content: "You are a portfolio AI assistant. Use only supplied context."
				},
				{
					role: "user",
					content: `Query: ${query}\n\nContext:\n${context}`
				}
			],
			temperature: 0.3
		})
	});

	if (!response.ok) {
		throw new Error(`OpenAI request failed with status ${response.status}`);
	}

	const payload = await response.json();
	const text = payload?.choices?.[0]?.message?.content;

	if (!text) {
		throw new Error("OpenAI response did not contain text output");
	}

	return {
		provider: "openai",
		model,
		text
	};
};

const generateModelResponse = async ({ query, context }) => {
	const providers = [callGeminiModel, callOpenAIModel];
	const providerErrors = [];

	for (const provider of providers) {
		try {
			const result = await provider({ query, context });
			if (result) {
				return {
					result,
					errors: providerErrors
				};
			}
		} catch (error) {
			providerErrors.push(error?.message || "Unknown model provider error");
		}
	}

	return {
		result: null,
		errors: providerErrors
	};
};

export { generateModelResponse };
