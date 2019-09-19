import React, { createContext, useState } from 'react';

export const FinalContext = createContext();

const FinalContextProvider = (props) => {
    const [finalCards, setFinalCards] = useState({
        initialCards: [
            { color: 'orange', rank: 'top', id: 1 },
            { color: 'green', rank: 'top', id: 2 },
            { color: 'red', rank: 'top', id: 3 },
            { color: 'blue', rank: 'top', id: 4 }],
        cardsInBetArea: 0,
        cards: [
            { color: 'orange', rank: 'top', playerOwner: 4, order: 1 },
            { color: 'orange', rank: 'top', playerOwner: 3, order: 2 },
            { color: 'orange', rank: 'top', playerOwner: 2, order: 3 },
            { color: 'green', rank: 'top', playerOwner: 1, order: 4 },            
            { color: 'orange', rank: 'last', playerOwner: 4, order: 1 },
            { color: 'orange', rank: 'last', playerOwner: 3, order: 2 },
            { color: 'orange', rank: 'last', playerOwner: 2, order: 3 },
            { color: 'green', rank: 'last', playerOwner: 1, order: 4 }],
        selectedCard: {}
    });
    const sendSelectedTopCard = (cardObj) => {
        console.log("hi",cardObj);
        setFinalCards({ ...finalCards, selectedCard: cardObj });
    }

    return (
        <FinalContext.Provider value={{ finalCards, sendSelectedTopCard }}>
            {props.children}
        </FinalContext.Provider>
    );
}

export default FinalContextProvider;