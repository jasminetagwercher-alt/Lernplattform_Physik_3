import { learningUnits, validateLearningUnits } from "../src/content/registry";

validateLearningUnits(learningUnits);

const taskCount = learningUnits.reduce((sum, unit) => sum + unit.tasks.length, 0);
console.log(`Content validation passed: ${learningUnits.length} unit(s), ${taskCount} task(s).`);
