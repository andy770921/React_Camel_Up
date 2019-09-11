import '../css/normalize.css';
import '../css/common.css';
import '../css/game_btn.css';
import React, { useContext }  from "react";
import { PlayerContext } from '../contexts/playerContext';

const GameBtn = (props) => {
    const { playerData } = useContext(PlayerContext);

    return (
        <div className="btn-area">
            <img className="btn-bg" src="./imgs/btn_area.png"></img>
            <img className="game-btn btn-pos1" src="./imgs/round_btn.png"></img>
            <img className="game-btn btn-pos2" src="./imgs/pyrimid_btn.png" onClick={props.camelRun}></img>
            <img className="game-btn btn-pos3" src="./imgs/final_btn.png"></img>
        </div>
    );
}

export default GameBtn;