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

export { buildEmbeddableDocument };
