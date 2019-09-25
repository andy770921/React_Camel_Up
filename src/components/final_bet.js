import '../css/normalize.css';
import '../css/common.css';
import '../css/final_bet.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { FinalContext } from '../contexts/finalContext';
import { TimelineMax, CSSPlugin, AttrPlugin } from "gsap/all";
const plugins = [ CSSPlugin, AttrPlugin ]; //without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...

const FinalBet = () => {

    const { triggerPop } = useContext(PopupContext);
    const { finalCards, sendSelectedTopCard, switchShow, sendSelectedToPool } = useContext(FinalContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const filterCards = (type) => {
        const playerOwnerCards = finalCards.cards.filter((element) => (parseInt(element.playerOwner) === parseInt(playerData.playerIdNow)));
        let filteredCards = [];
        for (let k = 0; k < finalCards.initialCards.length; k++) {
            filteredCards.push(finalCards.initialCards[k]);
        }
        for (let i = 0; i < playerOwnerCards.length; i++) {
            filteredCards = filteredCards.filter((element) => !(element.color === playerOwnerCards[i].color && element.rank === playerOwnerCards[i].rank));
        }
        filteredCards = filteredCards.filter((element) => ( element.rank === type ));
        return filteredCards;
    }

    const selectTopCard = (e) => {
        let tl = new TimelineMax();
        // 重設所有卡片，使外框顏色歸零
        for (let i = 1; i <= 4; i++) {
            tl.set(`#finalCard_${i + 9000}`, { boxShadow: "none" });
        }
        // 外框出現顏色動畫
        tl.to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd" });

        sendSelectedTopCard({
            color: e.currentTarget.getAttribute("color"),
            rank: "top",
            playerOwner: playerData.playerIdNow,
            order: finalCards.cardsInTopArea + 1
        })
    }
    const selectLastCard = (e) => {
        let tl = new TimelineMax();
        // 重設所有卡片，使外框顏色歸零
        for (let i = 1; i <= 4; i++) {
            tl.set(`#finalCard_${i + 9500}`, { boxShadow: "none" });
        }
        // 外框出現顏色動畫
        tl.to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd" });

        sendSelectedTopCard({
            color: e.currentTarget.getAttribute("color"),
            rank: "last",
            playerOwner: playerData.playerIdNow,
            order: finalCards.cardsInLastArea + 1
        })
    }
    const confirmFinal = () => {
        sendSelectedToPool(finalCards.selectedCard.rank);
        dispatch({ type: 'PLAYER_ROUND_ADD' });
        triggerPop();
    }

    const filteredTopCards = filterCards("top");
    const filteredLastCards = filterCards("last");
    const finalTopCardList = filteredTopCards.length ? (
        filteredTopCards.map((element) => {
            return (
                <div key={element.id + 9000} id={`finalCard_${element.id + 9000}`} className="final-card-div" onClick={(e) => selectTopCard(e)} color={element.color}>
                    <img src={`./imgs/final_top_${element.color}.png`} className="final-card-img"></img>
                </div>)
        })
    ) : ("");
    const finalLastCardList = filteredLastCards.length ? (
        filteredLastCards.map((element) => {
            return (
                <div key={element.id + 9500} id={`finalCard_${element.id + 9500}`} className="final-card-div" onClick={(e) => selectLastCard(e)} color={element.color}>
                    <img src={`./imgs/final_last_${element.color}.png`} className="final-card-img"></img>
                </div>)
        })
    ) : ("");

    const finalCardPage =
        <div className="flex-column">
            <span className="banner">Bet Final Ranking</span>
            <div className="flex-toggle">
                <span className="toggle-span-left">Champion Camel</span>
                <input className="toggle" type="checkbox" name="check" onChange={(e)=>{switchShow(e.currentTarget.checked);}}/>
                <span className="toggle-span-right">Last Camel</span>
            </div>
            <div className="flex-row">{(finalCards.isShowTopWinner)? (finalTopCardList): (finalLastCardList) }</div>
            <div className="flex-row btn-div">
                <button className="btn" onClick={ () => (Object.keys(finalCards.selectedCard).length !== 0 )? 
                        (confirmFinal()):( alert("Please select card first.")) }>Confirm</button>
                <button className="btn" onClick={triggerPop}>Cancel</button>
            </div>
        </div>;

    return (
        finalCardPage
    );
}

export default FinalBet;