import React, { createContext, useState } from 'react';

export const FinalContext = createContext();

const FinalContextProvider = (props) => {
    const [finalCards, setFinalCards] = useState({
        initialCards: [
            { color: 'orange', rank: 'top', id: 1 },
            { color: 'green', rank: 'top', id: 2 },
            { color: 'red', rank: 'top', id: 3 },
            { color: 'blue', rank: 'top', id: 4 },
            { color: 'orange', rank: 'last', id: 5 },
            { color: 'green', rank: 'last', id: 6 },
            { color: 'red', rank: 'last', id: 7 },
            { color: 'blue', rank: 'last', id: 8 }],
        cardsInTopArea: 0,
        cardsInLastArea: 0,
        cards: [
            // { color: 'orange', rank: 'top', playerOwner: 4, order: 1 },
            // { color: 'orange', rank: 'top', playerOwner: 3, order: 2 },
            // { color: 'orange', rank: 'top', playerOwner: 2, order: 3 },
            // { color: 'green', rank: 'top', playerOwner: 1, order: 4 },            
            // { color: 'orange', rank: 'last', playerOwner: 4, order: 1 },
            // { color: 'orange', rank: 'last', playerOwner: 3, order: 2 },
            // { color: 'orange', rank: 'last', playerOwner: 2, order: 3 },
            // { color: 'green', rank: 'last', playerOwner: 1, order: 4 }
        ],
        selectedCard: {},
        isShowTopWinner: true
    });
    const sendSelectedTopCard = (cardObj) => {
        setFinalCards({ ...finalCards, selectedCard: cardObj });
    }
    const sendSelectedToPool = (type) => {
        if (type === "top") {
            setFinalCards({ ...finalCards, cards: [...finalCards.cards, finalCards.selectedCard],
                             cardsInTopArea: finalCards.cardsInTopArea + 1, selectedCard: {} });
        } else if (type === "last") {
            setFinalCards({ ...finalCards, cards: [...finalCards.cards, finalCards.selectedCard],
                             cardsInLastArea: finalCards.cardsInLastArea + 1, selectedCard: {} });
        }
    }
    const switchShow = (isChecked) => {
        setFinalCards({ ...finalCards, isShowTopWinner: !isChecked });
    }
    const initializeIsShow = () => {
        setFinalCards({ ...finalCards, isShowTopWinner: true });
    }

    return (
        <FinalContext.Provider value={{ finalCards, sendSelectedTopCard, switchShow, sendSelectedToPool, initializeIsShow }}>
            {props.children}
        </FinalContext.Provider>
    );
}

export default FinalContextProvider;