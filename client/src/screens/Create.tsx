import { useNavigate } from "react-router-dom";
import back from '../assets/back_arrow.png';
import { socket } from "../socket";
import { useEffect, useState } from "react";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function Create(){
    const navigate = useNavigate();
    const [players, setPlayers] = useState<string[]>([]);

    const [code] = useState(
        Array.from({ length: 4 }, () => getRandomInt(10)).join("")
    );

    useEffect(() => {
        // create room in server and send codeto him
        if (socket.connected) {
            socket.emit("create_room", code);
        } else {
            socket.on("connect", () => {
                socket.emit("create_room", code);
            });
        }

        // update player list
        socket.on("players_update", (players)=>{
            setPlayers(players);
        })

        return () => {
            socket.off("connect");
            socket.off("players_update");
        }
    }, [code])

    return(
        <div>
            <h2>Players: {players.length-1}</h2>
            <h1>GAME CODE</h1>
            <div className="code">
                {code}
            </div>
            <div className="buttonsNavigate">
                <button onClick={() => navigate('/choose')}>
                    <img src={back} alt="back"  id="back"/>
                </button>
                <button onClick={() => {
                    localStorage.setItem("roomCode", code);
                    socket.emit("start_game", code);
                    navigate('/gamehost')
                    }}>
                    <h2>Start game</h2>
                </button>
            </div>
        </div>
    )
}

export default Create;