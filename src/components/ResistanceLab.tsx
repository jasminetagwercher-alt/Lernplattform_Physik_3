import { useMemo, useState } from "react";

type Measurement = {
  id: number;
  voltage: number;
  resistance: number;
  current: number;
};

export function ResistanceLab() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const current = useMemo(() => voltage / resistance, [voltage, resistance]);
  const electronCount = Math.max(2, Math.min(18, Math.round(current * 2)));

  function recordMeasurement() {
    setMeasurements((rows) => [
      ...rows,
      {
        id: Date.now(),
        voltage,
        resistance,
        current,
      },
    ].slice(-8));
  }

  return (
    <section className="lab-card">
      <div className="eyebrow">Virtuelles Experiment</div>
      <h2>Widerstands-Labor</h2>
      <p className="lead">
        Verändere Spannung und Widerstand, lies die Stromstärke ab und speichere eigene Messreihen.
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
            Die Animation visualisiert: Bei größerer Stromstärke passieren in derselben Zeit mehr
            Elektronen den markierten Leiterquerschnitt.
          </p>
        </div>
      </div>

      <div className="lab-challenge">
        <strong>Forscherauftrag</strong>
        <span>
          1. Halte U gleich und erhöhe R schrittweise. Speichere mindestens drei Messwerte.
          2. Halte danach R gleich und verändere U. Vergleiche beide Messreihen.
        </span>
      </div>

      <div className="measurement-section">
        <div className="measurement-heading">
          <div>
            <div className="eyebrow">Messprotokoll</div>
            <h3>Deine Messwerte</h3>
          </div>
          {measurements.length > 0 && (
            <button className="text-button" onClick={() => setMeasurements([])}>
              Tabelle leeren
            </button>
          )}
        </div>

        {measurements.length === 0 ? (
          <div className="empty-measurements">
            Noch keine Messung gespeichert. Stelle die Regler ein und nimm deinen ersten Messwert auf.
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
