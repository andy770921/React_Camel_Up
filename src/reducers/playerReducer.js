
export const playerReducer = (state, action) => {
    let selectedPlayer = [];
    let newPlayerArray =  [];
    switch (action.type) {
        case 'ADD_MONEY':
            selectedPlayer = state.players.find(element => (element.id === action.playerId));
            return {...state, 
                players: [...state.players.filter(element => (element.id !== action.playerId)),
                { ...selectedPlayer, ...{ money: selectedPlayer.money + action.amount } }]
            };
        case 'PLAYER_AND_CAMEL_ROUND_ADD':
            return {...state, 
                playerRound: state.playerRound + 1,
                camelRound: state.camelRound + 1,
                playerIdNow: ((state.playerRound + 1) % state.players.length ) + 1
            };
        case 'CLEAR_USER_CARD_STOCK':
            newPlayerArray = [ Object.assign({}, state.players[0]), Object.assign({}, state.players[1]),
                               Object.assign({}, state.players[2]), Object.assign({}, state.players[3])];
            for (let i = 0; i < newPlayerArray.length; i++ ){
                newPlayerArray[i].cardStock =[];
            }
            return {...state, 
                players: newPlayerArray
            };
        case 'COUNT_ROUND_BET':
            newPlayerArray = [ Object.assign({}, state.players[0]), Object.assign({}, state.players[1]),
                               Object.assign({}, state.players[2]), Object.assign({}, state.players[3])];

            for (let i = 0; i < state.players.length; i++ ){
                for (let j = 0; j < state.players[i].cardStock.length; j++ ){
                    if (state.players[i].cardStock[j].color === action.camelsRanking[0]){
                        // 賭中第一名
                        newPlayerArray[i].money += parseInt(newPlayerArray[i].cardStock[j].rewards);
                    } else if (state.players[i].cardStock[j].color === action.camelsRanking[1]){
                        // 賭中第二名
                        newPlayerArray[i].money += 1;
                    } else {
                        // 賭中第三或四名
                        newPlayerArray[i].money -= 1;
                    }
                }
            }

            alert(` Round Finished! \r\n 
                Camels Ranking: ${action.camelsRanking[0]} > ${action.camelsRanking[1]} > ${action.camelsRanking[2]} > ${action.camelsRanking[3]} \r\n  
                ${state.players[0].name}'s Money: ${state.players[0].money} ->  ${newPlayerArray[0].money} \r\n 
                ${state.players[1].name}'s Money: ${state.players[1].money} ->  ${newPlayerArray[1].money} \r\n 
                ${state.players[2].name}'s Money: ${state.players[2].money} ->  ${newPlayerArray[2].money} \r\n 
                ${state.players[3].name}'s Money: ${state.players[3].money} ->  ${newPlayerArray[3].money} \r\n 
            `);
            return {...state, 
                players: newPlayerArray,
                isShowRoundInfo: true,
                roundInfo: {camelsRanking: action.camelsRanking, playersMoney: [
                    {id :state.players[0].id, name: state.players[0].name, moneyFrom: state.players[0].money, moneyTo: newPlayerArray[0].money},
                    {id :state.players[1].id, name: state.players[1].name, moneyFrom: state.players[1].money, moneyTo: newPlayerArray[1].money},
                    {id :state.players[2].id, name: state.players[2].name, moneyFrom: state.players[2].money, moneyTo: newPlayerArray[2].money},
                    {id :state.players[3].id, name: state.players[3].name, moneyFrom: state.players[3].money, moneyTo: newPlayerArray[3].money}
                ]}
            };
        case 'ADD_ROUND_CARD_END_TURN':
            selectedPlayer = state.players.find(element => (element.id === action.playerId));
            return {...state, 
                playerRound: state.playerRound + 1,
                playerIdNow: ((state.playerRound + 1) % state.players.length ) + 1,
                players: [...state.players.filter(element => (element.id !== action.playerId)),
                { ...selectedPlayer, ...{ cardStock: [...selectedPlayer.cardStock, action.cardObj] }}]
            };
        case 'LOAD_SUCCEED':
            return {...state, 
                isLoadSucceed: true
            };
        case 'CLOSE_ROUND_INFO':
            return {...state, 
                isShowRoundInfo: false,
                roundInfo: {}
            };
        case 'TEST':
            console.log("hi");
            return state;
        default:
            return state;
    }
};