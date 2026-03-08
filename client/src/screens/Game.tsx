import { socket } from "../socket";
import { useEffect, useState } from "react";
import TimerBar from "../components/TimerBar";

function Game(){
    const [question, setQuestion] = useState<any>(null);
    const [endTime, setEndTime] = useState(0);
  
    useEffect(() => {
        const roomCode = localStorage.getItem("roomCode");
        if (roomCode) {
          socket.emit("join_room_reconnect", roomCode); 
        }
        
        const handleStart = (data: any) => {
            console.log("QUESTION RECEIVED", data);
            setQuestion(data.question);
            setEndTime(data.endTime);
          };
        
          socket.on("questionStart", handleStart);
        
          return () => {
            // Ważne: usuwaj listener przy odmontowaniu!
            socket.off("questionStart", handleStart);
          };
    }, []);
  
    if (!question) return <div>Waiting for question...</div>;
  
    function sendAnswer(key: string) {
      socket.emit("answer", key);
    }
  
    return (
      <div>
  
        <TimerBar endTime={endTime} />
  
        <h3>{question.text}</h3>
  
        {Object.entries(question.answers).map(([key, value]) => (
          <button
            key={key}
            onClick={() => sendAnswer(key)}
          >
            {value as string}
          </button>
        ))}
  
      </div>
    );
}

export default Game;