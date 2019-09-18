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
        roundBetClassNames: { popup: 'final-bet-popup' }
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

    return (
        <PopupContext.Provider value={{ showCtrl, triggerPop, showRoundBet, showFinalBet }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export default PopupContextProvider;