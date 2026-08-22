import PairMatchGame from "./PairMatchGame";
import { FAMILY_PAIRS } from "@/lib/gameData";

export default function FamilyGame({ level }) {
  const items = FAMILY_PAIRS.map((p, i) => ({
    id: `fam-${i}`,
    emoji: p.emoji,
    word: p.word,
    es: p.es,
  }));

  return (
    <PairMatchGame
      level={level}
      items={items}
      perRound={6}
      leftTitle="Family · Familia"
      rightTitle="Word · Palabra en inglés"
      renderLeft={(it) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span className="emoji-lg">{it.emoji}</span>
          <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>{it.es}</span>
        </div>
      )}
      renderRight={(it) => <span style={{ fontSize: "1.05rem" }}>{it.word}</span>}
    />
  );
}
