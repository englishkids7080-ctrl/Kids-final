import { useNavigate } from "react-router-dom";

export default function ResultPanel({ score, max, stars, next, onRetry, onPractice, wrongCount = 0, practiceMode = false }) {
  const nav = useNavigate();
  let emoji = "🌱";
  let msg = "Sigue practicando. ¡Tú puedes! · Keep practicing, you can do it!";
  if (stars >= 3) { emoji = "🏆"; msg = "¡Excelente! Dominio total del nivel. · Perfect score!"; }
  else if (stars === 2) { emoji = "🎉"; msg = "¡Muy buen resultado! · Great job!"; }
  else if (stars === 1) { emoji = "🙂"; msg = "Buen intento. Un poco más de práctica. · Good try, keep going!"; }

  return (
    <div className="result-panel" data-testid="result-panel">
      {practiceMode && (
        <div className="practice-tag" data-testid="practice-tag">Modo práctica · Practice mode</div>
      )}
      <div className="emoji" data-testid="result-emoji">{emoji}</div>
      <div className="score-big" data-testid="result-score">{score} / {max}</div>
      <div className="stars-row" data-testid="result-stars">
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= stars ? "" : "off"}>★</span>
        ))}
      </div>
      <p>{msg}</p>

      <div className="result-actions">
        {onPractice && wrongCount > 0 && (
          <button className="btn btn-outline" onClick={onPractice} data-testid="result-practice">
            Practicar los errores ({wrongCount})
          </button>
        )}
        <button className="btn btn-primary" onClick={onRetry} data-testid="result-retry">
          Jugar de nuevo
        </button>
        {next ? (
          <button
            className="btn btn-secondary"
            onClick={() => nav(`/level/${next}`)}
            data-testid="result-next"
          >
            Siguiente nivel →
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => nav("/map")}
            data-testid="result-back-map"
          >
            Volver al mapa
          </button>
        )}
      </div>
    </div>
  );
}
