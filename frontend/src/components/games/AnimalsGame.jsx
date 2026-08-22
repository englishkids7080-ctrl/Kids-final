import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sfx } from "@/lib/sound";
import { speak } from "@/lib/tts";
import { ANIMAL_PAIRS, chunk } from "@/lib/gameData";
import ResultPanel from "./ResultPanel";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PER_ROUND = 6;

export default function AnimalsGame({ level }) {
  const { saveProgress } = useAuth();
  const rounds = useMemo(() => chunk(ANIMAL_PAIRS, PER_ROUND), []);
  const totalPairs = ANIMAL_PAIRS.length;
  const nextLevel = level.id < 7 ? level.id + 1 : null;

  const [roundIdx, setRoundIdx] = useState(0);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [totalMatched, setTotalMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  const buildRound = (idx) => {
    const list = [];
    (rounds[idx] || []).forEach((p, i) => {
      list.push({ id: `e-${idx}-${i}`, pairId: i, kind: "emoji", emoji: p.emoji, word: p.word, es: p.es });
      list.push({ id: `w-${idx}-${i}`, pairId: i, kind: "word",  emoji: p.emoji, word: p.word, es: p.es });
    });
    return shuffle(list);
  };

  const loadRound = (idx) => {
    setCards(buildRound(idx));
    setFlipped([]);
    setMatched(new Set());
    setLock(false);
  };

  const reset = () => {
    setRoundIdx(0);
    setTotalMatched(0);
    setMoves(0);
    setDone(false);
    loadRound(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); }, []);

  const currentPairs = rounds[roundIdx] || [];

  const flip = (card) => {
    if (lock || done) return;
    if (matched.has(card.pairId)) return;
    if (flipped.find((c) => c.id === card.id)) return;
    sfx.flip();
    const nowFlipped = [...flipped, card];
    setFlipped(nowFlipped);
    if (nowFlipped.length === 2) {
      const [a, b] = nowFlipped;
      setMoves((m) => m + 1);
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          sfx.correct();
          speak(a.word);
          setMatched((s) => new Set([...s, a.pairId]));
          setTotalMatched((t) => t + 1);
          setFlipped([]);
        }, 300);
      } else {
        setLock(true);
        setTimeout(() => {
          sfx.wrong();
          setFlipped([]);
          setLock(false);
        }, 800);
      }
    }
  };

  // Advance round / finish.
  useEffect(() => {
    if (currentPairs.length === 0) return;
    if (matched.size === currentPairs.length && !done) {
      const isLast = roundIdx + 1 >= rounds.length;
      const t = setTimeout(() => {
        if (isLast) {
          sfx.win();
          setDone(true);
          const stars = moves <= totalPairs + 2 ? 3 : moves <= totalPairs + 6 ? 2 : 1;
          saveProgress({ level_id: level.id, score: totalPairs, max_score: totalPairs, stars });
        } else {
          sfx.correct();
          setRoundIdx((r) => {
            const n = r + 1;
            loadRound(n);
            return n;
          });
        }
      }, 400);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const finalStars = moves <= totalPairs + 2 ? 3 : moves <= totalPairs + 6 ? 2 : 1;

  return (
    <>
      <div className="score-bar">
        <span data-testid="mem-round">Round · Ronda {Math.min(roundIdx + 1, rounds.length)} / {rounds.length}</span>
        <span data-testid="mem-matches">Pairs · Parejas: {totalMatched} / {totalPairs}</span>
        <span data-testid="mem-moves">Tries · Intentos: {moves}</span>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: ".85rem" }} onClick={reset}>
          Restart · Reiniciar
        </button>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(totalMatched / totalPairs) * 100}%` }} />
      </div>

      {!done && (
        <div className="memory-grid" data-testid="memory-grid">
          {cards.map((c) => {
            const isFlipped = flipped.find((f) => f.id === c.id);
            const isMatched = matched.has(c.pairId);
            return (
              <div
                key={c.id}
                className={`mem-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
                onClick={() => flip(c)}
                data-testid={`mem-card-${c.id}`}
              >
                <div className="mem-inner">
                  <div className="mem-face mem-front" />
                  <div className="mem-face mem-back">
                    {c.kind === "emoji" ? (
                      <div className="emoji">{c.emoji}</div>
                    ) : (
                      <div className="word" style={{ textAlign: "center", lineHeight: 1.2 }}>
                        {c.word}
                        <span style={{ display: "block", fontSize: ".7rem", opacity: .7, fontWeight: 400 }}>{c.es}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {done && (
        <ResultPanel
          score={totalPairs}
          max={totalPairs}
          stars={finalStars}
          next={nextLevel}
          onRetry={reset}
        />
      )}
    </>
  );
}
