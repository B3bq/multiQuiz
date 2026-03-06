import { useEffect } from "react";
import { socket } from "../socket";

function Menu(){

    return (
        <div>
            <button>
                <img src="./assets/dictionary.png" alt="dictionary" />
                <h2>slownik</h2>
            </button>
            <button>
                <img src="./assets/game.png" alt="game" />
                <h2>quiz</h2>
            </button>
        </div>
    )
}
export default Menu;