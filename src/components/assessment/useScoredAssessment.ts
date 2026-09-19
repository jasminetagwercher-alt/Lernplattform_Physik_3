import { useRef, useState } from "react";

export type AssessmentResult = {
  score: number;
  maxScore: number;
  attempts: number;
  usedSolution: boolean;
};

export function useScoredAssessment({
  itemIds,
  pointsPerItem = 3,
  onComplete,
}: {
  itemIds: string[];
  pointsPerItem?: number;
  onComplete?: (result: AssessmentResult) => void;
}) {
  const [locked, setLocked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [available, setAvailable] = useState<Record<string, number>>(
    () => Object.fromEntries(itemIds.map((id) => [id, pointsPerItem])),
  );
  const [showHint, setShowHint] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);
  const reported = useRef(false);

  const maxScore = itemIds.length * pointsPerItem;
  const complete = locked.length === itemIds.length;

  function report(result: AssessmentResult) {
    if (reported.current) return;
    reported.current = true;
    onComplete?.(result);
  }

  function check(correctIds: string[], wrongIds: string[]) {
    if (complete) return;

    const newlyCorrect = correctIds.filter((id) => !locked.includes(id));
    const nextScore =
      score + newlyCorrect.reduce((sum, id) => sum + (available[id] ?? 0), 0);
    const nextLocked = Array.from(new Set([...locked, ...newlyCorrect]));
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    setLocked(nextLocked);
    setWrong(wrongIds);
    setScore(nextScore);
    setAvailable((current) => {
      const next = { ...current };
      wrongIds.forEach((id) => {
        next[id] = Math.max(0, (next[id] ?? 0) - 1);
      });
      return next;
    });

    if (nextLocked.length === itemIds.length) {
      report({
        score: nextScore,
        maxScore,
        attempts: nextAttempts,
        usedSolution: false,
      });
    }
  }

  function revealSolution() {
    setLocked(itemIds);
    setWrong([]);
    setAvailable(Object.fromEntries(itemIds.map((id) => [id, 0])));
    setSolutionShown(true);
    report({
      score,
      maxScore,
      attempts,
      usedSolution: true,
    });
  }

  return {
    locked,
    wrong,
    attempts,
    score,
    maxScore,
    available,
    showHint,
    solutionShown,
    complete,
    setShowHint,
    check,
    revealSolution,
    clearWrong: (id: string) => setWrong((items) => items.filter((item) => item !== id)),
  };
}
