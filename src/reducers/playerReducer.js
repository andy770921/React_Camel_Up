export const playerReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MONEY':
            let selectedPlayer = state.players.find(element => (element.id === action.playerId));
            return {...state, 
                players: [...state.players.filter(element => (element.id !== action.playerId)),
                { ...selectedPlayer, ...{ money: selectedPlayer.money + action.amount } }]
            };
        case 'PLAYER_ROUND_ADD':
            return {...state, 
                playerRound: state.playerRound + 1
            };
        case 'TEST':
            console.log("hi");
            return state;
        default:
            return state;
    }
};