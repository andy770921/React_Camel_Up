import '../css/normalize.css';
import '../css/common.css';
import '../css/round_info.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';


const RoundInfo = () => {

    const { triggerPop } = useContext(PopupContext);
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
                <span key={i + 23000} style={{color: `${colorHex}`}}> {element}
                    <span  key={i + 25000} style={{color: 'black'}}>{(i < playerData.roundInfo.camelsRanking.length - 1) ? (" >") : ("")}</span>
                </span>)
        })
    ) : ("");
    const sortedPlayersArray = Object.keys(playerData.roundInfo).length ?
        playerData.roundInfo.playersMoney.sort(function (a, b) { return a.id - b.id }) : ([]);
    const playersRankingList = sortedPlayersArray.length ? (
        sortedPlayersArray.map((element, i) => {
            return (
                <div key={i + 26000} className={(i % 2 === 0) ? ("content-text-left") : ("content-text-right")}>
                    {element.name}'s : {element.moneyFrom}
                    {(element.moneyTo - element.moneyFrom >= 0) ? (" + ") : (" - ")}
                    {Math.abs(element.moneyTo - element.moneyFrom)} => {element.moneyTo}
                </div>)
        })
    ) : ("");

    const infoMsg =
        <div className="flex-column">
            <div className="banner info-title"> Round Finished! </div>
            <div className="info-content">
                <div className="content-title"> Camels Ranking: <br /> </div>
                <div>{camelsRankingList} <br /> </div>
                <div className="content-title"> Player's Money: <br /> </div>
                <div className="content-flex">{playersRankingList}</div>
            </div>
            <div className="flex-row btn-div">
                <button className="btn" onClick={() => {
                    triggerPop();
                    dispatch({ type: 'CLOSE_ROUND_INFO' });
                }}>
                    Confirm</button>
            </div>
        </div>;

    return (
        infoMsg
    );
}

export default RoundInfo;