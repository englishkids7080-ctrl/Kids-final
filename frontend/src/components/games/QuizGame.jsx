import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sfx } from "@/lib/sound";
import { speak } from "@/lib/tts";
import ResultPanel from "./ResultPanel";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Reusable multiple-choice quiz component (bilingual).
 * questions: [{ emoji, q, qEs, options, answer, answerEs? }]
 */
export default function QuizGame({ level, questions }) {
  const { saveProgress } = useAuth();
  const total = questions.length;
  const nextLevel = level.id < 7 ? level.id + 1 : null;

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "", ok: null });
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [done, setDone] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { restart(); }, [questions]);

  useEffect(() => {
    if (!done && questions[i]) {
      setShuffledOpts(shuffle(questions[i].options));
      setChosen(null); setCorrect(null); setFeedback({ msg: "", ok: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const restart = () => {
    setI(0); setScore(0); setChosen(null); setCorrect(null);
    setFeedback({ msg: "", ok: null }); setDone(false);
    if (questions[0]) setShuffledOpts(shuffle(questions[0].options));
  };

  const pick = (opt) => {
    if (chosen) return;
    const q = questions[i];
    setChosen(opt);
    setCorrect(q.answer);
    if (opt === q.answer) {
      sfx.correct();
      speak(q.answer);
      setScore((s) => s + 1);
      setFeedback({ msg: "Correct! · ¡Correcto!", ok: true });
    } else {
      sfx.wrong();
      speak(q.answer);
      setFeedback({ msg: `Correct answer: "${q.answer}" · La respuesta correcta es "${q.answer}"`, ok: false });
    }
    setTimeout(() => {
      if (i + 1 < total) setI((v) => v + 1);
      else finish(opt === q.answer ? score + 1 : score);
    }, 1200);
  };

  const stars = useMemo(() => {
    const pct = score / total;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    if (pct >= 0.3) return 1;
    return 0;
  }, [score, total]);

  const finish = (finalScore) => {
    setDone(true);
    const pct = finalScore / total;
    let s = 0;
    if (pct >= 0.9) s = 3; else if (pct >= 0.6) s = 2; else if (pct >= 0.3) s = 1;
    sfx.win();
    saveProgress({ level_id: level.id, score: finalScore, max_score: total, stars: s });
  };

  const q = questions[i];

  return (
    <>
      <div className="score-bar" data-testid="quiz-score-bar">
        <span data-testid="quiz-progress-text">Question · Pregunta {Math.min(i + 1, total)} / {total}</span>
        <span data-testid="quiz-score">Points · Puntos: {score}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(done ? 100 : (i / total) * 100)}%` }}
          data-testid="quiz-progress-fill"
        />
      </div>

      {!done && q && (
        <div className="qcard" data-testid="quiz-card">
          <span className="qnum-tag">Question · Pregunta {i + 1}</span>
          <div className="qimg" data-testid="quiz-emoji">{q.emoji}</div>
          <div className="qtext" data-testid="quiz-text">{q.q}</div>
          {q.qEs && (
            <div className="qtext-es" data-testid="quiz-text-es"
                 style={{ fontSize: ".95rem", color: "var(--muted)", marginTop: -6, marginBottom: 6 }}>
              {q.qEs}
            </div>
          )}
          <div className="options-grid">
            {shuffledOpts.map((opt) => {
              let cls = "opt-btn";
              if (chosen) {
                if (opt === correct) cls += " correct";
                else if (opt === chosen) cls += " wrong";
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => pick(opt)}
                  disabled={!!chosen}
                  data-testid={`quiz-option-${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <div className={`feedback ${feedback.ok === true ? "ok" : feedback.ok === false ? "bad" : ""}`}
               data-testid="quiz-feedback">
            {feedback.msg}
          </div>
        </div>
      )}

      {done && (
        <ResultPanel
          score={score}
          max={total}
          stars={stars}
          next={nextLevel}
          onRetry={restart}
        />
      )}
    </>
  );
}
