import { useEffect, useMemo, useRef, useState } from "react";
import type { AssessmentResult } from "./assessment/useScoredAssessment";
import { useScoredAssessment } from "./assessment/useScoredAssessment";

const PHET_URL =
  "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_de.html?screens=1";

type CheckKey = "build" | "switch" | "schematic" | "measure";
type AnswerKey = "closed" | "notConsumed" | "ammeter";
type Prediction = "interrupted" | "unchanged" | "sourceOff";

const correctAnswers: Record<AnswerKey, string> = {
  closed: "closed",
  notConsumed: "no",
  ammeter: "ammeter",
};

export function PhetCircuitLab({
  onComplete,
}: {
  onComplete?: (result: AssessmentResult) => void;
}) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    build: false,
    switch: false,
    schematic: false,
    measure: false,
  });
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    closed: "",
    notConsumed: "",
    ammeter: "",
  });
  const reported = useRef(false);

  const assessment = useScoredAssessment({
    itemIds: ["closed", "notConsumed", "ammeter"],
  });

  const allResearchDone = Object.values(checks).every(Boolean);
  const allAnswersGiven = Object.values(answers).every(Boolean);
  const complete = allResearchDone && assessment.complete;

  const progress = useMemo(() => {
    const research = Object.values(checks).filter(Boolean).length;
    const evaluation = assessment.locked.length;
    return research + evaluation;
  }, [checks, assessment.locked]);

  useEffect(() => {
    if (!complete || reported.current) return;
    reported.current = true;
    onComplete?.({
      score: assessment.score,
      maxScore: assessment.maxScore,
      attempts: assessment.attempts,
      usedSolution: assessment.solutionShown,
    });
  }, [
    complete,
    assessment.score,
    assessment.maxScore,
    assessment.attempts,
    assessment.solutionShown,
    onComplete,
  ]);

  function toggleCheck(key: CheckKey) {
    if (!prediction) return;
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  }

  function setAnswer(key: AnswerKey, value: string) {
    if (assessment.locked.includes(key)) return;
    setAnswers((current) => ({ ...current, [key]: value }));
    assessment.clearWrong(key);
  }

  function evaluate() {
    if (!allResearchDone || !allAnswersGiven || assessment.complete) return;

    const correct = (Object.keys(correctAnswers) as AnswerKey[])
      .filter((key) => !assessment.locked.includes(key) && answers[key] === correctAnswers[key]);
    const wrong = (Object.keys(correctAnswers) as AnswerKey[])
      .filter((key) => !assessment.locked.includes(key) && answers[key] !== correctAnswers[key]);

    assessment.check(correct, wrong);
  }

  function revealSolution() {
    setAnswers(correctAnswers);
    assessment.revealSolution();
  }

  return (
    <section className="phet-lab">
      <header className="phet-header">
        <div>
          <div className="eyebrow">Experiment · S. 44–47</div>
          <h1>Stromkreis-Labor</h1>
          <p>
            Vermute zuerst, was beim Öffnen des Schalters passiert. Baue danach den Stromkreis,
            beobachte die Simulation und werte deine Beobachtungen aus.
          </p>
        </div>
        <div className="phet-progress">
          <strong>{progress}/7</strong>
          <span>Schritte erledigt</span>
        </div>
      </header>

      <section className="prediction-panel phet-prediction">
        <div className="step-number">?</div>
        <div>
          <div className="eyebrow">Vor dem Experiment</div>
          <h3>Was erwartest du, wenn du den Schalter im Stromkreis öffnest?</h3>
          <div className="prediction-grid">
            <button
              className={prediction === "interrupted" ? "prediction-tile selected" : "prediction-tile"}
              onClick={() => setPrediction("interrupted")}
              disabled={Object.values(checks).some(Boolean)}
            >
              Die Elektronenbewegung durch den Stromkreis wird unterbrochen.
            </button>
            <button
              className={prediction === "unchanged" ? "prediction-tile selected" : "prediction-tile"}
              onClick={() => setPrediction("unchanged")}
              disabled={Object.values(checks).some(Boolean)}
            >
              Die Elektronenbewegung bleibt unverändert.
            </button>
            <button
              className={prediction === "sourceOff" ? "prediction-tile selected" : "prediction-tile"}
              onClick={() => setPrediction("sourceOff")}
              disabled={Object.values(checks).some(Boolean)}
            >
              Die Spannungsquelle selbst wird ausgeschaltet.
            </button>
          </div>
          {Object.values(checks).some(Boolean) && (
            <p className="locked-choice">Deine ursprüngliche Vermutung bleibt gespeichert.</p>
          )}
        </div>
      </section>

      <div className="phet-layout">
        <aside className="research-panel">
          <div className="eyebrow">Forschungsauftrag</div>
          <h2>Vier Schritte</h2>

          {!prediction && (
            <div className="feedback hint">Wähle zuerst oben deine Vermutung aus.</div>
          )}

          <ResearchStep
            number="1"
            checked={checks.build}
            disabled={!prediction}
            onClick={() => toggleCheck("build")}
            title="Baue den Stromkreis"
          >
            Verwende eine Batterie als Spannungsquelle, Leitungen, eine Lampe als Elektrogerät
            und einen Schalter. Verbinde die Bauteile zu einem Stromkreis.
          </ResearchStep>

          <ResearchStep
            number="2"
            checked={checks.switch}
            disabled={!prediction}
            onClick={() => toggleCheck("switch")}
            title="Öffnen und schließen"
          >
            Öffne den Schalter und beobachte. Schließe ihn anschließend wieder. Achte auf die
            Darstellung der Elektronenbewegung und auf die Lampe.
          </ResearchStep>

          <ResearchStep
            number="3"
            checked={checks.schematic}
            disabled={!prediction}
            onClick={() => toggleCheck("schematic")}
            title="Ansicht wechseln"
          >
            Wechsle zwischen der realistischen Darstellung und der Schaltbildansicht. Suche die
            entsprechenden Bauteile in beiden Darstellungen.
          </ResearchStep>

          <ResearchStep
            number="4"
            checked={checks.measure}
            disabled={!prediction}
            onClick={() => toggleCheck("measure")}
            title="Stromstärke messen"
          >
            Nimm ein Amperemeter aus dem Messgerätebereich und miss die Stromstärke im
            geschlossenen Stromkreis.
          </ResearchStep>

          <a className="external-sim-link" href={PHET_URL} target="_blank" rel="noreferrer">
            Simulation in neuem Fenster öffnen ↗
          </a>
        </aside>

        <div className={"simulation-frame-wrap " + (!prediction ? "locked-simulation" : "")}>
          <iframe
            className="phet-frame"
            src={PHET_URL}
            title="PhET Stromkreise schalten: Gleichstrom"
            loading="lazy"
            allowFullScreen
          />
          {!prediction && (
            <div className="simulation-lock">
              Erst Vermutung auswählen, dann experimentieren.
            </div>
          )}
          <p className="phet-attribution">
            Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed
            under CC BY-NC 4.0.
          </p>
        </div>
      </div>

      <section className="lab-evaluation">
        <div className="task-topline">
          <div>
            <div className="eyebrow">Auswertung</div>
            <h2>Was hast du herausgefunden?</h2>
          </div>
          <div className="score-box">
            <strong>{assessment.score}/{assessment.maxScore}</strong>
            <span>Punkte</span>
          </div>
        </div>
        <p>Beantworte die drei Fragen nach deinem Versuch und prüfe erst dann.</p>

        <EvaluationQuestion
          title="Wann fließt im aufgebauten Stromkreis elektrischer Strom?"
          value={answers.closed}
          locked={assessment.locked.includes("closed")}
          wrong={assessment.wrong.includes("closed")}
          onChange={(value) => setAnswer("closed", value)}
          options={[
            ["open", "Wenn der Stromkreis unterbrochen ist"],
            ["closed", "Wenn der vollständige Stromkreis geschlossen ist"],
          ]}
        />

        <EvaluationQuestion
          title="Wird der Elektronenstrom in der Lampe verbraucht?"
          value={answers.notConsumed}
          locked={assessment.locked.includes("notConsumed")}
          wrong={assessment.wrong.includes("notConsumed")}
          onChange={(value) => setAnswer("notConsumed", value)}
          options={[
            ["yes", "Ja"],
            ["no", "Nein"],
          ]}
        />

        <EvaluationQuestion
          title="Welches Gerät misst die elektrische Stromstärke?"
          value={answers.ammeter}
          locked={assessment.locked.includes("ammeter")}
          wrong={assessment.wrong.includes("ammeter")}
          onChange={(value) => setAnswer("ammeter", value)}
          options={[
            ["switch", "Schalter"],
            ["ammeter", "Amperemeter"],
            ["battery", "Spannungsquelle"],
          ]}
        />

        {!allResearchDone && (
          <div className="feedback hint">Führe zuerst alle vier Forschungs-Schritte durch.</div>
        )}

        {assessment.wrong.length > 0 && !assessment.complete && (
          <div className="feedback hint">
            {assessment.wrong.length} {assessment.wrong.length === 1 ? "Antwort passt" : "Antworten passen"} noch nicht zu deinen Beobachtungen.
          </div>
        )}

        {assessment.attempts > 0 && !assessment.complete && (
          <div className="assessment-bar">
            <span>Prüfversuche: {assessment.attempts}</span>
            <span>Falsche Antworten verlieren bei jedem Prüfen einen erreichbaren Punkt.</span>
          </div>
        )}

        {!assessment.complete && (
          <div className="game-actions assessment-actions">
            {assessment.attempts >= 3 && (
              <button className="text-button" onClick={revealSolution}>Lösung zeigen</button>
            )}
            <button
              className="primary-button"
              onClick={evaluate}
              disabled={!allResearchDone || !allAnswersGiven}
            >
              Auswertung prüfen
            </button>
          </div>
        )}

        {complete && (
          <div className={assessment.solutionShown ? "feedback solution" : "feedback correct"}>
            <strong>
              {assessment.solutionShown
                ? "Auswertung mit Lösung abgeschlossen."
                : "Auswertung vollständig."}
            </strong>
            <div className="prediction-comparison">
              Deine Vermutung:{" "}
              <strong>
                {prediction === "interrupted"
                  ? "Elektronenbewegung wird unterbrochen."
                  : prediction === "unchanged"
                    ? "Elektronenbewegung bleibt unverändert."
                    : "Spannungsquelle wird ausgeschaltet."}
              </strong>
              <br />
              Beobachtung: <strong>Im unterbrochenen Stromkreis fließt kein Elektronenstrom durch den vollständigen Stromweg.</strong>
              <br />
              {prediction === "interrupted"
                ? "Deine Vermutung passt zu deiner Beobachtung."
                : "Deine Beobachtung widerspricht deiner ursprünglichen Vermutung."}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

function ResearchStep({
  number,
  checked,
  disabled,
  onClick,
  title,
  children,
}: {
  number: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={"research-step " + (checked ? "done" : "")}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="research-number">{checked ? "✓" : number}</span>
      <span>
        <strong>{title}</strong>
        <small>{children}</small>
      </span>
    </button>
  );
}

function EvaluationQuestion({
  title,
  value,
  locked,
  wrong,
  onChange,
  options,
}: {
  title: string;
  value: string;
  locked: boolean;
  wrong: boolean;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className={"evaluation-question " + (locked ? "correct" : wrong ? "wrong" : "")}>
      <strong>{title}</strong>
      <div className="evaluation-options">
        {options.map(([id, label]) => (
          <button
            key={id}
            className={value === id ? "selected" : ""}
            onClick={() => onChange(id)}
            disabled={locked}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
