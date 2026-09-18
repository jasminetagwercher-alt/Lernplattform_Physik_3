export type Option = {
  id: string;
  label: string;
};

export type BaseTask = {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  explanation: string;
  sourceRefs: string[];
};

export type SingleChoiceTask = BaseTask & {
  type: "single-choice";
  options: Option[];
  correctId: string;
};

export type MultiChoiceTask = BaseTask & {
  type: "multi-choice";
  options: Option[];
  correctIds: string[];
};

export type NumericTask = BaseTask & {
  type: "numeric";
  answer: number;
  unit?: string;
  tolerance?: number;
  formula?: string;
};

export type Task = SingleChoiceTask | MultiChoiceTask | NumericTask;

export type ActivityKind = "mission" | "challenge" | "phet-lab" | "virtual-lab";

export type LearningActivity = {
  id: string;
  kind: ActivityKind;
  title: string;
  label: string;
  description: string;
  sourceRefs: string[];
};

export type LearningUnit = {
  id: string;
  chapter: string;
  title: string;
  pages: string;
  description: string;
  activities: LearningActivity[];
  tasks: Task[];
};
