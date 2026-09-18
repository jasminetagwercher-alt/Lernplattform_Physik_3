import { useMemo, useState } from "react";

export function ResistanceLab() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);

  const current = useMemo(() => voltage / resistance, [voltage, resistance]);
  const electronCount = Math.max(2, Math.min(18, Math.round(current * 2)));

  return (
    <section className="lab-card">
      <div className="eyebrow">Virtuelles Experiment</div>
      <h2>Widerstands-Labor</h2>
      <p className="lead">
        Verändere Spannung und Widerstand. Beobachte, wie sich die berechnete Stromstärke verändert.
        Grundlage ist der Zusammenhang <strong>R = U / I</strong>.
      </p>

      <div className="lab-layout">
        <div className="controls">
          <label>
            <span>Spannung U</span>
            <strong>{voltage} V</strong>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={voltage}
              onChange={(event) => setVoltage(Number(event.target.value))}
            />
          </label>

          <label>
            <span>Widerstand R</span>
            <strong>{resistance} Ω</strong>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={resistance}
              onChange={(event) => setResistance(Number(event.target.value))}
            />
          </label>

          <div className="meter">
            <span>berechnete Stromstärke</span>
            <strong>{current.toFixed(2)} A</strong>
            <small>I = U / R</small>
          </div>
        </div>

        <div className="simulation-panel">
          <div className="wire">
            <div className="cross-section" />
            {Array.from({ length: electronCount }, (_, index) => (
              <span
                key={index}
                className="moving-electron"
                style={{
                  top: `${18 + (index % 4) * 18}%`,
                  animationDelay: `${-(index * 0.24)}s`,
                  animationDuration: `${Math.max(0.8, 3.3 - current * 0.18)}s`,
                }}
              />
            ))}
          </div>
          <p>
            Mehr angezeigte Elektronen passieren den markierten Querschnitt in derselben Zeit, wenn
            die Stromstärke größer ist.
          </p>
        </div>
      </div>

      <div className="lab-challenge">
        <strong>Forscherauftrag</strong>
        <span>
          Halte U gleich und erhöhe R. Was beobachtest du bei I? Danach halte R gleich und erhöhe U.
        </span>
      </div>

      <details className="teacher-note">
        <summary>Fachliche Grundlage</summary>
        <p>
          Quellen: P3-FD-038, P3-K3-S048-M02 und P3-K3-S046-M02. Die Animation ist eine
          Visualisierung der freigegebenen Beziehungen, kein zusätzliches Teilchenmodell.
        </p>
      </details>
    </section>
  );
}
