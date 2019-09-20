import '../css/normalize.css';
import '../css/common.css';
import '../css/final_area.css';
import React, { useContext } from "react";
import { FinalContext } from '../contexts/finalContext';

const FinalArea = () => {
    const { finalCards } = useContext(FinalContext);
    const finalCardList = finalCards.cards.length ? (
        finalCards.cards.map((element, i) => {
            if (element.rank ==="top"){
            return (
                <div key={(element.order + 2000) * (element.order + 50)} className={`final-area-top-div final-area-top-pos${element.order}`}>
                        <img src={`./imgs/final_head_${element.playerOwner}.png`} className={`final-area-card-img`}></img>
                    </div>)
        } else if (element.rank ==="last"){
            return (
                <div key={(element.order + 2500) * (element.order + 50)} className={`final-area-last-div final-area-last-pos${element.order}`}>
                        <img src={`./imgs/final_head_${element.playerOwner}.png`} className={`final-area-card-img`}></img>
                    </div>)
        }})
    ) : ("");


    return (
        <div className="final-area-div">
            <div className="final-area-bg"><img className="final-area-img" src="./imgs/final_area.png"></img></div>
            {finalCardList}
        </div>
    );
}

export default FinalArea;