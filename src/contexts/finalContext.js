import React, { createContext, useState } from 'react';

export const FinalContext = createContext();

const FinalContextProvider = (props) => {
    const [finalCards, setFinalCards] = useState({
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
    const sendSelectedCard = (cardObj) => {
        setFinalCards({ ...finalCards, selectedCard: cardObj });
    }

    return (
        <FinalContext.Provider value={{ finalCards, sendSelectedCard }}>
            {props.children}
        </FinalContext.Provider>
    );
}

export default FinalContextProvider;