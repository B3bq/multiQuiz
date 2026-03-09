import { useNavigate } from "react-router-dom";
import dictionary from '../assets/dictionary.png';
import game from '../assets/game.png';

function Menu(){
    const navigate = useNavigate();

    return (
        <div className="menu">
            <button onClick={() => navigate("/dictionary")}>
                <img src={dictionary} alt="dictionary" />
                <h2>Dictionary</h2>
            </button>
            <button onClick={() => navigate("/choose")}>
                <img src={game} alt="game" />
                <h2>Quiz</h2>
            </button>
        </div>
    )
}
export default Menu;