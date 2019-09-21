import '../css/normalize.css';
import '../css/common.css';
import '../css/pop_up.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import RoundBet from './round_bet';
import FinalBet from './final_bet';
import ReceiveRoundBet from './receive_round_bet';
import RoundInfo from './round_info';
import GameEnd from './game_end';

const PopUp = (props) => {

    const { showCtrl, triggerPop, hideGameStart } = useContext(PopupContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const gameStart = () => {
        hideGameStart();
        props.gameBegin();
    }
    return (
        <div className="avgrund-ready">
            {/* <article className={(showCtrl.isShow)? (showCtrl.showClassNames.container):(showCtrl.hideClassNames.container)}>
                    <button onClick={triggerPop}>Grow it</button>
                </article> */}
            <div className={(showCtrl.isShow || playerData.isShowRoundInfo || playerData.isGameEnd ) ? (showCtrl.showClassNames.cover) : (showCtrl.hideClassNames.cover)}></div>
            <div className={
                    ((showCtrl.isShow || playerData.isShowRoundInfo || playerData.isGameEnd ) ? 
                    (showCtrl.showClassNames.popup):(showCtrl.hideClassNames.popup)) + " " + 
                    ((showCtrl.isRoundBet)? (showCtrl.roundBetClassNames.popup):("")) + " " + 
                    ((showCtrl.isFinalBet)? (showCtrl.finalBetClassNames.popup):("")) + " " + 
                    ((showCtrl.isShowReceiveRoundBet)? (showCtrl.receiveRoundBetClassNames.popup):("")) + " " + 
                    ((playerData.isShowRoundInfo)? (showCtrl.roundInfoClassNames.popup):("")) + " " + 
                    ((playerData.isGameEnd)? (showCtrl.gameEndClassNames.popup):(""))
                }>
                <button className="icon-cross-popup" onClick={ () => { triggerPop(); 
                    (playerData.isShowRoundInfo)? (dispatch({ type: 'CLOSE_ROUND_INFO' })):({})
                    (playerData.isGameEnd)? ({}):({}) }}>
                    <img src="./imgs/cross-3.png" className="icon-cross-img"></img>
                </button>
                {(showCtrl.isRoundBet) ? (<RoundBet />) : ("")}
                {(showCtrl.isFinalBet) ? (<FinalBet />) : ("")}
                {(showCtrl.isShowReceiveRoundBet) ? (<ReceiveRoundBet />) : ("")}
                {(playerData.isShowRoundInfo) ? (<RoundInfo />) : ("")}
                {(playerData.isGameEnd) ? (<GameEnd />) : ("")}
            </div>
            <div className={(showCtrl.isShowGameStart) ? (showCtrl.showGameStartClassNames.cover) : (showCtrl.hideGameStartClassNames.cover)}></div>
            <div className={(showCtrl.isShowGameStart) ? (showCtrl.showGameStartClassNames.popup) : (showCtrl.hideGameStartClassNames.popup)}>
                <div className="start-text">Press to start the game...</div>
                <button className="btn btn-start-style" disabled={!playerData.isLoadSucceed} onClick={gameStart}> Game Start </button>
            </div>
        </div>
    );
}

export default PopUp;