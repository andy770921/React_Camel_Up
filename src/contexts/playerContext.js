import React, { createContext, useReducer } from 'react';
import { playerReducer } from '../reducers/playerReducer';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const [playerData, dispatch] = useReducer(playerReducer, {
        playerRound: 0,
        camelRound: 0,
        players: [
            {name: 'Rita', money: 5, id: 1, cardStock: []},
            {name: 'Josh', money: 15, id: 2, cardStock: []},
            {name: 'Nick', money: 25, id: 3, cardStock: []},
            {name: 'Teresa', money: 35, id: 4, cardStock: []}
        ],
        playerIdNow: 1
    });

  return (
    <PlayerContext.Provider value={{ playerData, dispatch }}>
      {props.children}
    </PlayerContext.Provider>
  );
}
 
export default PlayerContextProvider;