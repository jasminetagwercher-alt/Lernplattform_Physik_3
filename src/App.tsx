import { useEffect, useState } from "react";
import { ChallengeMix } from "./components/ChallengeMix";
import { CircuitWorkshop } from "./components/CircuitWorkshop";
import { MissionEngine } from "./components/MissionEngine";
import { ResistanceLab } from "./components/ResistanceLab";
import { learningUnits } from "./content/registry";

type View = "home" | "unit" | "mission" | "challenge" | "workshop" | "lab";

const STORAGE_KEY = "physik3-progress-v1";

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
        <div className="status-pill">Aufbauphase · v0.3</div>
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
                Neue Einheiten werden künftig über das zentrale Inhaltsregister automatisch hier angezeigt.
              </div>
              <div className="coming-card">
                Nächste Ausbaustufe: weitere physikalische Simulationen · Aufgabenpools · Boss-Level
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

          {selectedUnit.id === "elektrizitaet-44-49" ? (
            <section className="activity-grid">
              <button className="activity-card mission" onClick={() => setView("mission")}>
                <span className="activity-icon">⌁</span>
                <div>
                  <div className="eyebrow">Mission</div>
                  <h2>Stromcode</h2>
                  <p>Gemischte Aufgaben mit Hinweisen, plausiblen Fehlantworten und zufälliger Reihenfolge.</p>
                  <strong>{completed.includes("stromcode") ? "✓ abgeschlossen" : "Mission starten →"}</strong>
                </div>
              </button>

              <button className="activity-card workshop" onClick={() => setView("workshop")}>
                <span className="activity-icon">⎍</span>
                <div>
                  <div className="eyebrow">Werkstatt</div>
                  <h2>Stromkreis bauen</h2>
                  <p>Bauteile auswählen, einen einfachen Stromkreis zusammensetzen und Bereiche im Schaltbild finden.</p>
                  <strong>Werkstatt öffnen →</strong>
                </div>
              </button>

              <button className="activity-card challenge" onClick={() => setView("challenge")}>
                <span className="activity-icon">↯</span>
                <div>
                  <div className="eyebrow">Challenge-Mix</div>
                  <h2>Ordnen · Sortieren · Fehler finden</h2>
                  <p>Drei wiederverwendbare Spieltypen: Drag & Drop, Sortieraufgabe und Fehlerdetektiv.</p>
                  <strong>Challenges öffnen →</strong>
                </div>
              </button>

              <button className="activity-card lab" onClick={() => setView("lab")}>
                <span className="activity-icon">◉</span>
                <div>
                  <div className="eyebrow">Experiment</div>
                  <h2>Widerstands-Labor</h2>
                  <p>Kontrollierte Messreihen durchführen, Messwerte speichern und automatisch als Diagramm darstellen.</p>
                  <strong>Experiment öffnen →</strong>
                </div>
              </button>
            </section>
          ) : (
            <div className="coming-card">Für diese Einheit werden die Lernaktivitäten gerade vorbereitet.</div>
          )}
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

      {view === "workshop" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <section className="toolkit-intro">
            <div className="eyebrow">Virtuelle Werkstatt</div>
            <h1>Stromkreis-Werkstatt</h1>
            <p>
              Baue zuerst den einfachen Stromkreis. Danach trainierst du dieselben Bestandteile direkt
              am Schaltbild.
            </p>
          </section>
          <CircuitWorkshop />
        </main>
      )}

      {view === "challenge" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <section className="toolkit-intro">
            <div className="eyebrow">Interaktive Trainingsformen</div>
            <h1>Challenge-Mix</h1>
            <p>
              Dieselben Physikinhalte werden hier mit unterschiedlichen Spielmechaniken trainiert.
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
        Physik 3 · Inhalte, Spielmechanik und virtuelle Experimente sind getrennt aufgebaut, damit die Plattform Kapitel für Kapitel wachsen kann.
      </footer>
    </div>
  );
}
