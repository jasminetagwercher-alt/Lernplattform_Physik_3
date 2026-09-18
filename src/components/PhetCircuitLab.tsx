import { useMemo, useState } from "react";

const PHET_URL =
  "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_de.html?screens=1";

type CheckKey = "build" | "switch" | "schematic" | "measure";

type AnswerKey = "closed" | "notConsumed" | "ammeter";

export function PhetCircuitLab({ onComplete }: { onComplete?: () => void }) {
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
  const [checked, setChecked] = useState(false);

  const allResearchDone = Object.values(checks).every(Boolean);
  const allAnswersCorrect =
    answers.closed === "closed" &&
    answers.notConsumed === "no" &&
    answers.ammeter === "ammeter";
  const complete = allResearchDone && allAnswersCorrect;

  const progress = useMemo(() => {
    const research = Object.values(checks).filter(Boolean).length;
    const evaluation = [
      answers.closed === "closed",
      answers.notConsumed === "no",
      answers.ammeter === "ammeter",
    ].filter(Boolean).length;
    return research + evaluation;
  }, [checks, answers]);

  function toggleCheck(key: CheckKey) {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  }

  function setAnswer(key: AnswerKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setChecked(false);
  }

  function evaluate() {
    setChecked(true);
    if (complete) onComplete?.();
  }

  return (
    <section className="phet-lab">
      <header className="phet-header">
        <div>
          <div className="eyebrow">PhET-Labor · S. 44–47</div>
          <h1>Stromkreis wirklich bauen</h1>
          <p>
            Arbeite direkt in der Simulation. Baue den Stromkreis aus echten Simulationsbauteilen,
            beobachte den Schalter und wechsle anschließend zur Schaltbildansicht.
          </p>
        </div>
        <div className="phet-progress">
          <strong>{progress}/7</strong>
          <span>Schritte erledigt</span>
        </div>
      </header>

      <div className="phet-layout">
        <aside className="research-panel">
          <div className="eyebrow">Forschungsauftrag</div>
          <h2>Vier Schritte</h2>

          <ResearchStep
            number="1"
            checked={checks.build}
            onClick={() => toggleCheck("build")}
            title="Baue den Stromkreis"
          >
            Verwende eine Batterie als Spannungsquelle, Leitungen, eine Lampe als Elektrogerät
            und einen Schalter. Verbinde die Bauteile zu einem Stromkreis.
          </ResearchStep>

          <ResearchStep
            number="2"
            checked={checks.switch}
            onClick={() => toggleCheck("switch")}
            title="Öffnen und schließen"
          >
            Öffne den Schalter und beobachte. Schließe ihn anschließend wieder. Achte auf die
            Darstellung der Elektronenbewegung und auf die Lampe.
          </ResearchStep>

          <ResearchStep
            number="3"
            checked={checks.schematic}
            onClick={() => toggleCheck("schematic")}
            title="Ansicht wechseln"
          >
            Wechsle zwischen der realistischen Darstellung und der Schaltbildansicht. Suche die
            entsprechenden Bauteile in beiden Darstellungen.
          </ResearchStep>

          <ResearchStep
            number="4"
            checked={checks.measure}
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

        <div className="simulation-frame-wrap">
          <iframe
            className="phet-frame"
            src={PHET_URL}
            title="PhET Stromkreise schalten: Gleichstrom"
            loading="lazy"
            allowFullScreen
          />
          <p className="phet-attribution">
            Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed
            under CC BY-NC 4.0 (https://phet.colorado.edu).
          </p>
        </div>
      </div>

      <section className="lab-evaluation">
        <div className="eyebrow">Auswertung</div>
        <h2>Was hast du herausgefunden?</h2>
        <p>Beantworte die drei Fragen nach deinem Versuch.</p>

        <EvaluationQuestion
          title="Wann fließt im aufgebauten Stromkreis elektrischer Strom?"
          value={answers.closed}
          onChange={(value) => setAnswer("closed", value)}
          options={[
            ["open", "Wenn der Schalter offen ist"],
            ["closed", "Wenn der Schalter geschlossen ist"],
          ]}
        />

        <EvaluationQuestion
          title="Wird der Elektronenstrom in der Lampe verbraucht?"
          value={answers.notConsumed}
          onChange={(value) => setAnswer("notConsumed", value)}
          options={[
            ["yes", "Ja"],
            ["no", "Nein"],
          ]}
        />

        <EvaluationQuestion
          title="Welches Gerät misst die elektrische Stromstärke?"
          value={answers.ammeter}
          onChange={(value) => setAnswer("ammeter", value)}
          options={[
            ["switch", "Schalter"],
            ["ammeter", "Amperemeter"],
            ["battery", "Batterie"],
          ]}
        />

        {checked && (
          <div className={complete ? "feedback correct" : "feedback hint"}>
            {complete
              ? "Auswertung vollständig. Du hast den Forschungsauftrag abgeschlossen."
              : !allResearchDone
                ? "Die Antworten sind noch nicht vollständig oder ein Forschungs-Schritt ist noch offen."
                : "Mindestens eine Antwort passt noch nicht zu deinen Beobachtungen. Prüfe den Versuch noch einmal."}
          </div>
        )}

        <div className="game-actions">
          <button className="primary-button" onClick={evaluate}>
            Auswertung prüfen
          </button>
        </div>

        <details className="teacher-note">
          <summary>Fachliche Grundlage</summary>
          <p>
            Wissensdatenbank: P3-K3-S044-M02 · P3-K3-S045-M01 · P3-K3-S045-M02 ·
            P3-K3-S047-M01 · P3-KOMP-039
          </p>
        </details>
      </section>
    </section>
  );
}

function ResearchStep({
  number,
  checked,
  onClick,
  title,
  children,
}: {
  number: string;
  checked: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button className={`research-step ${checked ? "done" : ""}`} onClick={onClick}>
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
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="evaluation-question">
      <strong>{title}</strong>
      <div className="evaluation-options">
        {options.map(([id, label]) => (
          <button
            key={id}
            className={value === id ? "selected" : ""}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
