import { useEffect, useState } from "react";
import type { AssessmentResult } from "./components/assessment/useScoredAssessment";
import { ChallengeMix } from "./components/ChallengeMix";
import { MediaTraining } from "./components/MediaTraining";
import { MissionEngine } from "./components/MissionEngine";
import { PhetCircuitLab } from "./components/PhetCircuitLab";
import { ResistanceLab } from "./components/ResistanceLab";
import { learningUnits } from "./content/registry";
import type { ActivityKind, LearningActivity } from "./model";

type View = "home" | "unit" | "mission" | "challenge" | "media" | "phet-lab" | "lab";

type ProgressEntry = {
  completed: boolean;
  score?: number;
  maxScore?: number;
  usedSolution?: boolean;
  updatedAt: string;
};

type ProgressMap = Record<string, ProgressEntry>;

const STORAGE_KEY = "physik3-progress-v2";
const LEGACY_STORAGE_KEY = "physik3-progress-v1";

const viewByKind: Record<ActivityKind, View> = {
  mission: "mission",
  challenge: "challenge",
  "media-training": "media",
  "phet-lab": "phet-lab",
  "virtual-lab": "lab",
};

const iconByKind: Record<ActivityKind, string> = {
  mission: "⌁",
  challenge: "↯",
  "media-training": "▦",
  "phet-lab": "⚡",
  "virtual-lab": "◉",
};

const classByKind: Record<ActivityKind, string> = {
  mission: "mission",
  challenge: "challenge",
  "media-training": "media",
  "phet-lab": "phet",
  "virtual-lab": "lab",
};

