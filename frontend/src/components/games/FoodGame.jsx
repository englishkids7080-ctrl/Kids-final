import QuizGame from "./QuizGame";
import { FOOD_QUESTIONS } from "@/lib/gameData";

export default function FoodGame({ level }) {
  return <QuizGame level={level} questions={FOOD_QUESTIONS} />;
}
