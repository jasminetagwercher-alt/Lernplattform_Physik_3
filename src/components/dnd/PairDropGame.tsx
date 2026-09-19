import { useMemo, useState } from "react";
import type { AssessmentResult } from "../assessment/useScoredAssessment";
import { useScoredAssessment } from "../assessment/useScoredAssessment";
import type { MediaItem } from "../media/MediaCard";
import { DraggableMediaTile } from "./DraggableMediaTile";
import { DroppableZone } from "./DroppableZone";
import { PointerDragProvider } from "./PointerDragProvider";

export type DropPair = {
  id: string;
  tile: MediaItem;
  target: MediaItem;
  targetTitle: string;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function PairDropGame({
  title,
  prompt,
  pairs,
  hint = "Prüfe noch einmal, welche Begriffe fachlich wirklich zusammengehören.",
  onComplete,
}: {
  title: string;
  prompt: string;
  pairs: DropPair[];
  hint?: string;
  onComplete?: (result: AssessmentResult) => void;
}) {
  const bank = useMemo(() => shuffle(pairs), [pairs]);
  const targets = useMemo(() => shuffle(pairs), [pairs]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const assessment = useScoredAssessment({
    itemIds: pairs.map((pair) => pair.id),
    onComplete,
  });

  const allPlaced = pairs.every((pair) => placements[pair.id]);

  function place(tileSourceId: string, targetSourceId: string) {
    const tileId = tileSourceId.replace("tile:", "");
    const targetId = targetSourceId.replace("target:", "");
    if (assessment.locked.includes(tileId)) return;

    setPlacements((current) => {
      const next = { ...current };
      const displaced = Object.entries(next).find(
        ([otherTileId, placedTarget]) => otherTileId !== tileId && placedTarget === targetId,
      );
      if (displaced && assessment.locked.includes(displaced[0])) return current;
      if (displaced) delete next[displaced[0]];
      next[tileId] = targetId;
      return next;
    });
    assessment.clearWrong(tileId);
    setSelected(null);
  }

  function chooseTile(id: string) {
    if (assessment.locked.includes(id)) return;
    setSelected(selected === id ? null : id);
  }

  function chooseTarget(id: string) {
    if (!selected) return;
    place("tile:" + selected, "target:" + id);
  }

  function check() {
    if (!allPlaced || assessment.complete) return;

    const correct = pairs
      .filter((pair) => !assessment.locked.includes(pair.id) && placements[pair.id] === pair.id)
      .map((pair) => pair.id);
    const incorrect = pairs
      .filter((pair) => !assessment.locked.includes(pair.id) && placements[pair.id] !== pair.id)
      .map((pair) => pair.id);

    assessment.check(correct, incorrect);
  }

  function revealSolution() {
    setPlacements(Object.fromEntries(pairs.map((pair) => [pair.id, pair.id])));
    setSelected(null);
    assessment.revealSolution();
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Paare zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{assessment.score}/{assessment.maxScore}</strong>
          <span>Punkte</span>
        </div>
      </div>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={place}>
        <div className="dnd-bank" aria-label="Kacheln">
          {bank.map((pair) => !placements[pair.id] && (
            <DraggableMediaTile
              key={pair.id}
              id={"tile:" + pair.id}
              item={pair.tile}
              selected={selected === pair.id}
              onClick={() => chooseTile(pair.id)}
            />
          ))}
          {allPlaced && !assessment.complete && (
            <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt erst prüfen.</div>
          )}
          {assessment.complete && (
            <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>
          )}
        </div>

        <div className="pair-target-grid">
          {targets.map((target) => {
            const placedTileId = Object.entries(placements).find(([, targetId]) => targetId === target.id)?.[0];
            const placedPair = pairs.find((pair) => pair.id === placedTileId);
            const isLocked = placedTileId ? assessment.locked.includes(placedTileId) : false;
            const isWrong = placedTileId ? assessment.wrong.includes(placedTileId) : false;

            return (
              <DroppableZone
                key={target.id}
                id={"target:" + target.id}
                title={target.targetTitle}
                active={selected !== null}
                success={Boolean(placedTileId && isLocked && placedTileId === target.id)}
                error={Boolean(isWrong)}
                onClick={() => chooseTarget(target.id)}
              >
                <div className="pair-answer-zone">
                  <div className="target-reference">
                    {target.target.kind === "symbol" && <span className="target-symbol">{target.target.symbol}</span>}
                    {target.target.kind === "text" && <span>{target.target.text}</span>}
                    {target.target.kind === "image" && <img src={target.target.src} alt={target.target.alt} />}
                  </div>
                  {placedPair ? (
                    <DraggableMediaTile
                      id={"tile:" + placedPair.id}
                      item={placedPair.tile}
                      disabled={isLocked}
                      selected={selected === placedPair.id}
                      onClick={() => chooseTile(placedPair.id)}
                    />
                  ) : (
                    <span className="empty-zone-copy">Kachel hier ablegen</span>
                  )}
                </div>
              </DroppableZone>
            );
          })}
        </div>
      </PointerDragProvider>

      <div className="assessment-bar">
        <span>Prüfversuche: {assessment.attempts}</span>
        <span>Pro Zuordnung sind anfangs 3 Punkte möglich.</span>
      </div>

      {!assessment.complete && (
        <div className="game-actions assessment-actions">
          {assessment.attempts >= 1 && <button className="text-button" onClick={() => assessment.setShowHint(true)}>Hinweis</button>}
          {assessment.attempts >= 3 && <button className="text-button" onClick={revealSolution}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {assessment.showHint && !assessment.complete && <div className="feedback hint">{hint}</div>}
      {assessment.wrong.length > 0 && !assessment.complete && (
        <div className="feedback hint">
          {assessment.wrong.length} {assessment.wrong.length === 1 ? "Zuordnung stimmt" : "Zuordnungen stimmen"} noch nicht.
        </div>
      )}
      {assessment.complete && (
        <div className={assessment.solutionShown ? "feedback solution" : "feedback correct"}>
          {assessment.solutionShown
            ? "Lösung angezeigt. Dein Ergebnis: " + assessment.score + " von " + assessment.maxScore + " Punkten."
            : "Geschafft: " + assessment.score + " von " + assessment.maxScore + " Punkten."}
        </div>
      )}
    </section>
  );
}
