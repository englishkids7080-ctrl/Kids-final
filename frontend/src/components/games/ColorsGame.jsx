import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sfx } from "@/lib/sound";
import { speak } from "@/lib/tts";
import { COLORS_DATA } from "@/lib/gameData";
import ResultPanel from "./ResultPanel";
import SpeakButton from "@/components/SpeakButton";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Colors game: user is prompted with a color name and must pick the correct swatch.
 * 6 rounds pulled from COLORS_DATA (in random order). Each round shows 6 swatches
 * (target + 5 distractors, always the same fixed set for simplicity).
 */
const ROUND_OPTIONS = 6;

export default function ColorsGame({ level }) {
  const { saveProgress } = useAuth();
  const total = COLORS_DATA.length;
  const nextLevel = level.id < 7 ? level.id + 1 : null;

  const [rounds, setRounds] = useState([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);

  const buildRounds = () => {
    const shuffled = shuffle(COLORS_DATA);
    return shuffled.slice(0, total).map((target) => {
      const distractors = shuffle(COLORS_DATA.filter((c) => c.word !== target.word)).slice(0, ROUND_OPTIONS - 1);
      const options = shuffle([target, ...distractors]);
      return { target, options };
    });
  };

  const reset = () => {
    setRounds(buildRounds());
    setI(0); setScore(0); setPicked(null); setLocked(false); setDone(false);
  };

  // Mount-only: build randomized rounds once. `reset` uses stable setState refs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); }, []);

  // Auto-pronounce the target color when the round changes
  useEffect(() => {
    if (rounds[i] && !done) speak(rounds[i].target.word);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, rounds]);

  const pick = (color) => {
    if (locked || done || !rounds[i]) return;
    setLocked(true);
    const isCorrect = color.word === rounds[i].target.word;
    setPicked({ word: color.word, ok: isCorrect });
    if (isCorrect) { sfx.correct(); speak(color.word); setScore((s) => s + 1); }
    else sfx.wrong();
    setTimeout(() => {
      setPicked(null); setLocked(false);
      if (i + 1 < total) setI((v) => v + 1);
      else finish(isCorrect ? score + 1 : score);
    }, 900);
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

  const round = rounds[i];

  return (
    <>
      <div className="score-bar">
        <span>Question · Pregunta {Math.min(i + 1, total)} / {total}</span>
        <span data-testid="colors-score">Points · Puntos: {score}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(done ? 100 : (i / total) * 100)}%` }} />
      </div>

      {!done && round && (
        <div className="color-board" data-testid="colors-board">
          <div className="color-target">
            <div className="section-eyebrow">Pick the color · Selecciona el color</div>
            <div className="word" data-testid="colors-target-word">
              {round.target.word}
              <SpeakButton text={round.target.word} size={30} testid="colors-speak" />
            </div>
            <div className="hint">({round.target.es})</div>
          </div>
          <div className="color-grid">
            {round.options.map((opt) => {
              let cls = "color-swatch";
              if (picked) {
                if (opt.word === round.target.word) cls += " correct";
                else if (opt.word === picked.word) cls += " wrong";
              }
              return (
                <div
                  key={opt.word}
                  className={cls}
                  style={{ background: opt.hex, border: "3px solid rgba(0,0,0,.08)" }}
                  onClick={() => pick(opt)}
                  data-testid={`color-${opt.word}`}
                >
                  {picked && opt.word === round.target.word && (
                    <span className="label">{opt.word}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {done && (
        <ResultPanel
          score={score}
          max={total}
          stars={stars}
          next={nextLevel}
          onRetry={reset}
        />
      )}
    </>
  );
}
