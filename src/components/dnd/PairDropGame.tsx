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
}: {
  title: string;
  prompt: string;
  pairs: DropPair[];
}) {
  const bank = useMemo(() => shuffle(pairs), [pairs]);
  const targets = useMemo(() => shuffle(pairs), [pairs]);
  const [matched, setMatched] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);

  function attempt(tileId: string, targetId: string) {
    const pairId = tileId.replace("tile:", "");
    const targetPairId = targetId.replace("target:", "");

    if (pairId === targetPairId) {
      setMatched((current) => current.includes(pairId) ? current : [...current, pairId]);
      setSelected(null);
      setWrongTarget(null);
      return;
    }

    setWrongTarget(targetPairId);
    window.setTimeout(() => setWrongTarget(null), 650);
  }

  function chooseTile(id: string) {
    if (matched.includes(id)) return;
    setSelected(selected === id ? null : id);
  }

  function chooseTarget(id: string) {
    if (!selected) return;
    attempt(`tile:${selected}`, `target:${id}`);
  }

  return (
    <section className="game-card dnd-game">
      <div className="eyebrow">Paare zuordnen</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={attempt}>
        <div className="dnd-bank" aria-label="Kacheln">
          {bank.map((pair) => !matched.includes(pair.id) && (
            <DraggableMediaTile
              key={pair.id}
              id={`tile:${pair.id}`}
              item={pair.tile}
              selected={selected === pair.id}
              onClick={() => chooseTile(pair.id)}
            />
          ))}
          {matched.length === pairs.length && (
            <div className="dnd-bank-complete">Alle Kacheln sind zugeordnet.</div>
          )}
        </div>

        <div className="pair-target-grid">
          {targets.map((pair) => (
            <DroppableZone
              key={pair.id}
              id={`target:${pair.id}`}
              title={pair.targetTitle}
              active={selected !== null}
              success={matched.includes(pair.id)}
              error={wrongTarget === pair.id}
              onClick={() => chooseTarget(pair.id)}
            >
              <div className="drop-target-media">
                {pair.target.kind === "symbol" && <span className="target-symbol">{pair.target.symbol}</span>}
                {pair.target.kind === "text" && <span>{pair.target.text}</span>}
                {pair.target.kind === "image" && <img src={pair.target.src} alt={pair.target.alt} />}
                {matched.includes(pair.id) && <span className="drop-check">✓</span>}
              </div>
            </DroppableZone>
          ))}
        </div>
      </PointerDragProvider>

      <div className="dnd-help">Kachel ziehen oder antippen und anschließend ein Ziel wählen.</div>
      {matched.length === pairs.length && <div className="feedback correct">Alle Paare stimmen.</div>}
    </section>
  );
}
