import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { computeBadges } from "@/lib/badges";

export default function Badges() {
  const nav = useNavigate();
  const { progress } = useAuth();
  const badges = computeBadges(progress);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <>
      <Navbar />
      <div className="badges-wrap" data-testid="badges-page">
        <button className="back-link" onClick={() => nav("/map")} data-testid="badges-back">
          ← Back to map · Volver al mapa
        </button>

        <div className="badges-head">
          <div className="section-eyebrow">Recompensas · Rewards</div>
          <h1>Mis medallas</h1>
          <p>
            Has ganado <strong data-testid="badges-earned-count">{earnedCount}</strong> de {badges.length} medallas.
            ¡Sigue jugando para conseguirlas todas! · You earned {earnedCount} of {badges.length} badges.
          </p>
        </div>

        <div className="badges-grid" data-testid="badges-grid">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`badge-card ${b.earned ? "earned" : "locked"}`}
              data-testid={`badge-${b.id}`}
            >
              <div className="badge-icon">{b.earned ? b.icon : "🔒"}</div>
              <div className="badge-title">{b.title}</div>
              <div className="badge-title-en">{b.titleEn}</div>
              <div className="badge-desc">{b.desc}</div>
              {b.earned && <div className="badge-ribbon">¡Ganada!</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
