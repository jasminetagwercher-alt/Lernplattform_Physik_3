import { useMemo, useState } from "react";

type ComponentKey = "source" | "wire" | "device" | "switch" | "ampere" | "meter";

type Part = {
  id: ComponentKey;
  label: string;
  icon: string;
};

const parts: Part[] = [
  { id: "source", label: "Spannungsquelle", icon: "▮▯" },
  { id: "wire", label: "Stromleitung", icon: "━" },
  { id: "device", label: "Elektrogerät", icon: "◉" },
  { id: "switch", label: "Schalter", icon: "⌁" },
  { id: "ampere", label: "Ampere (A)", icon: "A" },
  { id: "meter", label: "Amperemeter", icon: "ⓐ" },
];

const required: ComponentKey[] = ["source", "wire", "device", "switch"];

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function CircuitBuilder() {
  const bank = useMemo(() => shuffle(parts), []);
  const [placed, setPlaced] = useState<ComponentKey[]>([]);
  const [switchClosed, setSwitchClosed] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "hint" | "correct">("idle");
  const [selected, setSelected] = useState<ComponentKey | null>(null);

  const complete = required.every((id) => placed.includes(id)) && placed.length === required.length;
  const currentFlows = complete && switchClosed;

  function addPart(id: ComponentKey) {
    if (placed.includes(id)) return;
    if (placed.length >= 4) return;
    setPlaced((items) => [...items, id]);
    setSelected(null);
    setFeedback("idle");
  }

  function removePart(id: ComponentKey) {
    setPlaced((items) => items.filter((item) => item !== id));
    setFeedback("idle");
    setSwitchClosed(false);
  }

  function dropPart(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") as ComponentKey;
    if (id) addPart(id);
  }

  function check() {
    if (complete) {
      setFeedback("correct");
      return;
    }
    setFeedback("hint");
  }

  return (
    <section className="game-card circuit-builder">
      <div className="eyebrow">Circuit Builder</div>
      <h2>Baue einen einfachen Stromkreis.</h2>
      <p className="lead compact">
        Ziehe genau die vier Bestandteile des einfachen Stromkreises auf die Arbeitsfläche.
        Danach kannst du den Schalter öffnen und schließen.
      </p>

      <div className="parts-bank">
        {bank.map((part) => (
          <button
            key={part.id}
            draggable
            className={`part-card ${selected === part.id ? "selected" : ""} ${placed.includes(part.id) ? "used" : ""}`}
            onDragStart={(event) => event.dataTransfer.setData("text/plain", part.id)}
            onClick={() => {
              setSelected(part.id);
              addPart(part.id);
            }}
          >
            <span>{part.icon}</span>
            <strong>{part.label}</strong>
          </button>
        ))}
      </div>

      <div
        className={`circuit-stage ${complete ? "complete" : ""} ${currentFlows ? "active" : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={dropPart}
      >
        <div className="circuit-loop">
          <div className="circuit-wire top" />
          <div className="circuit-wire right" />
          <div className="circuit-wire bottom" />
          <div className="circuit-wire left" />

          {currentFlows &&
            Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className="circuit-electron"
                style={{ animationDelay: `${-(index * 0.34)}s` }}
              />
            ))}

          <div className="circuit-slots">
            {placed.length === 0 && (
              <div className="drop-hint">Bauteile hierher ziehen oder oben anklicken</div>
            )}
            {placed.map((id) => {
              const part = parts.find((item) => item.id === id)!;
              return (
                <button key={id} className="placed-part" onClick={() => removePart(id)}>
                  <span>{part.icon}</span>
                  <strong>{part.label}</strong>
                  <small>entfernen ×</small>
                </button>
              );
            })}
          </div>

          {complete && (
            <button
              className={`switch-toggle ${switchClosed ? "closed" : ""}`}
              onClick={() => setSwitchClosed((value) => !value)}
            >
              Schalter {switchClosed ? "geschlossen" : "offen"}
            </button>
          )}
        </div>
      </div>

      {complete && (
        <div className="circuit-observation">
          <strong>Beobachtung:</strong>
          <span>
            {switchClosed
              ? "Der Stromkreis ist geschlossen. Die Elektronenbewegung wird als laufende Punkte dargestellt."
              : "Der Schalter ist offen. Schließe ihn und beobachte die Darstellung."}
          </span>
        </div>
      )}

      {feedback !== "idle" && (
        <div className={`feedback ${feedback === "correct" ? "correct" : "hint"}`}>
          {feedback === "correct"
            ? "Richtig: Spannungsquelle, Stromleitungen, Elektrogerät und Schalter gehören zum einfachen Stromkreis."
            : "Hinweis: Gesucht sind Bauteile des Stromkreises. Einheit und Messgerät der Stromstärke gehören nicht zu dieser Vierergruppe."}
        </div>
      )}

      <div className="game-actions">
        <button className="primary-button" onClick={check}>Aufbau prüfen</button>
      </div>

      <details className="teacher-note">
        <summary>Fachliche Grundlage</summary>
        <p>P3-K3-S044-M02 · P3-K3-S045-M01 · P3-KOMP-039</p>
      </details>
    </section>
  );
}
