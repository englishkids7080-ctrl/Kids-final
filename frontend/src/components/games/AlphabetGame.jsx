import PairMatchGame from "./PairMatchGame";
import { ALPHABET_PAIRS } from "@/lib/gameData";

export default function AlphabetGame({ level }) {
  const items = ALPHABET_PAIRS.map((p, i) => ({
    id: `alph-${i}`,
    letter: p.letter,
    word: p.word,
    es: p.es,
    emoji: p.emoji,
  }));

  return (
    <PairMatchGame
      level={level}
      items={items}
      perRound={6}
      leftTitle="Letter · Letra"
      rightTitle="Word · Palabra"
      renderLeft={(it) => (
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "1.8rem", fontWeight: 600 }}>
          {it.letter}
        </span>
      )}
      renderRight={(it) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span className="emoji-lg">{it.emoji}</span>
          <span>{it.word}</span>
          <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>{it.es}</span>
        </div>
      )}
    />
  );
}
