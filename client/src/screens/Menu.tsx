import { useEffect } from "react";
import { socket } from "../socket";
import dictionary from '../assets/dictionary.png';
import game from '../assets/game.png';

function Menu(){

    return (
        <div className="menu">
            <button>
                <img src={dictionary} alt="dictionary" />
                <h2>slownik</h2>
            </button>
            <button>
                <img src={game} alt="game" />
                <h2>quiz</h2>
            </button>
        </div>
    )
}
export default Menu;