import { socket } from "../socket";
import { useEffect, useState } from "react";
import TimerBar from "../components/TimerBar";
import burger from '../assets/burger-bar.png';
import arrow from '../assets/arrow.png';
import Words from '../components/words';
import translations from '../components/translations';

function Game(){
    const [question, setQuestion] = useState<any>(null);
    const [endTime, setEndTime] = useState(0);
    const [view, setView] = useState('first');

    // dictionary service
    const [isDictOpen, setIsDictOpen] = useState(false);
  
    useEffect(() => {
        const roomCode = localStorage.getItem("roomCode");
        if (roomCode) {
          socket.emit("join_room_reconnect", roomCode); 
        }
        
        const handleStart = (data: any) => {
            console.log("QUESTION RECEIVED", data);
            setQuestion(data.question);
            setEndTime(data.endTime);
            setView('first');
          };
        
          socket.on("questionStart", handleStart);
        
          return () => {
            socket.off("questionStart", handleStart);
          };
    }, []);
  
    if (!question) return <div>Waiting for question...</div>;

    function sendAnswer(key: string) {
      const roomCode = localStorage.getItem("roomCode");
      const nickname = localStorage.getItem("nickname");

      console.log("👉 Kliknięto odpowiedź:", key, "| Pokój:", roomCode);

      if(roomCode){
        socket.emit("answer", {roomCode, answer: key, nickname});
        console.log("📡 Sygnał 'answer' poleciał na serwer!");
      }
      setView('waiting');
    }
  
    if(view === "waiting"){
      return(
        <div className="lobby">
          <h2>Waiting for all players...</h2>
        </div>
      )
  }

    return (
      <div className="game">
        <div className="side-dictionary">
          <button 
            className="dictionary-toggle-btn" 
            onClick={() => setIsDictOpen(!isDictOpen)}
          >
            <img src={isDictOpen ? arrow : burger} alt={isDictOpen ? "close dictionary" : "open dictionary"} />
          </button>

          <div className={`dictionary-menu ${isDictOpen ? "open" : ""}`}>
            <ul>
              {translations.map((translation, index) => (
                  <Words key={index} en={translation.en} pl={translation.pl} />
              ))}
            </ul>
          </div>
        </div>

        <TimerBar endTime={endTime} />
  
        <h3>{question.text}</h3>
  
        <div className="answer-buttons">
        {Object.entries(question.answers).map(([key, value]) => (
          <button
            key={key}
            onClick={() => sendAnswer(key)}
          >
            {value as string}
          </button>
        ))}
        </div>
  
      </div>
    );
}

export default Game;