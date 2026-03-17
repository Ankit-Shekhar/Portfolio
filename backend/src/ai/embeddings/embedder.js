import crypto from "crypto";

const createDeterministicId = (prefix, text) => {
	const hash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
	return `${prefix}_${hash}`;
};

const buildEmbeddableDocument = ({ idPrefix, text, metadata }) => {
	const normalizedText = (text || "").replace(/\s+/g, " ").trim();

	if (!normalizedText) {
		return null;
	}

	const id = createDeterministicId(idPrefix, normalizedText);

	return {
		id,
		document: normalizedText,
		metadata: metadata || {}
	};
};

const createDeterministicEmbedding = (text, dimensions = 128) => {
	const normalizedText = (text || "").replace(/\s+/g, " ").trim();

	if (!normalizedText) {
		return Array.from({ length: dimensions }, () => 0);
	}

	const vector = [];
	let nonce = 0;

	while (vector.length < dimensions) {
		const digest = crypto.createHash("sha256").update(`${normalizedText}::${nonce}`).digest();

		for (let index = 0; index < digest.length && vector.length < dimensions; index += 1) {
			const value = digest[index] / 255;
			vector.push(value * 2 - 1);
		}

		nonce += 1;
	}

	const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;

	return vector.map((value) => value / magnitude);
};

export { buildEmbeddableDocument, createDeterministicEmbedding };
