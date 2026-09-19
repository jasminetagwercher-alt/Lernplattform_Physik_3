import { useMemo, useRef, useState } from "react";
import type { AssessmentResult } from "./assessment/useScoredAssessment";
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
type Prediction = "larger" | "smaller" | "same";

export function ResistanceLab({ onComplete }: { onComplete?: (result: AssessmentResult) => void }) {
  const [mode, setMode] = useState<Mode>("vary-resistance");
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [conclusion, setConclusion] = useState<Prediction | null>(null);
  const [conclusionAttempts, setConclusionAttempts] = useState(0);
  const [conclusionPoints, setConclusionPoints] = useState(3);
  const [conclusionSolved, setConclusionSolved] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);
  const [measurementMessage, setMeasurementMessage] = useState("");
  const reported = useRef(false);

  const current = useMemo(() => voltage / resistance, [voltage, resistance]);
  const electronCount = Math.max(2, Math.min(18, Math.round(current * 2)));

  const correctConclusion: Prediction = mode === "vary-resistance" ? "smaller" : "larger";
  const uniqueMeasurements = new Set(
    measurements.map((row) => mode === "vary-resistance" ? row.resistance : row.voltage),
  ).size;
  const enoughMeasurements = uniqueMeasurements >= 4;

  function resetInvestigation(nextMode = mode) {
    setMeasurements([]);
    setPrediction(null);
    setConclusion(null);
    setConclusionAttempts(0);
    setConclusionPoints(3);
    setConclusionSolved(false);
    setSolutionShown(false);
    setMeasurementMessage("");

    if (nextMode === "vary-resistance") {
      setVoltage(12);
      setResistance(4);
    } else {
      setResistance(4);
      setVoltage(12);
    }
  }

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    resetInvestigation(nextMode);
  }

  function recordMeasurement() {
    if (!prediction) {
      setMeasurementMessage("Gib zuerst deine Vermutung ab.");
      return;
    }

    const duplicate = measurements.some((row) =>
      mode === "vary-resistance"
        ? row.resistance === resistance
        : row.voltage === voltage,
    );

    if (duplicate) {
      setMeasurementMessage("Diesen Wert hast du schon gemessen. Verändere den Regler.");
      return;
    }

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
    setMeasurementMessage("Messwert gespeichert.");
  }

  function checkConclusion() {
    if (!conclusion || !enoughMeasurements || conclusionSolved) return;

    setConclusionAttempts((value) => value + 1);

    if (conclusion === correctConclusion) {
      setConclusionSolved(true);
      if (!reported.current) {
        reported.current = true;
        onComplete?.({
          score: conclusionPoints,
          maxScore: 3,
          attempts: conclusionAttempts + 1,
          usedSolution: false,
        });
      }
      return;
    }

    setConclusionPoints((value) => Math.max(0, value - 1));
  }

  function revealConclusion() {
    setConclusion(correctConclusion);
    setConclusionPoints(0);
    setConclusionSolved(true);
    setSolutionShown(true);
    if (!reported.current) {
      reported.current = true;
      onComplete?.({
        score: 0,
        maxScore: 3,
        attempts: conclusionAttempts,
        usedSolution: true,
      });
    }
  }

  const chartPoints = [...measurements]
    .sort((a, b) =>
      mode === "vary-resistance"
        ? a.resistance - b.resistance
        : a.voltage - b.voltage,
    )
    .map((row) => ({
      x: mode === "vary-resistance" ? row.resistance : row.voltage,
      y: row.current,
    }));

  const predictionLabel = prediction
    ? prediction === "larger"
      ? "I wird größer"
      : prediction === "smaller"
        ? "I wird kleiner"
        : "I bleibt gleich"
    : "noch keine Vermutung";

  const observedLabel =
    correctConclusion === "larger" ? "I wird größer" : "I wird kleiner";

  return (
    <section className="lab-card investigation-lab">
      <div className="eyebrow">Experiment</div>
      <h2>Widerstands-Labor</h2>
      <p className="lead">
        Stelle zuerst eine Vermutung auf. Führe danach eine Messreihe durch und entscheide erst
        anhand deiner Daten, welche Schlussfolgerung passt.
      </p>

      <div className="investigation-steps" aria-label="Versuchsablauf">
        <span className={prediction ? "done" : "active"}>1 · Vermuten</span>
        <span className={enoughMeasurements ? "done" : prediction ? "active" : ""}>2 · Messen</span>
        <span className={conclusionSolved ? "done" : enoughMeasurements ? "active" : ""}>3 · Auswerten</span>
      </div>

      <div className="experiment-mode">
        <button
          className={mode === "vary-resistance" ? "selected" : ""}
          onClick={() => selectMode("vary-resistance")}
        >
          Versuch A · Widerstand verändern
          <small>Die Spannung bleibt bei 12 V konstant.</small>
        </button>
        <button
          className={mode === "vary-voltage" ? "selected" : ""}
          onClick={() => selectMode("vary-voltage")}
        >
          Versuch B · Spannung verändern
          <small>Der Widerstand bleibt bei 4 Ω konstant.</small>
        </button>
      </div>

      <section className="prediction-panel">
        <div className="step-number">1</div>
        <div>
          <div className="eyebrow">Deine Vermutung</div>
          <h3>
            {mode === "vary-resistance"
              ? "Was passiert mit der Stromstärke I, wenn R größer wird?"
              : "Was passiert mit der Stromstärke I, wenn U größer wird und R gleich bleibt?"}
          </h3>
          <div className="prediction-grid">
            {[
              ["larger", "I wird größer"],
              ["smaller", "I wird kleiner"],
              ["same", "I bleibt gleich"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={prediction === id ? "prediction-tile selected" : "prediction-tile"}
                onClick={() => {
                  setPrediction(id as Prediction);
                  setMeasurementMessage("");
                }}
                disabled={measurements.length > 0}
              >
                {label}
              </button>
            ))}
          </div>
          {measurements.length > 0 && (
            <p className="locked-choice">Deine Vermutung bleibt während der Messung gespeichert.</p>
          )}
        </div>
      </section>

      <section className={prediction ? "experiment-workspace" : "experiment-workspace locked"}>
        {!prediction && <div className="workspace-lock">Erst Vermutung wählen, dann experimentieren.</div>}

        <div className="lab-layout">
          <div className="controls">
            <LabSlider
              label="Spannung"
              symbol="U"
              value={voltage}
              unit="V"
              min={4}
              max={24}
              disabled={!prediction || mode === "vary-resistance"}
              onChange={(value) => {
                setVoltage(value);
                setMeasurementMessage("");
              }}
            />

            <LabSlider
              label="Widerstand"
              symbol="R"
              value={resistance}
              unit="Ω"
              min={2}
              max={12}
              disabled={!prediction || mode === "vary-voltage"}
              onChange={(value) => {
                setResistance(value);
                setMeasurementMessage("");
              }}
            />

            <DigitalMeter
              label="Stromstärke"
              value={current.toFixed(2) + " A"}
              formula="I = U / R"
            />

            <button
              className="primary-button measure-button"
              onClick={recordMeasurement}
              disabled={!prediction}
            >
              Messwert aufnehmen
            </button>
            {measurementMessage && <div className="measurement-message">{measurementMessage}</div>}
          </div>

          <div className="simulation-panel">
            <div className="wire">
              <div className="cross-section" />
              {Array.from({ length: electronCount }, (_, index) => (
                <span
                  key={index}
                  className="moving-electron"
                  style={{
                    top: String(18 + (index % 4) * 18) + "%",
                    animationDelay: String(-(index * 0.24)) + "s",
                    animationDuration: String(Math.max(0.8, 3.3 - current * 0.18)) + "s",
                  }}
                />
              ))}
            </div>
            <p>
              Beobachte Messwert und Darstellung. Entscheidend für deine Auswertung sind die
              gespeicherten Messwerte.
            </p>
          </div>
        </div>
      </section>

      <ResearchTask>
        {mode === "vary-resistance"
          ? "Nimm mindestens vier Messwerte bei verschiedenen Widerständen auf. Die Spannung bleibt gleich."
          : "Nimm mindestens vier Messwerte bei verschiedenen Spannungen auf. Der Widerstand bleibt gleich."}
      </ResearchTask>

      <div className="measurement-section">
        <div className="measurement-heading">
          <div>
            <div className="eyebrow">Schritt 2 · Messreihe</div>
            <h3>{uniqueMeasurements}/4 verschiedene Messwerte</h3>
          </div>
          {measurements.length > 0 && (
            <button className="text-button" onClick={() => {
              setMeasurements([]);
              setConclusion(null);
              setConclusionAttempts(0);
              setConclusionPoints(3);
              setConclusionSolved(false);
              setSolutionShown(false);
              setMeasurementMessage("");
            }}>
              Messreihe löschen
            </button>
          )}
        </div>

        <MeasurementTable
          rows={measurements}
          emptyText="Noch keine Messung gespeichert."
          columns={[
            { key: "u", label: "U", render: (row) => String(row.voltage) + " V" },
            { key: "r", label: "R", render: (row) => String(row.resistance) + " Ω" },
            { key: "i", label: "I", render: (row) => row.current.toFixed(2) + " A" },
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

      <section className={enoughMeasurements ? "conclusion-panel ready" : "conclusion-panel"}>
        <div className="task-topline">
          <div>
            <div className="eyebrow">Schritt 3 · Auswertung</div>
            <h3>Welche Schlussfolgerung passt zu deiner Messreihe?</h3>
          </div>
          <div className="score-box">
            <strong>{conclusionSolved ? conclusionPoints : 0}/3</strong>
            <span>Punkte</span>
          </div>
        </div>

        {!enoughMeasurements ? (
          <div className="conclusion-lock">
            Es fehlen noch {Math.max(0, 4 - uniqueMeasurements)} verschiedene Messwerte.
          </div>
        ) : (
          <>
            <div className="prediction-grid">
              {[
                ["larger", mode === "vary-resistance" ? "Mit größerem R wird I größer." : "Mit größerem U wird I größer."],
                ["smaller", mode === "vary-resistance" ? "Mit größerem R wird I kleiner." : "Mit größerem U wird I kleiner."],
                ["same", mode === "vary-resistance" ? "R verändert I nicht." : "U verändert I nicht."],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={conclusion === id ? "prediction-tile selected" : "prediction-tile"}
                  onClick={() => !conclusionSolved && setConclusion(id as Prediction)}
                  disabled={conclusionSolved}
                >
                  {label}
                </button>
              ))}
            </div>

            {!conclusionSolved && (
              <div className="game-actions assessment-actions">
                {conclusionAttempts >= 3 && (
                  <button className="text-button" onClick={revealConclusion}>Lösung zeigen</button>
                )}
                <button
                  className="primary-button"
                  onClick={checkConclusion}
                  disabled={!conclusion}
                >
                  Auswertung prüfen
                </button>
              </div>
            )}

            {conclusionAttempts > 0 && !conclusionSolved && (
              <div className="feedback hint">
                Diese Schlussfolgerung passt noch nicht zu deiner Messreihe. Noch erreichbar: {conclusionPoints}/3 Punkte.
              </div>
            )}

            {conclusionSolved && (
              <div className={solutionShown ? "feedback solution" : "feedback correct"}>
                <strong>{solutionShown ? "Lösung:" : "Richtig."}</strong> {observedLabel}.
                <div className="prediction-comparison">
                  Deine Vermutung: <strong>{predictionLabel}</strong> · Beobachtung: <strong>{observedLabel}</strong>
                  <br />
                  {prediction === correctConclusion
                    ? "Deine Vermutung stimmt mit der Messreihe überein."
                    : "Die Messreihe widerspricht deiner ursprünglichen Vermutung."}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
