const chunkText = (text, options = {}) => {
	const chunkSize = Number(options.chunkSize || 900);
	const overlap = Number(options.overlap || 120);

	if (!text || typeof text !== "string") {
		return [];
	}

	const normalizedText = text.replace(/\s+/g, " ").trim();

	if (!normalizedText) {
		return [];
	}

	if (normalizedText.length <= chunkSize) {
		return [normalizedText];
	}

	const chunks = [];
	let start = 0;

	while (start < normalizedText.length) {
		const end = Math.min(start + chunkSize, normalizedText.length);
		const chunk = normalizedText.slice(start, end).trim();

		if (chunk.length > 0) {
			chunks.push(chunk);
		}

		if (end >= normalizedText.length) {
			break;
		}

		start = Math.max(end - overlap, start + 1);
	}

	return chunks;
};

export { chunkText };
