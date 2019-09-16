import React, { createContext, useState } from 'react';

export const PopupContext = createContext();

const PopupContextProvider = (props) => {
    const [showCtrl, setShowCtrl] = useState({
        isShow: false,
        showClassNames: { container: 'avgrund-contents content-active no-transition', popup: 'avgrund-popup avgrund-active', cover: 'avgrund-cover' },
        hideClassNames: { container: 'avgrund-contents no-transition', popup: 'avgrund-popup', cover: '' },
        isRoundBet: false,
        roundBetClassNames: { popup: 'round-bet-popup' }
    });
    const [roundCards, setRoundCards] = useState({
        cards: [
        { color: 'orange', rewards: 5, id: 1 },
        { color: 'green', rewards: 5, id: 2 },
        { color: 'red', rewards: 5, id: 3 },
        { color: 'blue', rewards: 5, id: 4 }],
        selectedCard: {},
        confirmedCard: {}
    });
    const triggerPop = () => {
        // console.log("hi");
        // console.log(showCtrl.isShow);
        // console.log(showCtrl.showClassNames);
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow, isRoundBet: false });
    }
    const showRoundBet = () => {
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow, isRoundBet: true });
    }

    const sendSelectedCard = (cardObj) => {
        setRoundCards({ ...roundCards, selectedCard: cardObj });
    }
    const sendConfirmedCard = (cardObj) => {
        setRoundCards({ ...roundCards, confirmedCard: cardObj });
    }
    return (
        <PopupContext.Provider value={{ showCtrl, triggerPop, showRoundBet, roundCards, sendSelectedCard, sendConfirmedCard }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export default PopupContextProvider;