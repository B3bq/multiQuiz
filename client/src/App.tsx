import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Połączono z serwerem:", socket.id);
    });

    socket.on("joined_successfully", () => {
      console.log("Dołączono do lobby!");
    });

    return () => {
      socket.off("connect");
      socket.off("joined_successfully");
    };
  }, []);

  const joinLobby = () => {
    socket.emit("join_lobby", "Mirek");
  };

  return (
    <div>
      <button>
        <h4>
          Słownik
        </h4>
      </button>
      <button>
        <h4>
          Quiz
        </h4>
      </button>
      <button onClick={joinLobby}>
        Dołącz do lobby
      </button>
    </div>
  );
}

export default App;