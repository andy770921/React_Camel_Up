import '../css/normalize.css';
import '../css/common.css';
import '../css/game_end.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { FinalContext } from '../contexts/finalContext';

const GameEnd = () => {

    const { triggerPop } = useContext(PopupContext);
    const { finalCards } = useContext(FinalContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const camelsRankingList = Object.keys(playerData.roundInfo).length ? (
        playerData.roundInfo.camelsRanking.map((element, i) => {
            // let rankingWords = "";
            // switch(i){
            //     case 0:
            //         rankingWords = "1st";
            //         break;
            //     case 1:
            //         rankingWords = "2nd";
            //         break;
            //     case 2:
            //         rankingWords = "3rd";
            //         break;
            //     default:
            //         rankingWords = `${i + 1}th`;
            // }
            return (
                <span key={i + 27000}> {element} 
                    {(i < playerData.roundInfo.camelsRanking.length -1 )? (" >"):("") } 
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

    const gameEndMsg = 
        <div className="flex-column"> 
            <div className="banner end-info-title"> Game Finished! </div>
            <div className="end-info-content">
                <div className="end-content-title"> Camels Ranking: <br/> </div>
                <div>{camelsRankingList} </div>
                <div className="end-content-title"> Player's Money: <br/> </div>
                <div className="end-content-flex">{playersRankingList}</div>
            </div>
            <div className="banner end-info-title"> The Winner is ... {
                finalMoneyArray.sort(function(a,b) { return b.moneyTo - a.moneyTo})[0].name} </div>
            <div className="flex-row btn-div">
                <button className="btn" onClick={()=>{ triggerPop(); 
                    }}>
                    Play Again!</button>
            </div>
        </div>;

    return (
        gameEndMsg
    );
}

export default GameEnd;