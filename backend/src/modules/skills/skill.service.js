import { Skill } from "./skill.model.js";

const createSkill = async (payload) => {
	const skill = await Skill.create(payload);
	return skill;
};

const getAllSkills = async () => {
	const skills = await Skill.find().sort({ category: 1, displayOrder: 1, createdAt: -1 });
	return skills;
};

const getSkillById = async (skillId) => {
	const skill = await Skill.findById(skillId);
	return skill;
};

const updateSkillById = async (skillId, payload) => {
	const updatedSkill = await Skill.findByIdAndUpdate(
		skillId,
		{
			$set: payload
		},
		{
			returnDocument: "after",
			runValidators: true
		}
	);

	return updatedSkill;
};

const deleteSkillById = async (skillId) => {
	const deletedSkill = await Skill.findByIdAndDelete(skillId);
	return deletedSkill;
};

export { createSkill, getAllSkills, getSkillById, updateSkillById, deleteSkillById };
