import '../css/normalize.css';
import '../css/common.css';
import '../css/receive_round_bet.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';


const ReveiveRoundBet = () => {

    const { triggerPop } = useContext(PopupContext);
    const { playerData } = useContext(PlayerContext);
    const playerNameNow = playerData.players.find(e=> { 
        return e.id === ((playerData.playerIdNow -1 !== 0 )?
                            (playerData.playerIdNow -1 ):(playerData.players.length))}).name;

    const confirmMsg = 
        <div className="flex-column"> 
            <span className="banner receive-text"> Receive {playerNameNow}'s Round Bet</span>
            <div className="flex-row btn-div">
                <button className="btn" onClick={triggerPop}>Confirm</button>
            </div>
        </div>;

    return confirmMsg;
}

export default ReveiveRoundBet;