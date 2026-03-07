import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import back from '../assets/back_arrow.png';

function Lobby(){
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [view, setView] = useState('first');

    const handlerChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ""); //delete everything else without number
        value = value.slice(0, 4); //max 4 numbers

        setCode(value);
    }

    useEffect(() => {

        socket.on("room_valid", () => {
          setView("player");
        });
      
        socket.on("room_invalid", () => {
          alert("Room does not exist");
        });
      
        socket.on("join_error", (msg) => {
          alert(msg);
          setView("first");
        });

        socket.on("game_started", () => {
            navigate("/game");
          });
      
        socket.on("join_success", () => {
          setView("waiting");
        });
      
        return () => {
          socket.off("room_valid");
          socket.off("room_invalid");
          socket.off("join_error");
          socket.off("join_success");
          socket.off("game_started");
        };
      
      }, []);

    const joinRoom = () => {
        socket.emit("join_room", {
            roomCode: code,
            nickname: nickname
        });
    }

    if(view === 'first'){
        return(
            <div className="lobby">
                <h3>Enter invite code</h3>
                <input id="enterCode" type="text" value={code}  onChange={handlerChange} placeholder="Enter code" />
                <button id="join" onClick={() => socket.emit("check_room", code)} disabled={code.length !== 4}>
                    <h2>Join</h2>
                </button>
                <button onClick={() => navigate('/choose')}>
                    <img src={back} alt="back" id="back" />
                </button>
            </div>
        )
    }

    if(view === 'player'){
        return(
            <div className="lobby">
                <img src="" alt="profile" />
                <input
                    type="text"
                    id="playerName"
                    placeholder="Your nickname"
                    value={nickname}
                    onChange={(e)=>setNickname(e.target.value)}
                />
                <button onClick={joinRoom} disabled={!nickname}>
                    Join game
                </button>
            </div>
        )
    }

    if(view === "waiting"){
        return(
          <div className="lobby">
            <h2>Waiting for host to start the game...</h2>
          </div>
        )
      }
}
export default Lobby;