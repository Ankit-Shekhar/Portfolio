const TOOL_TYPES = {
	VECTOR_SEARCH: "vector_search",
	READ_FILE: "read_file",
	LIST_PROJECTS: "list_projects",
	GITHUB_FETCH: "github_fetch"
};

const selectToolForQuery = (query) => {
	const normalizedQuery = String(query || "").toLowerCase();

	if (/github|repo|repository|readme/.test(normalizedQuery)) {
		return TOOL_TYPES.GITHUB_FETCH;
	}

	if (/document|docs|architecture|context|guide|read file|readme/.test(normalizedQuery)) {
		return TOOL_TYPES.READ_FILE;
	}

	if (/skills|technolog|stack|projects list|list projects|built/.test(normalizedQuery)) {
		return TOOL_TYPES.LIST_PROJECTS;
	}

	return TOOL_TYPES.VECTOR_SEARCH;
};

export { TOOL_TYPES, selectToolForQuery };
