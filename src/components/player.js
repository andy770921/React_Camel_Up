import '../css/normalize.css';
import '../css/common.css';
import '../css/player.css';
import React, { useContext } from "react";
import { PlayerContext } from '../contexts/playerContext';

const PlayerInfo = () => {
    const { playerData } = useContext(PlayerContext);
    let playerList = playerData.players.map((element, i) => {
        return (
            <div className="player-bg" key={7000 + i}>
                <img className="bg-img" src="./imgs/player_info.png" key={8000 + i}></img>
                <img className="coin-img" src="./imgs/coin.png" key={8050 + i}></img>
                <img className="head-img" src={`./imgs/head_${element.id}.png`} key={8100 + i}></img>
                <div className="num-id"> { element.id } </div>
                <div className="num-money"> x { element.money } </div>
            </div>
        )
    });

    return (
        <div className="player-area">
            {playerList}
            {/* <p>Currently you have {playerData.players.length} books to get through...</p> */}
        </div>
    );
}

export default PlayerInfo;