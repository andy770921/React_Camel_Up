import '../css/normalize.css';
import '../css/common.css';
import '../css/game_btn.css';
import React, { useContext } from "react";
import { PlayerContext } from '../contexts/playerContext';
import { PopupContext } from '../contexts/popupContext';

const GameBtn = (props) => {
    const { playerData } = useContext(PlayerContext);
    const { triggerPop, showRoundBet, initializeCards } = useContext(PopupContext);
    const idNow = playerData.playerRound % 4 + 1;
    const playerNow = playerData.players.find(element => (element.id === idNow));

    const camelRunAndCheckRound = () => {
        props.camelRun();
        // 當玩家投骰子，會觸發下方判斷式，若下一回合，即現在回合加一，會重新開始駱駝新的回合，則會讓回合下注卡片回復初始狀態，供下個玩家選
        if ( (playerData.camelRound + 1) > 0 && (playerData.camelRound + 1) % 4 === 0){
            initializeCards();
        }
    }
    return (
        <div className="btn-area row">
            <img className="head-now" src={`./imgs/head_${idNow}.png`}></img>
            <div className="name-now"> {playerNow.name} </div>
            <img className="btn-bg" src="./imgs/btn_area.png"></img>
            <img className="game-btn btn-pos1" src="./imgs/pyrimid_btn.png" onClick={ camelRunAndCheckRound }></img>
            <img className="game-btn btn-pos2" src="./imgs/round_btn.png" onClick={ showRoundBet }></img>
            <img className="game-btn btn-pos3" src="./imgs/final_btn.png" onClick={ triggerPop }></img>
        </div>
    );
}

export default GameBtn;