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
        initialCards: [
            { color: 'orange', rewards: 5, id: 1 },
            { color: 'green', rewards: 5, id: 2 },
            { color: 'red', rewards: 5, id: 3 },
            { color: 'blue', rewards: 5, id: 4 }],
        cards: [
            { color: 'orange', rewards: 5, id: 1 },
            { color: 'green', rewards: 5, id: 2 },
            { color: 'red', rewards: 5, id: 3 },
            { color: 'blue', rewards: 5, id: 4 }],
        selectedCard: {}
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
        let nextCardObj = {};
        switch (parseInt(cardObj.rewards)) {
            case 5:
                nextCardObj = {color: cardObj.color, rewards: cardObj.rewards -2 , id: cardObj.id };
                break;
            case 3:
                nextCardObj = {color: cardObj.color, rewards: cardObj.rewards -1 , id: cardObj.id };
                break;
            case 2:
                nextCardObj = {color: cardObj.color, rewards: cardObj.rewards -2 , id: cardObj.id };
                break;
            default:
                break;
        }
        const otherCards = roundCards.cards.filter(element => (element.id !== cardObj.id));
        const newCardArray = [...otherCards, nextCardObj];
        const sortedNewArray = newCardArray.sort(function( a, b ) { return a.id - b.id });
        setRoundCards({ ...roundCards, selectedCard: {}, cards: sortedNewArray });
    }
    const initializeCards = () => {
        setRoundCards({ ...roundCards, cards: roundCards.initialCards, selectedCard: {} });
    }
    return (
        <PopupContext.Provider value={{ showCtrl, triggerPop, showRoundBet, roundCards, sendSelectedCard, sendConfirmedCard, initializeCards }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export default PopupContextProvider;