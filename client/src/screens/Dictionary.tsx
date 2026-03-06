import Words from '../components/words';
import translations from '../components/translations';
import arrow from '../assets/back_arrow.png';
import { useNavigate } from "react-router-dom";

function Dictionary(){
    const navigate = useNavigate();

    return(
        <div className="dictionary">
            <ul>
                {translations.map(translation =>(
                    <Words en={translation.en} pl={translation.pl}/>
                ))
                }
            </ul>
            <button onClick={() => navigate('/')}>
                <img src={arrow} alt="back" />
            </button>
        </div>
    )
}

export default Dictionary;