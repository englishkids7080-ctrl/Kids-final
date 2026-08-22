import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sfx } from "@/lib/sound";
import { speak } from "@/lib/tts";
import { chunk } from "@/lib/gameData";
import ResultPanel from "./ResultPanel";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function starsFor(attempts, total) {
  if (attempts <= total) return 3;
  if (attempts <= total * 1.6) return 2;
  return 1;
}

/**
 * Reusable "match two columns" pair game — played in short rounds, with
 * error tracking so children can practice only the pairs they missed.
 */
export default function PairMatchGame({ level, items, leftTitle, rightTitle, renderLeft, renderRight, perRound = 6 }) {
  const { saveProgress } = useAuth();
  const nextLevel = level.id < 7 ? level.id + 1 : null;

  const [pool, setPool] = useState(items);
  const rounds = useMemo(() => chunk(pool, perRound), [pool, perRound]);
  const totalItems = pool.length;

  const [roundIdx, setRoundIdx] = useState(0);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [totalMatched, setTotalMatched] = useState(0);
  const [wrongPair, setWrongPair] = useState(null);
  const [failed, setFailed] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [done, setDone] = useState(false);

  const loadRound = (idx) => {
    const cur = rounds[idx] || [];
    setLeftItems(shuffle(cur));
    setRightItems(shuffle(cur));
    setMatched(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongPair(null);
  };

  const reset = () => {
    setRoundIdx(0);
    setTotalMatched(0);
    setAttempts(0);
    setFailed(new Set());
    setDone(false);
    loadRound(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setPool(items); setPracticeMode(false); }, [items]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); }, [pool]);

  const currentRound = rounds[roundIdx] || [];

  const tryMatch = (l, r) => {
    setAttempts((a) => a + 1);
    if (l.id === r.id) {
      sfx.correct();
      if (l.word) speak(l.word);
      setMatched((m) => new Set([...m, l.id]));
      setTotalMatched((t) => t + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      sfx.wrong();
      setFailed((f) => new Set([...f, l.id, r.id]));
      setWrongPair({ l: l.id, r: r.id });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  const pickLeft = (item) => {
    if (matched.has(item.id) || done) return;
    sfx.flip();
    if (selectedRight) tryMatch(item, selectedRight);
    else setSelectedLeft(item);
  };
  const pickRight = (item) => {
    if (matched.has(item.id) || done) return;
    sfx.flip();
    if (item.word) speak(item.word); // tap a word to hear it
    if (selectedLeft) tryMatch(selectedLeft, item);
    else setSelectedRight(item);
  };

  // Advance to next round or finish when the current round is fully matched.
  useEffect(() => {
    if (currentRound.length === 0) return;
    if (matched.size === currentRound.length && !done) {
      const isLast = roundIdx + 1 >= rounds.length;
      const t = setTimeout(() => {
        if (isLast) {
          sfx.win();
          setDone(true);
          if (!practiceMode) {
            saveProgress({ level_id: level.id, score: totalItems, max_score: totalItems, stars: starsFor(attempts, totalItems) });
          }
        } else {
          sfx.correct();
          setRoundIdx((r) => {
            const n = r + 1;
            loadRound(n);
            return n;
          });
        }
      }, 550);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const handleRetry = () => {
    setPracticeMode(false);
    setPool(items);
    reset();
  };

  const handlePractice = () => {
    const subset = items.filter((it) => failed.has(it.id));
    if (!subset.length) return;
    setPracticeMode(true);
    setPool(subset); // triggers reset via effect
  };

  const cellClass = (item, side) => {
    const sel = side === "L" ? selectedLeft?.id === item.id : selectedRight?.id === item.id;
    const wrong = wrongPair && (side === "L" ? wrongPair.l === item.id : wrongPair.r === item.id);
    return `pair-item ${matched.has(item.id) ? "matched" : ""} ${sel ? "selected" : ""} ${wrong ? "wrong" : ""}`;
  };

  return (
    <>
      <div className="score-bar" data-testid="game-score-bar">
        <span data-testid="game-round">
          {practiceMode ? "Práctica · " : ""}Round · Ronda {Math.min(roundIdx + 1, rounds.length)} / {rounds.length}
        </span>
        <span data-testid="game-progress">Pairs · Parejas: {totalMatched} / {totalItems}</span>
        <span>Tries · Intentos: {attempts}</span>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: ".85rem" }} onClick={handleRetry}>
          Restart · Reiniciar
        </button>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(totalMatched / totalItems) * 100}%` }} />
      </div>

      {!done && (
        <div className="pair-board">
          <div className="pair-col">
            <div className="pair-col-title">{leftTitle}</div>
            {leftItems.map((it) => (
              <div
                key={`l-${it.id}`}
                className={cellClass(it, "L")}
                onClick={() => pickLeft(it)}
                data-testid={`pair-left-${it.id}`}
              >
                {renderLeft(it)}
              </div>
            ))}
          </div>
          <div className="pair-col">
            <div className="pair-col-title">{rightTitle}</div>
            {rightItems.map((it) => (
              <div
                key={`r-${it.id}`}
                className={cellClass(it, "R")}
                onClick={() => pickRight(it)}
                data-testid={`pair-right-${it.id}`}
              >
                {renderRight(it)}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && (
        <ResultPanel
          score={totalItems}
          max={totalItems}
          stars={starsFor(attempts, totalItems)}
          next={nextLevel}
          onRetry={handleRetry}
          onPractice={handlePractice}
          wrongCount={failed.size}
          practiceMode={practiceMode}
        />
      )}
    </>
  );
}
