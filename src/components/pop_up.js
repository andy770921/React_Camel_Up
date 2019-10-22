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
import Loading from './loading';


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

    const coverClassName = () => {
        const showOrNot = showCtrl.isShow || playerData.isShowRoundInfo || playerData.isGameEnd;
        return showOrNot ? (showCtrl.showClassNames.cover) : (showCtrl.hideClassNames.cover);
    }
    const popupClassName = () => {
        let className = "";
        const showOrNot = showCtrl.isShow || playerData.isShowRoundInfo || playerData.isGameEnd;
        if (showOrNot === true) {
            className = showCtrl.showClassNames.popup;
            if (showCtrl.isRoundBet) { 
                className = className + " " + showCtrl.roundBetClassNames.popup; 
            } else if (showCtrl.isFinalBet) {
                className = className + " " + showCtrl.finalBetClassNames.popup; 
            } else if (showCtrl.isShowReceiveRoundBet) {
                className = className + " " + showCtrl.receiveRoundBetClassNames.popup;
            } else if (playerData.isShowRoundInfo) {
                className = className + " " + showCtrl.roundInfoClassNames.popup;
            } else if (playerData.isGameEnd) {
                className = className + " " + showCtrl.gameEndClassNames.popup;
            }
        } else {
            className = showCtrl.hideClassNames.popup;
        }
        return className;
    }
    const popupContent = () => {
        if (showCtrl.isRoundBet) { 
            return <RoundBet />;
        } else if (showCtrl.isFinalBet) { 
            return <FinalBet />;
        } else if (showCtrl.isShowReceiveRoundBet) { 
            return <ReceiveRoundBet />;
        } else if (playerData.isShowRoundInfo) { 
            return <RoundInfo />;
        } else if (playerData.isGameEnd) { 
            return <GameEnd gameRestart={gameRestart}/>;
        } else {
            return;
        }
    }
    const gameStartCoverClassName = () => {
        const showGameStartOrNot = showCtrl.isShowGameStart;
        return showGameStartOrNot ? (showCtrl.showGameStartClassNames.cover) : (showCtrl.hideGameStartClassNames.cover);
    }
    const gameStartDivClassName = () => {
        const showGameStartOrNot = showCtrl.isShowGameStart;
        return showGameStartOrNot ? (showCtrl.showGameStartClassNames.popup) : (showCtrl.hideGameStartClassNames.popup);
    }
    const closePopup = () => {
        triggerPop(); 
        if (playerData.isShowRoundInfo){ 
            dispatch({ type: 'CLOSE_ROUND_INFO' });
        } else if (playerData.isGameEnd) {
            gameRestart();
        }
    }
    const gameStartContent =
        <>
        <div className="start-text" style={(playerData.isLoadSucceed)? {} : { display: 'none'}}>Press to start the game...</div>
        <button className="btn btn-start-style" 
                disabled={!playerData.isLoadSucceed} 
                onClick={gameStart} 
                style={(playerData.isLoadSucceed)? {} : { display: 'none'}}> 
                Game Start </button>
        </>;

    return (
        <div className="avgrund-ready">
            <div className={ coverClassName() }></div>
            <div className={ popupClassName() }>
                <button className="icon-cross-popup" onClick={ closePopup }
                    style={(playerData.isGameEnd || playerData.isShowRoundInfo)? { display: 'none'} : {}}>
                    <img src="./imgs/cross-3.png" className="icon-cross-img"></img>
                </button>
                { popupContent() }
            </div>
            <div className={ gameStartCoverClassName() }></div>
            <div className={ gameStartDivClassName() }>
                { gameStartContent }
                <Loading />
            </div>
        </div>
    );
}

export default PopUp;