function loadProgress(): ProgressMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) ?? "[]");
    if (Array.isArray(legacy)) {
      return Object.fromEntries(
        legacy.map((id) => [
          id,
          {
            completed: true,
            updatedAt: new Date().toISOString(),
          },
        ]),
      );
    }
  } catch {
    return {};
  }

  return {};
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedUnitId, setSelectedUnitId] = useState(learningUnits[0]?.id ?? "");
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  const selectedUnit =
    learningUnits.find((unit) => unit.id === selectedUnitId) ?? learningUnits[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function recordProgress(id: string, result?: AssessmentResult) {
    setProgress((current) => {
      const previous = current[id];
      const nextScore =
        result && typeof result.score === "number"
          ? Math.max(previous?.score ?? 0, result.score)
          : previous?.score;

      return {
        ...current,
        [id]: {
          completed: true,
          score: nextScore,
          maxScore: result?.maxScore ?? previous?.maxScore,
          usedSolution:
            result && nextScore === result.score
              ? result.usedSolution
              : previous?.usedSolution,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  function openUnit(id: string) {
    setSelectedUnitId(id);
    setView("unit");
  }

  function openActivity(activity: LearningActivity) {
    setView(viewByKind[activity.kind]);
  }

  const unitActivities = selectedUnit?.activities ?? [];
  const completedCount = unitActivities.filter((activity) => progress[activity.id]?.completed).length;
  const progressPercent = unitActivities.length
    ? Math.round((completedCount / unitActivities.length) * 100)
    : 0;
  const scoredEntries = unitActivities
    .map((activity) => progress[activity.id])
    .filter((entry) => entry && typeof entry.score === "number" && typeof entry.maxScore === "number");
  const totalScore = scoredEntries.reduce((sum, entry) => sum + (entry.score ?? 0), 0);
  const totalMaxScore = scoredEntries.reduce((sum, entry) => sum + (entry.maxScore ?? 0), 0);

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand-button" onClick={() => setView("home")}>
          <span className="brand-icon">Φ</span>
          <span>
            <strong>Physik 3</strong>
            <small>Lernplattform</small>
          </span>
        </button>
      </header>

      {view === "home" && (
        <main>
          <section className="hero">
            <div>
              <div className="eyebrow">Physik verstehen · ausprobieren · meistern</div>
              <h1>Dein digitales Physiklabor.</h1>
              <p>Übungen und Experimente passend zu den Themen aus Physik 3.</p>
            </div>
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="hero-core">3</span>
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Kapitel & Themen</div>
                <h2>Aktuell verfügbar</h2>
              </div>
            </div>

            <div className="unit-list">
              {learningUnits.map((unit) => {
                const done = unit.activities.filter((activity) => progress[activity.id]?.completed).length;
                return (
                  <button className="unit-card" key={unit.id} onClick={() => openUnit(unit.id)}>
                    <div>
                      <span className="page-badge">{unit.pages}</span>
                      <h3>{unit.title}</h3>
                      <p>{unit.description}</p>
                    </div>
                    <div className="unit-side">
                      <span>{unit.chapter}</span>
                      <strong>{done}/{unit.activities.length} erledigt →</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {view === "unit" && selectedUnit && (
        <main>
          <button className="back-button" onClick={() => setView("home")}>← Übersicht</button>
          <section className="unit-hero">
            <span className="page-badge">{selectedUnit.pages}</span>
            <div className="eyebrow">{selectedUnit.chapter}</div>
            <h1>{selectedUnit.title}</h1>
            <p>{selectedUnit.description}</p>

            <div className="unit-progress-card">
              <div className="unit-progress-top">
                <div>
                  <strong>{completedCount}/{unitActivities.length}</strong>
                  <span>Aktivitäten abgeschlossen</span>
                </div>
                <div className="unit-progress-percent">{progressPercent}%</div>
              </div>
              <div className="unit-progress-track" aria-label={"Fortschritt " + progressPercent + " Prozent"}>
                <span style={{ width: progressPercent + "%" }} />
              </div>
              {totalMaxScore > 0 && (
                <div className="unit-score-summary">
                  Bisherige Punkte aus bewerteten Aufgaben: <strong>{totalScore}/{totalMaxScore}</strong>
                </div>
              )}
            </div>
          </section>

          <section className="activity-grid">
            {selectedUnit.activities.map((activity) => {
              const entry = progress[activity.id];
              return (
                <button
                  key={activity.id}
                  className={"activity-card " + classByKind[activity.kind]}
                  onClick={() => openActivity(activity)}
                >
                  <span className="activity-icon">{iconByKind[activity.kind]}</span>
                  <div>
                    <div className="eyebrow">{activity.label}</div>
                    <h2>{activity.title}</h2>
                    <p>{activity.description}</p>
                    <strong>
                      {entry?.completed
                        ? typeof entry.score === "number" && typeof entry.maxScore === "number"
                          ? "✓ " + entry.score + "/" + entry.maxScore + " Punkte"
                          : "✓ abgeschlossen"
                        : activity.kind === "phet-lab"
                          ? "Labor öffnen →"
                          : activity.kind === "virtual-lab"
                            ? "Experiment öffnen →"
                            : "Starten →"}
                    </strong>
                  </div>
                </button>
              );
            })}
          </section>
        </main>
      )}

      {view === "phet-lab" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <PhetCircuitLab onComplete={() => recordProgress("phet-stromkreis")} />
        </main>
      )}

      {view === "mission" && selectedUnit && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <MissionEngine
            tasks={selectedUnit.tasks}
            onComplete={() => {
              recordProgress("stromcode");
              setView("unit");
            }}
          />
        </main>
      )}

      {view === "media" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <section className="toolkit-intro">
            <div className="eyebrow">Interaktiv</div>
            <h1>Karten & Zuordnen</h1>
            <p>Ordne Bauteile und Schaltsymbole zu und beschrifte anschließend einen Stromkreis.</p>
          </section>
          <MediaTraining onComplete={(result) => recordProgress("medien-training", result)} />
        </main>
      )}

      {view === "challenge" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <section className="toolkit-intro">
            <div className="eyebrow">Kurztraining</div>
            <h1>Denken & Prüfen</h1>
            <p>Löse kurze Aufgaben zu Stromstärke und Widerstand.</p>
          </section>
          <ChallengeMix onComplete={(result) => recordProgress("challenge-mix", result)} />
        </main>
      )}

      {view === "lab" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <ResistanceLab onComplete={(result) => recordProgress("widerstands-labor", result)} />
        </main>
      )}
    </div>
  );
}
