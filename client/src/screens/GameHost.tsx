import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { QuestionStartPayload, QuestionEndPayload } from "../types/game";
import TimerBar from "../components/TimerBar";

type Player = {
  id: string;
  nickname: string;
  points: number;
};

function GameHost(){
  const [question, setQuestion] = useState<any>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]); // players list

  // last question
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

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

      // last question
      if (data.questionIndex + 1 === data.total) {
        setIsLastQuestion(true);
      }
    }
  
    function handleEnd(data: QuestionEndPayload) {
      setCorrect(data.correctAnswer);
    }

    function handlePlayersUpdate(updatedPlayers: Player[]) {
      setPlayers(updatedPlayers);
    }

    // own end game
    function handleGameEnd() {
      setGameEnded(true);
    }
  
    socket.on("questionStart", handleStart);
    socket.on("questionEnd", handleEnd);
    socket.on("players_update", handlePlayersUpdate);
    socket.on("gameEnd", handleGameEnd);
  
    return () => {
      socket.off("questionStart", handleStart);
      socket.off("questionEnd", handleEnd);
      socket.off("players_update", handlePlayersUpdate);
      socket.off("gameEnd", handleGameEnd);
    };
  
  }, [roomCode]);

  if (gameEnded) {
    return (
      <div className="final-screen">
        <h1>🏆 Final Standings 🏆</h1>
        {renderLeaderboard(players)}
        <button onClick={() => window.location.href = "/"}>Back to Lobby</button>
      </div>
    );
  }

  if (!question) return <div>Waiting for question...</div>;


  // render scoreboard
  function renderLeaderboard(playerList: Player[]) {
    // sort players from biggest points to lowest
    const sorted = [...playerList]
      .filter((p) => p.nickname !== "HOST")
      .sort((a, b) => b.points - a.points);

    return (
      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <ul>
          {sorted.map((player, index) => (
            <li key={player.id}>
              {index + 1}. {player.nickname} <span>{player.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
        <div className="standings">
          {renderLeaderboard(players)}
        <button onClick={() => {
          const currentRoom = localStorage.getItem("roomCode");
            if (currentRoom) {
              socket.emit("nextQuestion", currentRoom);
            }
          }}>
          {isLastQuestion ? "Show Summary" : "Next Question"}
        </button>
        </div>
      )}

    </div>
  );
}

export default GameHost;