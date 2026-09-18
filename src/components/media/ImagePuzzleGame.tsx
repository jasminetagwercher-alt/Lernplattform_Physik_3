import { useMemo, useState } from "react";

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function ImagePuzzleGame({
  title,
  prompt,
  imageSrc,
  imageAlt,
  columns = 3,
  rows = 3,
}: {
  title: string;
  prompt: string;
  imageSrc: string;
  imageAlt: string;
  columns?: number;
  rows?: number;
}) {
  const count = columns * rows;
  const initial = useMemo(() => shuffle(Array.from({ length: count }, (_, index) => index)), [count]);
  const [order, setOrder] = useState(initial);
  const [selected, setSelected] = useState<number | null>(null);

  function choose(index: number) {
    if (selected === null) {
      setSelected(index);
      return;
    }
    setOrder((current) => {
      const next = [...current];
      [next[selected], next[index]] = [next[index], next[selected]];
      return next;
    });
    setSelected(null);
  }

  const done = order.every((value, index) => value === index);

  return (
    <section className="game-card">
      <div className="eyebrow">Bild-Puzzle</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div
        className="image-puzzle"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        role="img"
        aria-label={imageAlt}
      >
        {order.map((sourceIndex, positionIndex) => {
          const x = sourceIndex % columns;
          const y = Math.floor(sourceIndex / columns);
          return (
            <button
              key={positionIndex}
              className={`puzzle-tile ${selected === positionIndex ? "selected" : ""}`}
              style={{
                backgroundImage: `url("${imageSrc}")`,
                backgroundSize: `${columns * 100}% ${rows * 100}%`,
                backgroundPosition: `${(x / Math.max(columns - 1, 1)) * 100}% ${(y / Math.max(rows - 1, 1)) * 100}%`,
              }}
              onClick={() => choose(positionIndex)}
              aria-label={`Puzzleteil ${positionIndex + 1}`}
            />
          );
        })}
      </div>

      {done && <div className="feedback correct">Das Bild ist vollständig zusammengesetzt.</div>}
    </section>
  );
}
