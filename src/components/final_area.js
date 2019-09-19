import '../css/normalize.css';
import '../css/common.css';
import '../css/final_area.css';
import React, { useContext } from "react";
import { PlayerContext } from '../contexts/playerContext';
import { PopupContext } from '../contexts/popupContext';
import { FinalContext } from '../contexts/finalContext';

const FinalArea = (props) => {
    const { playerData } = useContext(PlayerContext);
    // const { showRoundBet, showFinalBet } = useContext(PopupContext);
    const { finalCards } = useContext(FinalContext);
    // const idNow = playerData.playerRound % 4 + 1;
    // const playerNow = playerData.players.find(element => (element.id === idNow));
    const finalCardList = finalCards.cards.length ? (
        finalCards.cards.map((element, i) => {
            if (element.rank ==="top"){
            return (
                <div key={element.order + 2000} className={`final-area-top-div final-area-top-pos${element.order}`}>
                        <img src={`./imgs/final_head_${element.playerOwner}.png`} className={`final-area-card-img`}></img>
                    </div>)
        } else if (element.rank ==="last"){
            return (
                <div key={element.order + 2500} className={`final-area-last-div final-area-last-pos${element.order}`}>
                        <img src={`./imgs/final_head_${element.playerOwner}.png`} className={`final-area-card-img`}></img>
                    </div>)
        }})
    ) : ("");


    return (
        <div className="final-area-div">
            <div className="final-area-bg"><img className="final-area-img" src="./imgs/final_area.png"></img></div>
            {finalCardList}
            {/* <div className="name-now"> {playerNow.name} </div>
            <img className="btn-bg" src="./imgs/btn_area.png"></img>
            <img className="game-btn btn-pos2" src="./imgs/round_btn.png" onClick={ showRoundBet }></img>
            <img className="game-btn btn-pos3" src="./imgs/final_btn.png" onClick={ showFinalBet }></img> */}
        </div>
    );
}

export default FinalArea;