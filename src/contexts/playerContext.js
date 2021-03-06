import React, { createContext, useReducer } from 'react';
import { playerReducer } from '../reducers/playerReducer';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const [playerData, dispatch] = useReducer(playerReducer, {
        playerRound: -4,
        camelRound: -4,
        players: [
            {name: 'Rita', money: 10, id: 1, cardStock: []},
            {name: 'Josh', money: 10, id: 2, cardStock: []},
            {name: 'Nick', money: 10, id: 3, cardStock: []},
            {name: 'Teresa', money: 10, id: 4, cardStock: []}
        ],
        playerIdNow: 1,
        isLoadSucceed: false,
        isShowRoundInfo: false,
        roundInfo: {},
        isGameEnd: false
    });

  return (
    <PlayerContext.Provider value={{ playerData, dispatch }}>
      {props.children}
    </PlayerContext.Provider>
  );
}
 
export default PlayerContextProvider;