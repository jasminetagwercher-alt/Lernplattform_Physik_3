import { useEffect, useState } from "react";
import { ChallengeMix } from "./components/ChallengeMix";
import { MissionEngine } from "./components/MissionEngine";
import { PhetCircuitLab } from "./components/PhetCircuitLab";
import { ResistanceLab } from "./components/ResistanceLab";
import { learningUnits } from "./content/registry";
import type { ActivityKind, LearningActivity } from "./model";

type View = "home" | "unit" | "mission" | "challenge" | "phet-lab" | "lab";

const STORAGE_KEY = "physik3-progress-v1";

const viewByKind: Record<ActivityKind, View> = {
  mission: "mission",
  challenge: "challenge",
  "phet-lab": "phet-lab",
  "virtual-lab": "lab",
};

const iconByKind: Record<ActivityKind, string> = {
  mission: "⌁",
  challenge: "↯",
  "phet-lab": "⚡",
  "virtual-lab": "◉",
};

const classByKind: Record<ActivityKind, string> = {
  mission: "mission",
  challenge: "challenge",
  "phet-lab": "phet",
  "virtual-lab": "lab",
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedUnitId, setSelectedUnitId] = useState(learningUnits[0]?.id ?? "");
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const selectedUnit =
    learningUnits.find((unit) => unit.id === selectedUnitId) ?? learningUnits[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  function complete(id: string) {
    setCompleted((items) => (items.includes(id) ? items : [...items, id]));
  }

  function openUnit(id: string) {
    setSelectedUnitId(id);
    setView("unit");
  }

  function openActivity(activity: LearningActivity) {
    setView(viewByKind[activity.kind]);
  }

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
        <div className="status-pill">Aufbauphase · v0.4</div>
      </header>

      {view === "home" && (
        <main>
          <section className="hero">
            <div>
              <div className="eyebrow">Physik verstehen · ausprobieren · meistern</div>
              <h1>Dein digitales Physiklabor.</h1>
              <p>
                Übungen, Missionen und virtuelle Experimente passend zu den Themen aus Physik 3.
              </p>
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
              {learningUnits.map((unit) => (
                <button className="unit-card" key={unit.id} onClick={() => openUnit(unit.id)}>
                  <div>
                    <span className="page-badge">{unit.pages}</span>
                    <h3>{unit.title}</h3>
                    <p>{unit.description}</p>
                  </div>
                  <div className="unit-side">
                    <span>{unit.chapter}</span>
                    <strong>Öffnen →</strong>
                  </div>
                </button>
              ))}
            </div>

            <div className="coming-grid">
              <div className="coming-card">
                Neue Einheiten erscheinen künftig automatisch aus dem zentralen Inhaltsregister.
              </div>
              <div className="coming-card">
                Externe hochwertige Simulationen und eigene Mini-Labore werden je nach Thema kombiniert.
              </div>
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
          </section>

          <section className="activity-grid">
            {selectedUnit.activities.map((activity) => (
              <button
                key={activity.id}
                className={`activity-card ${classByKind[activity.kind]}`}
                onClick={() => openActivity(activity)}
              >
                <span className="activity-icon">{iconByKind[activity.kind]}</span>
                <div>
                  <div className="eyebrow">{activity.label}</div>
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
                  <strong>
                    {completed.includes(activity.id)
                      ? "✓ abgeschlossen"
                      : activity.kind === "phet-lab"
                        ? "Labor öffnen →"
                        : activity.kind === "virtual-lab"
                          ? "Experiment öffnen →"
                          : "Starten →"}
                  </strong>
                </div>
              </button>
            ))}
          </section>
        </main>
      )}

      {view === "phet-lab" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <PhetCircuitLab onComplete={() => complete("phet-stromkreis")} />
        </main>
      )}

      {view === "mission" && selectedUnit && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <MissionEngine
            tasks={selectedUnit.tasks}
            onComplete={() => {
              complete("stromcode");
              setView("unit");
            }}
          />
        </main>
      )}

      {view === "challenge" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <section className="toolkit-intro">
            <div className="eyebrow">Interaktive Trainingsformen</div>
            <h1>Challenge-Mix</h1>
            <p>
              Dieselben Physikinhalte werden mit unterschiedlichen Spielmechaniken trainiert.
              Die Komponenten können später in jedem Kapitel wiederverwendet werden.
            </p>
          </section>
          <ChallengeMix />
        </main>
      )}

      {view === "lab" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <ResistanceLab />
        </main>
      )}

      <footer>
        Physik 3 · Fachinhalt, Lernaktivität und Darstellung sind getrennt aufgebaut. Komplexe
        Simulationen werden nur dann selbst entwickelt, wenn dafür ein echter didaktischer Mehrwert
        besteht.
      </footer>
    </div>
  );
}
