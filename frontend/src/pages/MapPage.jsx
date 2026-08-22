import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { LEVELS, LEVEL_IMAGES } from "@/lib/gameData";
import { sfx } from "@/lib/sound";

function Stars({ n }) {
  return (
    <div className="stars" aria-label={`${n} de 3 estrellas`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? "" : "off"}>★</span>
      ))}
    </div>
  );
}

export default function MapPage() {
  const nav = useNavigate();
  const { progress, unlockedLevel, user } = useAuth();

  const progressByLevel = Object.fromEntries(progress.map((p) => [p.level_id, p]));

  const isCompleted = (id) => !!progressByLevel[id];
  const isUnlocked = (id) => id <= unlockedLevel || isCompleted(id);

  const go = (level) => {
    if (!isUnlocked(level.id)) return;
    sfx.click();
    nav(`/level/${level.id}`);
  };

  return (
    <>
      <Navbar />
      <div className="map-wrap" data-testid="map-page">
        <div className="map-head">
          <div className="section-eyebrow">Ruta de aprendizaje</div>
          <h1>Mapa de niveles</h1>
          <p>
            Hola <strong>{user?.name || "estudiante"}</strong>. Cada módulo consolida una
            categoría léxica y desbloquea el siguiente. Consigue las tres estrellas para dominar
            el nivel.
          </p>
        </div>

        <div className="map-path">
          {LEVELS.map((lvl) => {
            const completed = isCompleted(lvl.id);
            const unlocked = isUnlocked(lvl.id);
            const isCurrent = unlocked && !completed && lvl.id === unlockedLevel;
            const p = progressByLevel[lvl.id];
            const stars = p?.stars || 0;
            return (
              <div
                key={lvl.id}
                className={`map-node ${!unlocked ? "locked" : ""} ${completed ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                onClick={() => go(lvl)}
                data-testid={`map-node-${lvl.id}`}
              >
                <div className="node-thumb">
                  <img src={LEVEL_IMAGES[lvl.key]} alt={`${lvl.title} — ${lvl.titleEs}`} loading="lazy" />
                  <span className="node-num">
                    {completed ? "✓" : unlocked ? lvl.id : "🔒"}
                  </span>
                </div>
                <div className="node-body">
                  <div className="node-tag">
                    Level {String(lvl.id).padStart(2, "0")} · {lvl.subtitle}
                  </div>
                  <h3>{lvl.title} <span style={{ color: "var(--muted)", fontWeight: 500 }}>· {lvl.titleEs}</span></h3>
                  <p>{lvl.desc}</p>
                  <p style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 2 }}>{lvl.descEs}</p>
                  {completed && (
                    <div style={{ marginTop: 10 }}>
                      <Stars n={stars} />
                    </div>
                  )}
                </div>
                <button
                  className={`node-cta btn ${completed ? "btn-outline" : isCurrent ? "btn-primary" : "btn-ghost"}`}
                  disabled={!unlocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(lvl);
                  }}
                  data-testid={`map-play-${lvl.id}`}
                >
                  {!unlocked ? "Bloqueado" : completed ? "Repetir" : isCurrent ? "Empezar" : "Jugar"}
                </button>
              </div>
            );
          })}
        </div>

        {progress.length === LEVELS.length && (
          <div className="cert-cta" data-testid="cert-cta">
            <div className="section-eyebrow">Ruta completa</div>
            <h2>Has terminado los 7 niveles</h2>
            <p>
              Download your completion certificate with your name, the stars you earned
              and the English Kids seal. · Descarga tu certificado de finalización con tu
              nombre, las estrellas obtenidas y el sello de English Kids.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { sfx.win(); nav("/certificate"); }}
              data-testid="cert-cta-btn"
            >
              Ver mi certificado →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
