import React, { createContext, useReducer } from 'react';
import { playerReducer } from '../reducers/playerReducer';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const [playerData, dispatch] = useReducer(playerReducer, {
        playerRound: -4,
        camelRound: 0,
        players: [
            {name: 'Josh', money: 5, id: 1},
            {name: 'Rita', money: 5, id: 2},
            {name: 'Teresa', money: 5, id: 3},
            {name: 'Andy', money: 5, id: 4}
        ]
    });

  return (
    <PlayerContext.Provider value={{ playerData, dispatch }}>
      {props.children}
    </PlayerContext.Provider>
  );
}
 
export default PlayerContextProvider;