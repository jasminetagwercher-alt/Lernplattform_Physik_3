import { useMemo, useState } from "react";

export type ImageHotspot = {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
};

export function ImageHotspotGame({
  title,
  prompt,
  imageSrc,
  imageAlt,
  hotspots,
}: {
  title: string;
  prompt: string;
  imageSrc: string;
  imageAlt: string;
  hotspots: ImageHotspot[];
}) {
  const target = useMemo(
    () => hotspots[Math.floor(Math.random() * hotspots.length)],
    [hotspots],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <section className="game-card">
      <div className="eyebrow">Bild-Hotspot</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt.replace("{target}", target.label)}</p>

      <div className="image-hotspot-stage">
        <img src={imageSrc} alt={imageAlt} />
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            aria-label={spot.label}
            className={`image-hotspot ${selected === spot.id ? "selected" : ""}`}
            style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
            onClick={() => {
              setSelected(spot.id);
              setChecked(false);
            }}
          />
        ))}
      </div>

      <div className="game-actions">
        <button className="primary-button" disabled={!selected} onClick={() => setChecked(true)}>
          Position prüfen
        </button>
      </div>

      {checked && (
        <div className={selected === target.id ? "feedback correct" : "feedback hint"}>
          {selected === target.id
            ? `Richtig: ${target.label}.`
            : "Diese Stelle passt noch nicht. Schau dir die Grafik noch einmal genau an."}
        </div>
      )}
    </section>
  );
}
