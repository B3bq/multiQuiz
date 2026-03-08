import { useEffect } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import dictionary from '../assets/dictionary.png';
import game from '../assets/game.png';

function Menu(){
    const navigate = useNavigate();

    return (
        <div className="menu">
            <button onClick={() => navigate("/dictionary")}>
                <img src={dictionary} alt="dictionary" />
                <h2>slownik</h2>
            </button>
            <button onClick={() => navigate("/choose")}>
                <img src={game} alt="game" />
                <h2>quiz</h2>
            </button>
        </div>
    )
}
export default Menu;