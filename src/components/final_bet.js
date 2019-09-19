import '../css/normalize.css';
import '../css/common.css';
import '../css/final_bet.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { FinalContext } from '../contexts/finalContext';
import { TweenLite, TimelineMax } from "gsap/all";


const FinalBet = () => {

    const { triggerPop } = useContext(PopupContext);
    const { finalCards, sendSelectedTopCard } = useContext(FinalContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const filterCards = () => {
        const playerOwnerCards =  finalCards.cards.filter( (element) => ( parseInt(element.playerOwner) === parseInt(playerData.playerIdNow)));
        let filteredCards = [];
        for (let k = 0; k < finalCards.initialCards.length; k++ ){
            filteredCards.push(finalCards.initialCards[k]);
        }
        for (let i = 0; i < playerOwnerCards.length; i++ ){
            filteredCards = filteredCards.filter( (element) => (element.color !== playerOwnerCards[i].color));
        }
        return filteredCards;
    }

    const selectTopCard = (e) => {
        let tl = new TimelineMax();
        // 重設所有卡片，使外框顏色歸零
        for (let i = 1; i <= 4; i++ ){
            tl.set(`#finalCard_${i + 9000}`, { boxShadow: "none" });
        }
        // 外框出現顏色動畫
        tl.to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd"});

        sendSelectedTopCard({color: e.currentTarget.getAttribute("color"), 
        rank: "top",
        playerOwner: playerData.playerIdNow, 
        order: finalCards.cardsInBetArea + 1
        })
    }
    const filteredCards = filterCards();
    const finalCardList = filteredCards.length ? (
        filteredCards.map((element, i) => {
            return (
                <div key={element.id + 9000} id={`finalCard_${element.id + 9000}`} className="final-card-div" onClick={(e) => (true)? (selectTopCard(e)):({})} color={element.color}>
                    <img src={`./imgs/final_top_${element.color}.png`} className="final-card-img"></img>
                </div>)
        })
    ) : ("");
    const finalCardPage = 
        <div className="flex-column"> 
            <div className="flex-row">{finalCardList}</div> 
            <div className="flex-row btn-div">
                <button className="btn" onClick={ () => (console.log(filterCards())) }>Confirm</button>
                <button className="btn" onClick={triggerPop}>Cancel</button>
            </div>
        </div>;

    return (
        finalCardPage
    );
}

export default FinalBet;