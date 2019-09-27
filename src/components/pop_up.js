import '../css/normalize.css';
import '../css/common.css';
import '../css/pop_up.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { RoundContext } from '../contexts/roundContext';
import { FinalContext } from '../contexts/finalContext';
import RoundBet from './round_bet';
import FinalBet from './final_bet';
import ReceiveRoundBet from './receive_round_bet';
import RoundInfo from './round_info';
import GameEnd from './game_end';


const PopUp = (props) => {

    const { showCtrl, triggerPop, hideGameStart } = useContext(PopupContext);
    const { playerData, dispatch } = useContext(PlayerContext);
    const { initializeCards } = useContext(RoundContext);
    const { initializeFinalCards } = useContext(FinalContext);

    const gameStart = () => {
        hideGameStart();
        props.gameBegin();
    }
    const gameRestart = () => {
        triggerPop();
        initializeCards();
        dispatch({ type: 'START_NEW_GAME' });
        props.boardGameRestart();
        initializeFinalCards();
        window.setTimeout(() => { props.gameBegin(); }, 500);
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
                    (playerData.isShowRoundInfo)? (dispatch({ type: 'CLOSE_ROUND_INFO' })):(function(){})
                    (playerData.isGameEnd)? (gameRestart()):(function(){}) }}
                    style={(playerData.isGameEnd || playerData.isShowRoundInfo)? { display: 'none'} : {}}>
                    <img src="./imgs/cross-3.png" className="icon-cross-img"></img>
                </button>
                {(showCtrl.isRoundBet) ? (<RoundBet />) : ("")}
                {(showCtrl.isFinalBet) ? (<FinalBet />) : ("")}
                {(showCtrl.isShowReceiveRoundBet) ? (<ReceiveRoundBet />) : ("")}
                {(playerData.isShowRoundInfo) ? (<RoundInfo />) : ("")}
                {(playerData.isGameEnd) ? (<GameEnd gameRestart={gameRestart}/>) : ("")}
            </div>
            <div className={(showCtrl.isShowGameStart) ? (showCtrl.showGameStartClassNames.cover) : (showCtrl.hideGameStartClassNames.cover)}></div>
            <div className={(showCtrl.isShowGameStart) ? (showCtrl.showGameStartClassNames.popup) : (showCtrl.hideGameStartClassNames.popup)}>
                <div className="start-text" style={(playerData.isLoadSucceed)? {} : { display: 'none'}}>Press to start the game...</div>
                <button className="btn btn-start-style" disabled={!playerData.isLoadSucceed} onClick={gameStart} 
                        style={(playerData.isLoadSucceed)? {} : { display: 'none'}}> Game Start </button>
                <div className="load-div" style={(playerData.isLoadSucceed)? { display: 'none' } : {}}>
                    <div className="camel-holder">
                        <img src="./imgs/camel_red_noback.png" className="small-camel"></img>
                        <img src="./imgs/camel_green_noback.png" className="small-camel"></img>
                    </div>
                    <div className="letter-holder">
                        <div className="l-1 loading-letter start-text">L</div>
                        <div className="l-2 loading-letter start-text">o</div>
                        <div className="l-3 loading-letter start-text">a</div>
                        <div className="l-4 loading-letter start-text">d</div>
                        <div className="l-5 loading-letter start-text">i</div>
                        <div className="l-6 loading-letter start-text">n</div>
                        <div className="l-7 loading-letter start-text">g</div>
                        <div className="l-8 loading-letter start-text">.</div>
                        <div className="l-9 loading-letter start-text">.</div>
                        <div className="l-10 loading-letter start-text">.</div>
                    </div>
                    <div className="camel-holder">
                        <img src="./imgs/camel_orange_noback.png" className="small-camel"></img>
                        <img src="./imgs/camel_blue_noback.png" className="small-camel"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;