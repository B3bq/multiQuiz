import type React from "react";

interface WordsProps{
    en: string;
    pl: string;
}

const Words: React.FC<WordsProps> = ({en, pl}) => {
    return(
        <li><b>{en}</b> - {pl}</li>
    )
}

export default Words;