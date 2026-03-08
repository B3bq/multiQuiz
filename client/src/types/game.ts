export type AnswerKey = "A" | "B" | "C" | "D";

export interface Question {
  text: string;
  answers: Record<AnswerKey, string>;
  correct: AnswerKey;
}

export interface QuestionStartPayload {
  question: Question;
  questionIndex: number;
  total: number;
  endTime: number;
}

export interface QuestionEndPayload {
  correctAnswer: AnswerKey;
}