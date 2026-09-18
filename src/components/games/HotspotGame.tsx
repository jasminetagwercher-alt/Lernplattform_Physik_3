import { useMemo, useState } from "react";

type Target = "source" | "device" | "switch" | "wire";

type Hotspot = {
  id: Target;
  label: string;
  x: number;
  y: number;
};

const hotspots: Hotspot[] = [
  { id: "source", label: "Spannungsquelle", x: 17, y: 52 },
  { id: "device", label: "Elektrogerät", x: 82, y: 52 },
  { id: "switch", label: "Schalter", x: 52, y: 20 },
  { id: "wire", label: "Stromleitung", x: 52, y: 82 },
];

export function HotspotGame() {
  const target = useMemo(() => hotspots[Math.floor(Math.random() * hotspots.length)], []);
  const [selected, setSelected] = useState<Target | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "hint" | "correct" | "solution">("idle");

  function choose(id: Target) {
    if (state === "correct" || state === "solution") return;
    setSelected(id);
  }

  function check() {
    const ok = selected === target.id;
    const next = attempts + 1;
    setAttempts(next);
    if (ok) setState("correct");
    else if (next === 1) setState("hint");
    else {
      setSelected(target.id);
      setState("solution");
    }
  }

  return (
    <section className="game-card">
      <div className="eyebrow">Hotspot</div>
      <h2>Finde: {target.label}</h2>
      <p className="lead compact">
        Klicke im vereinfachten Stromkreis auf den passenden Bereich.
      </p>

      <div className="hotspot-stage" role="group" aria-label="Vereinfachter Stromkreis">
        <svg viewBox="0 0 800 360" aria-hidden="true">
          <path d="M140 180 H335 M465 180 H660" className="diagram-wire" />
          <path d="M140 180 V285 H660 V180" className="diagram-wire" />
          <path d="M335 180 Q400 80 465 180" className="diagram-wire" />
          <line x1="116" y1="150" x2="116" y2="210" className="battery-line" />
          <line x1="142" y1="162" x2="142" y2="198" className="battery-line short" />
          <circle cx="660" cy="180" r="42" className="lamp-circle" />
          <path d="M635 155 L685 205 M685 155 L635 205" className="lamp-cross" />
          <circle cx="335" cy="180" r="7" className="switch-node" />
          <circle cx="465" cy="180" r="7" className="switch-node" />
        </svg>

        {hotspots.map((spot) => (
          <button
            key={spot.id}
            className={`hotspot ${selected === spot.id ? "selected" : ""} ${state === "solution" && target.id === spot.id ? "solution" : ""}`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            aria-label={spot.label}
            onClick={() => choose(spot.id)}
          >
            <span />
          </button>
        ))}
      </div>

      {state !== "idle" && (
        <div className={`feedback ${state}`}>
          {state === "hint" && "Hinweis: Orientiere dich an der Funktion und Form des gesuchten Bestandteils."}
          {state === "correct" && `Richtig: Du hast ${target.label} gefunden.`}
          {state === "solution" && `Die richtige Position für „${target.label}“ ist markiert.`}
        </div>
      )}

      <div className="game-actions">
        <button className="primary-button" onClick={check}>Position prüfen</button>
      </div>

      <details className="teacher-note">
        <summary>Fachliche Grundlage</summary>
        <p>P3-K3-S044-M02</p>
      </details>
    </section>
  );
}
