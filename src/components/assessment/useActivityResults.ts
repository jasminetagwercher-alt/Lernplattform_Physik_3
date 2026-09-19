import { useRef, useState } from "react";
import type { AssessmentResult } from "./useScoredAssessment";

export function useActivityResults({
  taskIds,
  onComplete,
}: {
  taskIds: string[];
  onComplete?: (result: AssessmentResult) => void;
}) {
  const [results, setResults] = useState<Record<string, AssessmentResult>>({});
  const reported = useRef(false);

  function record(taskId: string, result: AssessmentResult) {
    setResults((current) => {
      if (current[taskId]) return current;

      const next = { ...current, [taskId]: result };
      const complete = taskIds.every((id) => next[id]);

      if (complete && !reported.current) {
        reported.current = true;
        const values = taskIds.map((id) => next[id]);
        onComplete?.({
          score: values.reduce((sum, item) => sum + item.score, 0),
          maxScore: values.reduce((sum, item) => sum + item.maxScore, 0),
          attempts: values.reduce((sum, item) => sum + item.attempts, 0),
          usedSolution: values.some((item) => item.usedSolution),
        });
      }

      return next;
    });
  }

  return {
    results,
    completedTasks: Object.keys(results).length,
    totalTasks: taskIds.length,
    record,
  };
}
