import fs from "fs/promises";
import path from "path";

const DOC_FILES = [
	"docs/PROJECT_CONTEXT_FULL.md",
	"docs/SYSTEM_ARCHITECTURE.md",
	"docs/INTERVIEW_GUIDE.md",
	"README.md"
];

const ROOT_DIR = path.resolve(process.cwd(), "..");

const readFileContext = async (query, maxResults = 3) => {
	const loweredQuery = String(query || "").toLowerCase();
	const matches = [];

	for (const relativeFilePath of DOC_FILES) {
		try {
			const absolutePath = path.join(ROOT_DIR, relativeFilePath);
			const content = await fs.readFile(absolutePath, "utf-8");
			const lines = content.split(/\r?\n/);

			for (let index = 0; index < lines.length; index += 1) {
				const line = lines[index];
				if (line.toLowerCase().includes(loweredQuery)) {
					matches.push({
						file: relativeFilePath,
						line: index + 1,
						excerpt: line.trim()
					});
				}
				if (matches.length >= maxResults) {
					return matches;
				}
			}
		} catch {
			//ignore read errors for optional context files
		}
	}

	return matches;
};

export { readFileContext };
