import '../css/normalize.css';
import '../css/common.css';
import '../css/game_end.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { FinalContext } from '../contexts/finalContext';
import { withRouter } from "react-router-dom";

const GameEnd = (props) => {

    const { triggerPop } = useContext(PopupContext);
    const { finalCards } = useContext(FinalContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const camelsRankingList = Object.keys(playerData.roundInfo).length ? (
        playerData.roundInfo.camelsRanking.map((element, i) => {
            let colorHex = "";
            switch (element) {
                case "red":
                    colorHex = "#FB0008";
                    break;
                case "orange":
                    colorHex = "#F86B20";
                    break;
                case "green":
                    colorHex = "#2BB82B";
                    break;
                case "blue":
                    colorHex = "#1600F0";
                    break;
                default:
                    colorHex = "";
            }
            return (
                <span key={i + 24000} style={{color: `${colorHex}`}}> {element}
                    <span  key={i + 26000} style={{color: 'black'}}>{(i < playerData.roundInfo.camelsRanking.length - 1) ? (" >") : ("")}</span>
                </span>)
        })
    ) : ("");
    const countFinalMoney = (playerId, originalMoney) => {
        let playerCards = finalCards.cards.filter( element => parseInt(element.playerOwner) === parseInt(playerId));
        let finalMoney = originalMoney;
        for (let i = 0; i < playerCards.length; i++ ){
            if ( playerCards[i].rank === "top") {
                if ( playerCards[i].color === playerData.roundInfo.camelsRanking[0] ){
                    switch (parseInt(playerCards[i].order)) {
                        case 1:
                            finalMoney += 8;
                            break;
                        case 2:
                            finalMoney += 5;
                            break;
                        case 3:
                            finalMoney += 3;
                            break;
                        case 4:
                            finalMoney += 2;
                            break;
                        default:
                            break;
                    }
                } else {
                    finalMoney -= 1;
                } 
            }
            else if ( playerCards[i].rank === "last") {
                if ( playerCards[i].color === playerData.roundInfo.camelsRanking[playerData.roundInfo.camelsRanking.length - 1] ){
                    switch (parseInt(playerCards[i].order)) {
                        case 1:
                            finalMoney += 8;
                            break;
                        case 2:
                            finalMoney += 5;
                            break;
                        case 3:
                            finalMoney += 3;
                            break;
                        case 4:
                            finalMoney += 2;
                            break;
                        default:
                            break;
                    }
                } else {
                    finalMoney -= 1;
                } 
            }
        }
        return finalMoney;
    }
    const finalMoneyArray = Object.keys(playerData.roundInfo).length ? 
        playerData.roundInfo.playersMoney.map(element => {
            let newElement = Object.assign({}, element);
            newElement.moneyTo = countFinalMoney(element.id, newElement.moneyTo);
            return newElement }) : ([]);
    const sortedFinalArray = Object.keys(playerData.roundInfo).length ? 
                        finalMoneyArray.sort(function(a,b) { return a.id - b.id}) : ([]);
    const playersRankingList = sortedFinalArray.length ? (
        sortedFinalArray.map((element, i) => {
            return (
                <div key={i + 28000} className={(i % 2 === 0)? ("end-content-text-left"):("end-content-text-right")}> 
                    {element.name}'s : {element.moneyFrom} 
                    {(element.moneyTo - element.moneyFrom >= 0)? (" + "):(" - ")}
                    {Math.abs(element.moneyTo - element.moneyFrom)} => {element.moneyTo}
                </div>)
        })
    ) : ("");
    let winnerPlayer = "";
    const sortedWinnerArray = finalMoneyArray.sort(function(a,b) { return b.moneyTo - a.moneyTo});

    if (sortedWinnerArray[0].moneyTo > sortedWinnerArray[1].moneyTo ){
        winnerPlayer = sortedWinnerArray[0].name;
    } else if ( (sortedWinnerArray[0].moneyTo === sortedWinnerArray[1].moneyTo) &&
        (sortedWinnerArray[1].moneyTo > sortedWinnerArray[2].moneyTo)){
        winnerPlayer = 
            `${sortedWinnerArray[0].name}, ${sortedWinnerArray[1].name}`;
    } else if ((sortedWinnerArray[0].moneyTo === sortedWinnerArray[1].moneyTo) &&
        (sortedWinnerArray[1].moneyTo === sortedWinnerArray[2].moneyTo) && 
        (sortedWinnerArray[2].moneyTo > sortedWinnerArray[3].moneyTo)){
        winnerPlayer = 
            `${sortedWinnerArray[0].name}, ${sortedWinnerArray[1].name}, ${sortedWinnerArray[2].name}`;
    } else {
        winnerPlayer = "Everyone!";
    }
    const gameEndMsg = 
        <div className="flex-column"> 
            <div className="banner end-info-title game-finish-text"> Game Finished! </div>
            <div className="end-info-content">
                <div className="end-content-title"> Camels Final Ranking: <br/> </div>
                <div className="end-camel-color">{camelsRankingList} </div>
                <div className="end-content-title"> Player's Final Money: <br/> </div>
                <div className="end-content-flex">{playersRankingList}</div>
                <div className="end-content-title pos-relative"> The Winner is ... </div>
                <div className="banner end-info-title winner-name"> {winnerPlayer} </div>
                <img src="./imgs/stamp.png" className="icon-award-img"></img>
            </div>
            
            <div className="flex-row btn-div">
                <button className="btn" onClick={()=>{ triggerPop(); props.gameRestart();
                    }}>
                    Play Again!</button>
                <button className="btn" onClick={()=>{ props.history.push("/"); }}>
                    Exit</button>
            </div>
        </div>;

    return (
        gameEndMsg
    );
}

export default withRouter(GameEnd);