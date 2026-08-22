import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { LEVELS } from "@/lib/gameData";

function todayInSpanish() {
  const d = new Date();
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function Certificate() {
  const { user, progress } = useAuth();
  const nav = useNavigate();

  const totalStars = progress.reduce((acc, p) => acc + (p.stars || 0), 0);
  const maxStars = LEVELS.length * 3;
  const completedCount = progress.length;
  const isEligible = completedCount === LEVELS.length;

  useEffect(() => {
    if (!isEligible) {
      // Redirect back to map if user tries to access certificate without completing all levels
      const t = setTimeout(() => nav("/map"), 2500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isEligible, nav]);

  if (!isEligible) {
    return (
      <>
        <Navbar />
        <div className="cert-gate" data-testid="cert-gate">
          <div className="cert-gate-card">
            <div className="section-eyebrow">Certificado bloqueado</div>
            <h2>Aún no has completado la ruta</h2>
            <p>
              Debes completar los 7 niveles del mapa para obtener tu certificado.
              Llevas <strong>{completedCount} / {LEVELS.length}</strong> módulos.
            </p>
            <button className="btn btn-primary" onClick={() => nav("/map")}>
              Volver al mapa
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cert-toolbar no-print">
        <button className="btn btn-ghost" onClick={() => nav("/map")} data-testid="cert-back">
          ← Volver al mapa
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            data-testid="cert-print"
          >
            Descargar / Imprimir certificado
          </button>
        </div>
      </div>

      <div className="cert-page print-target" data-testid="certificate-page">
        <div className="cert-sheet">
          <div className="cert-corner tl" />
          <div className="cert-corner tr" />
          <div className="cert-corner bl" />
          <div className="cert-corner br" />

          <header className="cert-head">
            <div className="cert-mark">EK</div>
            <div className="cert-inst">
              <div className="cert-inst-name">English Kids</div>
              <div className="cert-inst-sub">Aprendizaje del inglés a través del juego</div>
            </div>
          </header>

          <div className="cert-body">
            <div className="cert-eyebrow">Certificado de finalización</div>
            <h1 className="cert-title">English Kids</h1>
            <p className="cert-sub">Aprendizaje del inglés a través del juego</p>

            <div className="cert-award">
              <p>Se otorga el presente reconocimiento a</p>
              <div className="cert-name" data-testid="cert-name">
                {user?.name || user?.email || "Estudiante"}
              </div>
              <p className="cert-award-body">
                por haber completado la totalidad de los <strong>siete módulos</strong> del
                programa lúdico de introducción al idioma inglés, cubriendo las categorías
                léxicas de alfabeto, numeración, colores, animales, familia y alimentación,
                además del módulo evaluativo final.
              </p>
            </div>

            <div className="cert-stats">
              <div className="cert-stat">
                <div className="cert-stat-num" data-testid="cert-total-stars">
                  {totalStars}<span className="cert-stat-max">/{maxStars}</span>
                </div>
                <div className="cert-stat-lbl">Estrellas totales</div>
              </div>
              <div className="cert-stat">
                <div className="cert-stat-num">{completedCount}<span className="cert-stat-max">/{LEVELS.length}</span></div>
                <div className="cert-stat-lbl">Módulos completados</div>
              </div>
              <div className="cert-stat">
                <div className="cert-stat-num" style={{ fontSize: "1.5rem" }}>
                  {Math.round((totalStars / maxStars) * 100)}%
                </div>
                <div className="cert-stat-lbl">Desempeño global</div>
              </div>
            </div>

            <div className="cert-signs">
              <div className="cert-sign">
                <div className="cert-sign-line" />
                <div className="cert-sign-role">Equipo English Kids</div>
                <div className="cert-sign-name">Coordinación pedagógica</div>
              </div>
              <div className="cert-sign">
                <div className="cert-sign-seal">English<br/>Kids</div>
                <div className="cert-sign-role">Sello English Kids</div>
              </div>
              <div className="cert-sign">
                <div className="cert-sign-line" />
                <div className="cert-sign-role">Fecha</div>
                <div className="cert-sign-name" data-testid="cert-date">{todayInSpanish()}</div>
              </div>
            </div>
          </div>

          <footer className="cert-foot">
            English Kids · Aprendizaje del inglés a través del juego · Documento generado electrónicamente
          </footer>
        </div>
      </div>
    </>
  );
}
