import { useMemo, useState } from "react";
import { MeasurementChart } from "./MeasurementChart";

type Measurement = {
  id: number;
  voltage: number;
  resistance: number;
  current: number;
};

type Mode = "vary-resistance" | "vary-voltage";

export function ResistanceLab() {
  const [mode, setMode] = useState<Mode>("vary-resistance");
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const current = useMemo(() => voltage / resistance, [voltage, resistance]);
  const electronCount = Math.max(2, Math.min(18, Math.round(current * 2)));

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setMeasurements([]);
    if (nextMode === "vary-resistance") {
      setVoltage(12);
      setResistance(4);
    } else {
      setResistance(4);
      setVoltage(12);
    }
  }

  function recordMeasurement() {
    setMeasurements((rows) =>
      [
        ...rows,
        {
          id: Date.now(),
          voltage,
          resistance,
          current,
        },
      ].slice(-10),
    );
  }

  const chartPoints = measurements.map((row) => ({
    x: mode === "vary-resistance" ? row.resistance : row.voltage,
    y: row.current,
  }));

  return (
    <section className="lab-card">
      <div className="eyebrow">Virtuelles Experiment</div>
      <h2>Widerstands-Labor</h2>
      <p className="lead">
        Führe eine kontrollierte Messreihe durch: Eine Größe bleibt konstant, die andere wird
        verändert. Lies die Stromstärke ab, speichere Messwerte und untersuche das Diagramm.
      </p>

      <div className="experiment-mode">
        <button
          className={mode === "vary-resistance" ? "selected" : ""}
          onClick={() => selectMode("vary-resistance")}
        >
          Versuch A · R verändern
          <small>U bleibt bei 12 V konstant</small>
        </button>
        <button
          className={mode === "vary-voltage" ? "selected" : ""}
          onClick={() => selectMode("vary-voltage")}
        >
          Versuch B · U verändern
          <small>R bleibt bei 4 Ω konstant</small>
        </button>
      </div>

      <div className="lab-layout">
        <div className="controls">
          <label className={mode === "vary-resistance" ? "locked-control" : ""}>
            <span>Spannung U {mode === "vary-resistance" && "· konstant"}</span>
            <strong>{voltage} V</strong>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={voltage}
              disabled={mode === "vary-resistance"}
              onChange={(event) => setVoltage(Number(event.target.value))}
            />
          </label>

          <label className={mode === "vary-voltage" ? "locked-control" : ""}>
            <span>Widerstand R {mode === "vary-voltage" && "· konstant"}</span>
            <strong>{resistance} Ω</strong>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={resistance}
              disabled={mode === "vary-voltage"}
              onChange={(event) => setResistance(Number(event.target.value))}
            />
          </label>

          <div className="meter">
            <span>berechnete Stromstärke</span>
            <strong>{current.toFixed(2)} A</strong>
            <small>I = U / R</small>
          </div>

          <button className="primary-button measure-button" onClick={recordMeasurement}>
            Messwert aufnehmen
          </button>
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
            Die Animation visualisiert die Definition der Stromstärke: Bei größerer Stromstärke
            passieren in derselben Zeit mehr Elektronen den markierten Leiterquerschnitt.
          </p>
        </div>
      </div>

      <div className="lab-challenge">
        <strong>Forscherauftrag</strong>
        <span>
          {mode === "vary-resistance"
            ? "Verändere R schrittweise und speichere mindestens vier Messwerte. Was geschieht mit I, wenn R größer wird?"
            : "Verändere U schrittweise und speichere mindestens vier Messwerte. Vergleiche die Stromstärken bei gleichem R."}
        </span>
      </div>

      <div className="measurement-section">
        <div className="measurement-heading">
          <div>
            <div className="eyebrow">Messprotokoll</div>
            <h3>Deine Messreihe</h3>
          </div>
          {measurements.length > 0 && (
            <button className="text-button" onClick={() => setMeasurements([])}>
              Messreihe löschen
            </button>
          )}
        </div>

        {measurements.length === 0 ? (
          <div className="empty-measurements">
            Noch keine Messung gespeichert. Stelle den aktiven Regler ein und nimm deinen ersten
            Messwert auf.
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="measurement-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>U</th>
                    <th>R</th>
                    <th>I</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.voltage} V</td>
                      <td>{row.resistance} Ω</td>
                      <td>{row.current.toFixed(2)} A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="chart-section">
              <div>
                <div className="eyebrow">Diagramm</div>
                <h3>
                  {mode === "vary-resistance" ? "Stromstärke in Abhängigkeit von R" : "Stromstärke in Abhängigkeit von U"}
                </h3>
              </div>
              <MeasurementChart
                points={chartPoints}
                xLabel={mode === "vary-resistance" ? "R (Ω)" : "U (V)"}
                yLabel="I (A)"
              />
            </div>
          </>
        )}
      </div>

      <details className="teacher-note">
        <summary>Fachliche Grundlage</summary>
        <p>
          Quellen: P3-FD-038, P3-K3-S048-M02 und P3-K3-S046-M02. Die Animation visualisiert
          freigegebene Beziehungen; sie führt kein zusätzliches Teilchenmodell ein.
        </p>
      </details>
    </section>
  );
}
