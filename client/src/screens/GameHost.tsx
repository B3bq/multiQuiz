import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { QuestionStartPayload, QuestionEndPayload } from "../types/game";
import TimerBar from "../components/TimerBar";

function GameHost(){
    const [question, setQuestion] = useState<any>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<number>(0);
  const roomCode = localStorage.getItem("roomCode");

  useEffect(() => {
    const roomCode = localStorage.getItem("roomCode");
    if (roomCode) {
      socket.emit("join_room_reconnect", roomCode); 
    }

    function handleStart(data: QuestionStartPayload) {
      console.log("QUESTION RECEIVED", data);
      setQuestion(data.question);
      setEndTime(data.endTime);
      setCorrect(null);
    }
  
    function handleEnd(data: QuestionEndPayload) {
      setCorrect(data.correctAnswer);
    }
  
    socket.on("questionStart", handleStart);
    socket.on("questionEnd", handleEnd);
  
    return () => {
      socket.off("questionStart", handleStart);
      socket.off("questionEnd", handleEnd);
    };
  
  }, []);

  if (!question) return <div>Waiting for question...</div>;

  return (
    <div>

      <TimerBar endTime={endTime} />

      <h3>{question.text}</h3>

      {Object.entries(question.answers).map(([key, value]) => {

        const isCorrect = correct === key;
        const answerValue = value as string;

        return (
          <button
            key={key}
            style={{
              background: isCorrect ? "green" : ""
            }}
          >
            {key}. {answerValue}
          </button>
        );

      })}

      {correct && (
        <button onClick={() => socket.emit("nextQuestion", roomCode)}>
          Next Question
        </button>
      )}

    </div>
  );
}

export default GameHost;