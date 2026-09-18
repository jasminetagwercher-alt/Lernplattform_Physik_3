import type { LearningUnit } from "../model";
import { electricityUnit } from "./electricity";

export const learningUnits: LearningUnit[] = [electricityUnit];

export function validateLearningUnits(units: LearningUnit[]) {
  const unitIds = new Set<string>();
  const taskIds = new Set<string>();
  const errors: string[] = [];

  for (const unit of units) {
    if (!unit.id.trim()) errors.push("Eine Einheit hat keine ID.");
    if (unitIds.has(unit.id)) errors.push(`Doppelte Einheiten-ID: ${unit.id}`);
    unitIds.add(unit.id);

    if (!unit.chapter.trim()) errors.push(`Einheit ${unit.id}: Kapitel fehlt.`);
    if (!unit.title.trim()) errors.push(`Einheit ${unit.id}: Titel fehlt.`);
    if (!unit.pages.trim()) errors.push(`Einheit ${unit.id}: Buchseiten fehlen.`);
    if (unit.activities.length === 0) errors.push(`Einheit ${unit.id}: keine Aktivitäten.`);
    if (unit.tasks.length === 0) errors.push(`Einheit ${unit.id}: keine Aufgaben.`);

    const activityIds = new Set<string>();
    for (const activity of unit.activities) {
      if (!activity.id.trim()) errors.push(`Einheit ${unit.id}: Aktivitäts-ID fehlt.`);
      if (activityIds.has(activity.id)) errors.push(`Doppelte Aktivitäts-ID in ${unit.id}: ${activity.id}`);
      activityIds.add(activity.id);
      if (!activity.title.trim()) errors.push(`Aktivität ${activity.id}: Titel fehlt.`);
      if (!activity.label.trim()) errors.push(`Aktivität ${activity.id}: Label fehlt.`);
      if (!activity.description.trim()) errors.push(`Aktivität ${activity.id}: Beschreibung fehlt.`);
      if (activity.sourceRefs.length === 0) errors.push(`Aktivität ${activity.id}: Quellen-ID fehlt.`);
    }

    for (const task of unit.tasks) {
      if (taskIds.has(task.id)) errors.push(`Doppelte Aufgaben-ID: ${task.id}`);
      taskIds.add(task.id);

      if (!task.title.trim()) errors.push(`Aufgabe ${task.id}: Titel fehlt.`);
      if (!task.prompt.trim()) errors.push(`Aufgabe ${task.id}: Aufgabenstellung fehlt.`);
      if (!task.hint.trim()) errors.push(`Aufgabe ${task.id}: Hinweis fehlt.`);
      if (!task.explanation.trim()) errors.push(`Aufgabe ${task.id}: Erklärung fehlt.`);
      if (task.sourceRefs.length === 0) errors.push(`Aufgabe ${task.id}: Quellen-ID fehlt.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }

  return true;
}

validateLearningUnits(learningUnits);
