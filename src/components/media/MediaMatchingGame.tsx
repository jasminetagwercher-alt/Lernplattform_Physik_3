import { useMemo, useState } from "react";
import { MediaCard, type MediaItem } from "./MediaCard";

export type MediaMatchPair = {
  id: string;
  left: MediaItem;
  right: MediaItem;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MediaMatchingGame({
  title,
  prompt,
  pairs,
}: {
  title: string;
  prompt: string;
  pairs: MediaMatchPair[];
}) {
  const left = useMemo(() => shuffle(pairs), [pairs]);
  const right = useMemo(() => shuffle(pairs), [pairs]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);

  function tryMatch(nextLeft: string | null, nextRight: string | null) {
    if (!nextLeft || !nextRight) return;
    if (nextLeft === nextRight) {
      setMatched((items) => [...items, nextLeft]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMiss(false);
    } else {
      setMiss(true);
      window.setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMiss(false);
      }, 700);
    }
  }

  function chooseLeft(id: string) {
    if (matched.includes(id)) return;
    setSelectedLeft(id);
    tryMatch(id, selectedRight);
  }

  function chooseRight(id: string) {
    if (matched.includes(id)) return;
    setSelectedRight(id);
    tryMatch(selectedLeft, id);
  }

  return (
    <section className="game-card">
      <div className="eyebrow">Medien-Zuordnung</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className={`media-match-layout ${miss ? "miss" : ""}`}>
        <div className="media-match-column">
          {left.map((pair) => (
            <MediaCard
              key={pair.id}
              item={pair.left}
              selected={selectedLeft === pair.id}
              matched={matched.includes(pair.id)}
              onClick={() => chooseLeft(pair.id)}
            />
          ))}
        </div>
        <div className="media-match-column">
          {right.map((pair) => (
            <MediaCard
              key={pair.id}
              item={pair.right}
              selected={selectedRight === pair.id}
              matched={matched.includes(pair.id)}
              onClick={() => chooseRight(pair.id)}
            />
          ))}
        </div>
      </div>

      {matched.length === pairs.length && <div className="feedback correct">Alle Zuordnungen stimmen.</div>}
    </section>
  );
}
