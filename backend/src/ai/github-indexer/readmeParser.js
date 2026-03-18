const normalizeReadmeText = (text) => {
	return String(text || "")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[(.*?)\]\((.*?)\)/g, "$1")
		.replace(/[#>*_~\-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
};

const parseRepositoryDocuments = (repositoryDocuments = []) => {
	if (!Array.isArray(repositoryDocuments)) {
		return [];
	}

	return repositoryDocuments
		.map((repositoryDocument) => ({
			...repositoryDocument,
			content: normalizeReadmeText(repositoryDocument?.content)
		}))
		.filter((repositoryDocument) => Boolean(repositoryDocument.content));
};

export { parseRepositoryDocuments };
