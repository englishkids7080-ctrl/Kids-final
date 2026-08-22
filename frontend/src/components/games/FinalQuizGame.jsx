import QuizGame from "./QuizGame";
import { FINAL_QUIZ } from "@/lib/gameData";

export default function FinalQuizGame({ level }) {
  return <QuizGame level={level} questions={FINAL_QUIZ} />;
}
