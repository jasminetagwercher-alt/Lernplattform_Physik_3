import { useMemo, useState } from "react";
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
}: {
  title: string;
  prompt: string;
  pairs: DropPair[];
  hint?: string;
}) {
  const bank = useMemo(() => shuffle(pairs), [pairs]);
  const targets = useMemo(() => shuffle(pairs), [pairs]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [available, setAvailable] = useState<Record<string, number>>(
    () => Object.fromEntries(pairs.map((pair) => [pair.id, 3])),
  );
  const [showHint, setShowHint] = useState(false);
  const [solvedBySolution, setSolvedBySolution] = useState(false);

  const maxScore = pairs.length * 3;
  const complete = locked.length === pairs.length;
  const allPlaced = pairs.every((pair) => placements[pair.id]);

  function place(tileSourceId: string, targetSourceId: string) {
    const tileId = tileSourceId.replace("tile:", "");
    const targetId = targetSourceId.replace("target:", "");
    if (locked.includes(tileId)) return;

    setPlacements((current) => {
      const next = { ...current };
      const displaced = Object.entries(next).find(
        ([otherTileId, placedTarget]) => otherTileId !== tileId && placedTarget === targetId,
      );
      if (displaced && locked.includes(displaced[0])) return current;
      if (displaced) delete next[displaced[0]];
      next[tileId] = targetId;
      return next;
    });
    setWrong((items) => items.filter((id) => id !== tileId));
    setSelected(null);
  }

  function chooseTile(id: string) {
    if (locked.includes(id)) return;
    setSelected(selected === id ? null : id);
  }

  function chooseTarget(id: string) {
    if (!selected) return;
    place(`tile:${selected}`, `target:${id}`);
  }

  function check() {
    if (!allPlaced || complete) return;

    const newlyCorrect = pairs
      .filter((pair) => !locked.includes(pair.id) && placements[pair.id] === pair.id)
      .map((pair) => pair.id);
    const newlyWrong = pairs
      .filter((pair) => !locked.includes(pair.id) && placements[pair.id] !== pair.id)
      .map((pair) => pair.id);

    setAttempts((value) => value + 1);
    setLocked((current) => [...current, ...newlyCorrect]);
    setWrong(newlyWrong);
    setScore((value) => value + newlyCorrect.reduce((sum, id) => sum + (available[id] ?? 0), 0));
    setAvailable((current) => {
      const next = { ...current };
      newlyWrong.forEach((id) => {
        next[id] = Math.max(0, (next[id] ?? 0) - 1);
      });
      return next;
    });
  }

  function revealSolution() {
    const next = Object.fromEntries(pairs.map((pair) => [pair.id, pair.id]));
    setPlacements(next);
    setLocked(pairs.map((pair) => pair.id));
    setWrong([]);
    setAvailable(Object.fromEntries(pairs.map((pair) => [pair.id, 0])));
    setSolvedBySolution(true);
    setSelected(null);
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Paare zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{score}/{maxScore}</strong>
          <span>Punkte</span>
        </div>
      </div>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={place}>
        <div className="dnd-bank" aria-label="Kacheln">
          {bank.map((pair) => !placements[pair.id] && (
            <DraggableMediaTile
              key={pair.id}
              id={`tile:${pair.id}`}
              item={pair.tile}
              selected={selected === pair.id}
              onClick={() => chooseTile(pair.id)}
            />
          ))}
          {allPlaced && !complete && (
            <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt erst prüfen.</div>
          )}
          {complete && (
            <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>
          )}
        </div>

        <div className="pair-target-grid">
          {targets.map((target) => {
            const placedTileId = Object.entries(placements).find(([, targetId]) => targetId === target.id)?.[0];
            const placedPair = pairs.find((pair) => pair.id === placedTileId);
            const isLocked = placedTileId ? locked.includes(placedTileId) : false;
            const isWrong = placedTileId ? wrong.includes(placedTileId) : false;

            return (
              <DroppableZone
                key={target.id}
                id={`target:${target.id}`}
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
                      id={`tile:${placedPair.id}`}
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
        <span>Prüfversuche: {attempts}</span>
        <span>Pro Zuordnung sind anfangs 3 Punkte möglich.</span>
      </div>

      {!complete && (
        <div className="game-actions assessment-actions">
          {attempts >= 1 && <button className="text-button" onClick={() => setShowHint(true)}>Hinweis</button>}
          {attempts >= 3 && <button className="text-button" onClick={revealSolution}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {showHint && !complete && <div className="feedback hint">{hint}</div>}
      {wrong.length > 0 && !complete && (
        <div className="feedback hint">
          {wrong.length} {wrong.length === 1 ? "Zuordnung stimmt" : "Zuordnungen stimmen"} noch nicht. Korrigiere nur diese Kacheln und prüfe erneut.
        </div>
      )}
      {complete && (
        <div className={solvedBySolution ? "feedback solution" : "feedback correct"}>
          {solvedBySolution
            ? `Lösung angezeigt. Dein Ergebnis: ${score} von ${maxScore} Punkten.`
            : `Geschafft: ${score} von ${maxScore} Punkten.`}
        </div>
      )}
    </section>
  );
}
