import PairMatchGame from "./PairMatchGame";
import { NUMBER_PAIRS } from "@/lib/gameData";

export default function NumbersGame({ level }) {
  const items = NUMBER_PAIRS.map((p, i) => ({
    id: `num-${i}`,
    number: p.number,
    word: p.word,
    es: p.es,
  }));

  return (
    <PairMatchGame
      level={level}
      items={items}
      perRound={6}
      leftTitle="Number · Número"
      rightTitle="Word · Palabra en inglés"
      renderLeft={(it) => (
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "2rem", fontWeight: 600 }}>
          {it.number}
        </span>
      )}
      renderRight={(it) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: "1.05rem" }}>{it.word}</span>
          <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>{it.es}</span>
        </div>
      )}
    />
  );
}
