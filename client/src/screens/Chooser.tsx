import { useNavigate } from "react-router-dom";
import back from '../assets/back_arrow.png';

function Chooser(){
    const navigate = useNavigate();

    return(
        <div className="menu">
            <div className="buttons">
                <button onClick={() => navigate('/create')}>
                    <h2>Create room</h2>
                </button>
                <button onClick={() => navigate('/lobby')}>
                    <h2>Join</h2>
                </button>
            </div>
            <button onClick={() => navigate('/')}>
                <img src={back} alt="back" id="back" />
            </button>
        </div>
    )
}

export default Chooser;