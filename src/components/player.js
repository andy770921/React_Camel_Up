import '../css/normalize.css';
import '../css/common.css';
import '../css/player.css';
import React, { useContext } from "react";
import { PlayerContext } from '../contexts/playerContext';

const PlayerInfo = () => {
    const { playerData } = useContext(PlayerContext);
    let sortedPlayerArray = [ Object.assign({}, playerData.players[0]), Object.assign({},  playerData.players[1]),
    Object.assign({}, playerData.players[2]), Object.assign({}, playerData.players[3])].sort( function(a,b) { return a.id - b.id });
    
    let playerList = sortedPlayerArray.map((element, i) => {
        let cardList = [];
            for (let j = 0; j < element.cardStock.length; j++){
                const color = element.cardStock[j].color;
                const rewards = element.cardStock[j].rewards;
                cardList.push(<img className={`card-img card-img-pos${j + 1}`} src={`./imgs/bet_${color}_${rewards}.jpg`} key={7100 + (j+1)*(i+100)}></img>);
            }
        return (
            <div className="player-bg" key={7000 + i}>
                <img className="bg-img" src="./imgs/player_info.png" key={8000 + i}></img>
                <img className="coin-img" src="./imgs/coin.png" key={8050 + i}></img>
                <img className="head-img" src={`./imgs/head_${element.id}.png`} key={8100 + i}></img>
                {cardList}
                <div className="num-id"> {element.id} </div>
                <div className="num-money"> x {element.money} </div>
            </div>
        )
    });

    return (
        <div className="player-area">
            {playerList}
        </div>
    );
}

export default PlayerInfo;