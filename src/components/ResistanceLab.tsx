import { useMemo, useState } from "react";
import { MeasurementChart } from "./MeasurementChart";
import { DigitalMeter } from "./lab/DigitalMeter";
import { LabSlider } from "./lab/LabSlider";
import { MeasurementTable } from "./lab/MeasurementTable";
import { ResearchTask } from "./lab/ResearchTask";

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
          <LabSlider
            label="Spannung"
            symbol="U"
            value={voltage}
            unit="V"
            min={4}
            max={24}
            disabled={mode === "vary-resistance"}
            onChange={setVoltage}
          />

          <LabSlider
            label="Widerstand"
            symbol="R"
            value={resistance}
            unit="Ω"
            min={2}
            max={12}
            disabled={mode === "vary-voltage"}
            onChange={setResistance}
          />

          <DigitalMeter
            label="berechnete Stromstärke"
            value={`${current.toFixed(2)} A`}
            formula="I = U / R"
          />

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

      <ResearchTask>
        {mode === "vary-resistance"
          ? "Verändere R schrittweise und speichere mindestens vier Messwerte. Was geschieht mit I, wenn R größer wird?"
          : "Verändere U schrittweise und speichere mindestens vier Messwerte. Vergleiche die Stromstärken bei gleichem R."}
      </ResearchTask>

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

        <MeasurementTable
          rows={measurements}
          emptyText="Noch keine Messung gespeichert. Stelle den aktiven Regler ein und nimm deinen ersten Messwert auf."
          columns={[
            { key: "u", label: "U", render: (row) => `${row.voltage} V` },
            { key: "r", label: "R", render: (row) => `${row.resistance} Ω` },
            { key: "i", label: "I", render: (row) => `${row.current.toFixed(2)} A` },
          ]}
        />

        {measurements.length > 0 && (
          <div className="chart-section">
            <div>
              <div className="eyebrow">Diagramm</div>
              <h3>
                {mode === "vary-resistance"
                  ? "Stromstärke in Abhängigkeit von R"
                  : "Stromstärke in Abhängigkeit von U"}
              </h3>
            </div>
            <MeasurementChart
              points={chartPoints}
              xLabel={mode === "vary-resistance" ? "R (Ω)" : "U (V)"}
              yLabel="I (A)"
            />
          </div>
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
