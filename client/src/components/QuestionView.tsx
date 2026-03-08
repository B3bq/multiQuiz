import type { Question, AnswerKey } from "../types/game";

interface Props {
  question: Question;
  selected?: AnswerKey | null;
  correct?: AnswerKey | null;
  onAnswer?: (answer: AnswerKey) => void;
}

export default function QuestionView({
  question,
  selected,
  correct,
  onAnswer
}: Props) {

  return (
    <div>

      <h3>{question.text}</h3>

      {Object.entries(question.answers).map(([key, value]) => {

        const answerKey = key as AnswerKey;

        const isSelected = selected === answerKey;
        const isCorrect = correct === answerKey;

        return (
          <button
            key={key}
            onClick={() => onAnswer?.(answerKey)}
            style={{
              background:
                isCorrect ? "green"
                : isSelected ? "lightblue"
                : ""
            }}
          >
            {key}. {value}
          </button>
        );

      })}

    </div>
  );
}