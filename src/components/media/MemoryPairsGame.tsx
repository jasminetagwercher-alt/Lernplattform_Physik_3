import { useMemo, useState } from "react";
import { MediaCard, type MediaItem } from "./MediaCard";

export type MemoryPair = {
  id: string;
  a: MediaItem;
  b: MediaItem;
};

type Card = {
  cardId: string;
  pairId: string;
  item: MediaItem;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MemoryPairsGame({
  title,
  prompt,
  pairs,
}: {
  title: string;
  prompt: string;
  pairs: MemoryPair[];
}) {
  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        pairs.flatMap((pair) => [
          { cardId: `${pair.id}-a`, pairId: pair.id, item: pair.a },
          { cardId: `${pair.id}-b`, pairId: pair.id, item: pair.b },
        ]),
      ),
    [pairs],
  );

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  function choose(card: Card) {
    if (open.includes(card.cardId) || matched.includes(card.pairId) || open.length >= 2) return;

    const next = [...open, card.cardId];
    setOpen(next);

    if (next.length === 2) {
      setMoves((value) => value + 1);
      const first = cards.find((item) => item.cardId === next[0])!;
      const second = cards.find((item) => item.cardId === next[1])!;
      if (first.pairId === second.pairId) {
        setMatched((items) => [...items, first.pairId]);
        window.setTimeout(() => setOpen([]), 500);
      } else {
        window.setTimeout(() => setOpen([]), 900);
      }
    }
  }

  const done = matched.length === pairs.length;

  return (
    <section className="game-card">
      <div className="eyebrow">Paare / Memory</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>
      <div className="memory-status">
        <span>{matched.length}/{pairs.length} Paare</span>
        <span>{moves} Versuche</span>
      </div>

      <div className="memory-grid">
        {cards.map((card) => {
          const visible = open.includes(card.cardId) || matched.includes(card.pairId);
          return (
            <div key={card.cardId} className="memory-cell">
              {visible ? (
                <MediaCard item={card.item} matched={matched.includes(card.pairId)} onClick={() => choose(card)} />
              ) : (
                <button className="memory-back" onClick={() => choose(card)} aria-label="Karte umdrehen">
                  <span>Φ</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {done && <div className="feedback correct">Alle Paare gefunden.</div>}
    </section>
  );
}
