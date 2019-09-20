import React, { createContext, useState } from 'react';

export const PopupContext = createContext();

const PopupContextProvider = (props) => {
    const [showCtrl, setShowCtrl] = useState({
        isShow: false,
        showClassNames: { container: 'avgrund-contents content-active no-transition', popup: 'avgrund-popup avgrund-active', cover: 'avgrund-cover' },
        hideClassNames: { container: 'avgrund-contents no-transition', popup: 'avgrund-popup', cover: '' },
        isRoundBet: false,
        roundBetClassNames: { popup: 'round-bet-popup' },
        isFinalBet: false,
        finalBetClassNames: { popup: 'final-bet-popup' },
        isShowGameStart: true,
        showGameStartClassNames: { popup: 'avgrund-popup avgrund-active start-bg', cover: 'game-start-cover' },
        hideGameStartClassNames: { popup: 'avgrund-popup', cover: '' }
    });
    const triggerPop = () => {
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow, isRoundBet: false, isFinalBet: false });
    }
    const showRoundBet = () => {
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow, isRoundBet: true });
    }
    const showFinalBet = () => {
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow, isFinalBet: true });
    }
    const hideGameStart = () => {
        setShowCtrl({ ...showCtrl, isShowGameStart: false});
    }

    return (
        <PopupContext.Provider value={{ showCtrl, triggerPop, showRoundBet, showFinalBet, hideGameStart }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export default PopupContextProvider;