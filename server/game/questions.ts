import { Question } from "../types/game.ts";

export const questions: Question[] = [
  {
    text: "Stolica Polski?",
    answers: {
      A: "Warszawa",
      B: "Kraków",
      C: "Gdańsk",
      D: "Poznań"
    },
    correct: "A"
  },
  {
    text: "2 + 2 = ?",
    answers: {
      A: "3",
      B: "4",
      C: "5",
      D: "6"
    },
    correct: "B"
  }
];