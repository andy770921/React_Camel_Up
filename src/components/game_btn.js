import '../css/normalize.css';
import '../css/common.css';
import '../css/game_btn.css';
import React, { useContext }  from "react";
import { PlayerContext } from '../contexts/playerContext';

const GameBtn = (props) => {
    const { playerData } = useContext(PlayerContext);
    const idNow = playerData.playerRound % 4 + 1;
    const playerNow = playerData.players.find(element => (element.id === idNow));

    return (
        <div className="btn-area row">
            <img className="head-now" src={`./imgs/head_${idNow}.png`}></img>
            <div className="name-now"> { playerNow.name } </div>
            <img className="btn-bg" src="./imgs/btn_area.png"></img>
            <img className="game-btn btn-pos1" src="./imgs/pyrimid_btn.png" onClick={props.camelRun}></img>
            <img className="game-btn btn-pos2" src="./imgs/round_btn.png"></img>
            <img className="game-btn btn-pos3" src="./imgs/final_btn.png"></img>
        </div>
    );
}

export default GameBtn;