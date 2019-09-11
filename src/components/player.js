import '../css/normalize.css';
import '../css/common.css';
import '../css/player.css';
import React, { useContext }  from "react";
import { PlayerContext } from '../contexts/playerContext';

const PlayerInfo = () => {
    const { playerData } = useContext(PlayerContext);
    let playerList = [1, 2, 3, 4].map( (element, i) => { 
            return (
            <div className="player-bg" key={7000+i}>
                <img className="player-img" src="./imgs/player_info.png" key={8000+i}></img>
            </div>
    )});

    return (
        <div className="player-area">
            {playerList}
            {/* <p>Currently you have {playerData.players.length} books to get through...</p> */}
        </div>
    );
}

export default PlayerInfo;