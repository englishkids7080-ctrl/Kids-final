import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { LEVELS, LEVEL_IMAGES } from "@/lib/gameData";
import AlphabetGame from "@/components/games/AlphabetGame";
import NumbersGame from "@/components/games/NumbersGame";
import ColorsGame from "@/components/games/ColorsGame";
import AnimalsGame from "@/components/games/AnimalsGame";
import FamilyGame from "@/components/games/FamilyGame";
import FoodGame from "@/components/games/FoodGame";
import FinalQuizGame from "@/components/games/FinalQuizGame";

const GAME_COMPONENTS = {
  alphabet: AlphabetGame,
  numbers: NumbersGame,
  colors: ColorsGame,
  animals: AnimalsGame,
  family: FamilyGame,
  food: FoodGame,
  quiz: FinalQuizGame,
};

export default function Level() {
  const { id } = useParams();
  const nav = useNavigate();
  const level = useMemo(() => LEVELS.find((l) => String(l.id) === String(id)), [id]);
  if (!level) return <div className="ek-loading">Nivel no encontrado</div>;
  const Game = GAME_COMPONENTS[level.key];

  return (
    <>
      <Navbar />
      <div className="game-wrap" data-testid={`level-page-${level.id}`}>
        <button className="back-link" onClick={() => nav("/map")} data-testid="level-back">
          ← Back to map · Volver al mapa
        </button>

        <div className="level-hero" data-testid={`level-hero-${level.id}`}>
          <div className="level-hero-media">
            <img src={LEVEL_IMAGES[level.key]} alt={`${level.title} — ${level.titleEs}`} loading="lazy" />
            <span className="level-hero-badge">{level.icon}</span>
          </div>
          <div className="level-hero-info">
            <span className="qnum-tag">Level {String(level.id).padStart(2, "0")} · Nivel</span>
            <h2>{level.title} <span className="level-hero-es">· {level.titleEs}</span></h2>
            <p className="level-desc-en">{level.desc}</p>
            <p className="level-desc-es">{level.descEs}</p>
          </div>
        </div>

        <Game level={level} />
      </div>
    </>
  );
}
