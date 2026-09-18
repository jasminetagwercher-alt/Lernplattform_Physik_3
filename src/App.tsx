import { useEffect, useState } from "react";
import { MissionEngine } from "./components/MissionEngine";
import { ResistanceLab } from "./components/ResistanceLab";
import { electricityUnit } from "./content/electricity";

type View = "home" | "unit" | "mission" | "lab";

const STORAGE_KEY = "physik3-progress-v1";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  function complete(id: string) {
    setCompleted((items) => (items.includes(id) ? items : [...items, id]));
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
        <div className="status-pill">Aufbauphase · v0.1</div>
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
                <div className="eyebrow">Kapitel</div>
                <h2>Aktuell verfügbar</h2>
              </div>
            </div>

            <button className="unit-card" onClick={() => setView("unit")}>
              <div>
                <span className="page-badge">{electricityUnit.pages}</span>
                <h3>{electricityUnit.title}</h3>
                <p>{electricityUnit.description}</p>
              </div>
              <div className="unit-side">
                <span>{electricityUnit.chapter}</span>
                <strong>Öffnen →</strong>
              </div>
            </button>

            <div className="coming-grid">
              <div className="coming-card">Weitere Kapitel werden hier automatisch ergänzt.</div>
              <div className="coming-card">Später: Kapiteltraining · Boss-Level · Lernfortschritt</div>
            </div>
          </section>
        </main>
      )}

      {view === "unit" && (
        <main>
          <button className="back-button" onClick={() => setView("home")}>← Übersicht</button>
          <section className="unit-hero">
            <span className="page-badge">{electricityUnit.pages}</span>
            <div className="eyebrow">{electricityUnit.chapter}</div>
            <h1>{electricityUnit.title}</h1>
            <p>{electricityUnit.description}</p>
          </section>

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

            <button className="activity-card lab" onClick={() => setView("lab")}>
              <span className="activity-icon">◉</span>
              <div>
                <div className="eyebrow">Experiment</div>
                <h2>Widerstands-Labor</h2>
                <p>Regler verändern, Messwerte beobachten und physikalische Zusammenhänge untersuchen.</p>
                <strong>Experiment öffnen →</strong>
              </div>
            </button>
          </section>
        </main>
      )}

      {view === "mission" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <MissionEngine
            tasks={electricityUnit.tasks}
            onComplete={() => {
              complete("stromcode");
              setView("unit");
            }}
          />
        </main>
      )}

      {view === "lab" && (
        <main>
          <button className="back-button" onClick={() => setView("unit")}>← Zur Einheit</button>
          <ResistanceLab />
        </main>
      )}

      <footer>
        Physik 3 · Inhalte und Spielmechanik sind getrennt aufgebaut, damit die Plattform Kapitel für Kapitel wachsen kann.
      </footer>
    </div>
  );
}
