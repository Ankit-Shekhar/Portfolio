import { ApiError } from "../../core/utils/ApiError.js";

const sanitizeSkillPayload = (payload = {}) => {
	const sanitized = {
		name: typeof payload.name === "string" ? payload.name.trim() : payload.name,
		category: typeof payload.category === "string" ? payload.category.trim() : payload.category,
		proficiency: typeof payload.proficiency === "number" ? payload.proficiency : payload.proficiency,
		icon: typeof payload.icon === "string" ? payload.icon.trim() : payload.icon,
		displayOrder: typeof payload.displayOrder === "number" ? payload.displayOrder : payload.displayOrder,
		featured: typeof payload.featured === "boolean" ? payload.featured : payload.featured
	};

	return sanitized;
};

const validateCreateSkillPayload = (payload = {}) => {
	const sanitized = sanitizeSkillPayload(payload);

	if (!sanitized.name || !sanitized.category) {
		throw new ApiError(400, "name and category are required");
	}

	return sanitized;
};

const validateUpdateSkillPayload = (payload = {}) => {
	const sanitized = sanitizeSkillPayload(payload);
	const updateKeys = Object.keys(sanitized).filter((key) => sanitized[key] !== undefined);

	if (updateKeys.length === 0) {
		throw new ApiError(400, "At least one field is required to update skill");
	}

	return sanitized;
};

export { validateCreateSkillPayload, validateUpdateSkillPayload };
