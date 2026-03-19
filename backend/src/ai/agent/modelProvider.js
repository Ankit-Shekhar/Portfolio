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

const extractHuggingFaceText = (payload) => {
	if (Array.isArray(payload) && payload[0]?.generated_text) {
		return payload[0].generated_text;
	}

	if (typeof payload?.generated_text === "string") {
		return payload.generated_text;
	}

	if (Array.isArray(payload?.choices) && payload.choices[0]?.text) {
		return payload.choices[0].text;
	}

	return null;
};

const buildHuggingFaceModelCandidates = () => {
	const primaryModel = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";
	const fallbackModels = String(
		process.env.HF_FALLBACK_MODELS || "mistralai/Mistral-7B-Instruct-v0.3,HuggingFaceH4/zephyr-7b-beta"
	)
		.split(",")
		.map((modelName) => modelName.trim())
		.filter(Boolean);

	return [primaryModel, ...fallbackModels].filter((modelName, index, array) => array.indexOf(modelName) === index);
};

const callHuggingFaceModelByName = async ({ query, context, model }) => {
	const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
	const endpoint = process.env.HF_INFERENCE_ENDPOINT || `https://api-inference.huggingface.co/models/${model}`;

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			inputs: `You are a portfolio AI assistant. Use only supplied context.\n\nQuery: ${query}\n\nContext:\n${context}`,
			parameters: {
				max_new_tokens: 300,
				temperature: 0.3,
				return_full_text: false
			},
			options: {
				wait_for_model: true
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Hugging Face request failed with status ${response.status}`);
	}

	const payload = await response.json();

	if (payload?.error) {
		throw new Error(`Hugging Face error: ${payload.error}`);
	}

	const text = extractHuggingFaceText(payload);

	if (!text) {
		throw new Error("Hugging Face response did not contain text output");
	}

	return {
		provider: "huggingface",
		model,
		text
	};
};

const callHuggingFaceModel = async ({ query, context }) => {
	const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;

	if (!apiKey) {
		return null;
	}

	const modelCandidates = buildHuggingFaceModelCandidates();
	const errors = [];

	for (const model of modelCandidates) {
		try {
			return await callHuggingFaceModelByName({ query, context, model });
		} catch (error) {
			errors.push(`${model}: ${error?.message || "unknown error"}`);
		}
	}

	throw new Error(`Hugging Face model attempts failed. ${errors.join(" | ")}`);
};

const generateModelResponse = async ({ query, context }) => {
	const providers = [callGeminiModel, callOpenAIModel, callHuggingFaceModel];
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
