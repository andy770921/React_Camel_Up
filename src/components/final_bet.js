import '../css/normalize.css';
import '../css/common.css';
import '../css/final_bet.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { FinalContext } from '../contexts/finalContext';
import { TimelineMax, CSSPlugin, AttrPlugin } from "gsap/all";
const plugins = [CSSPlugin, AttrPlugin]; //without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...

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
        filteredCards = filteredCards.filter((element) => (element.rank === type));
        return filteredCards;
    }
    const selectAnimate = (event, type) => {
        let tl = new TimelineMax();
        // 重設所有卡片，使外框顏色歸零
        if (type === "top") {
            for (let i = 1; i <= 4; i++) {
                tl.set(`#finalCard_${i + 9000}`, { boxShadow: "none" });
            }
        } else if (type === "last") {
            for (let i = 1; i <= 4; i++) {
                tl.set(`#finalCard_${i + 9500}`, { boxShadow: "none" });
            }
        }
        // 外框出現顏色動畫，及 RWD
        if (window.innerWidth >= 401 && window.innerWidth < 600) {
            tl.to(`#${event.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 6px #a1dffd" });
        } else if (window.innerWidth >= 201 && window.innerWidth < 400) {
            tl.to(`#${event.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 4.5px #a1dffd" });
        } else {
            tl.to(`#${event.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd" });
        }
    }
    
    const sendInfoToContext = (event, type) => {
        if (type === "top") {
            sendSelectedTopCard({
                color: event.currentTarget.getAttribute("color"),
                rank: "top",
                playerOwner: playerData.playerIdNow,
                order: finalCards.cardsInTopArea + 1
            });
        } else if (type === "last") {
            sendSelectedTopCard({
                color: event.currentTarget.getAttribute("color"),
                rank: "last",
                playerOwner: playerData.playerIdNow,
                order: finalCards.cardsInLastArea + 1
            })
        }
    }
    const selectTopCard = (e) => {
        selectAnimate(e, "top");
        sendInfoToContext(e, "top");
    }
    const selectLastCard = (e) => {
        selectAnimate(e, "last");
        sendInfoToContext(e, "last");
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
                    <img src={`./imgs/final_top_${element.color}.jpg`} className="final-card-img"></img>
                </div>)
        })
    ) : ("");
    const finalLastCardList = filteredLastCards.length ? (
        filteredLastCards.map((element) => {
            return (
                <div key={element.id + 9500} id={`finalCard_${element.id + 9500}`} className="final-card-div" onClick={(e) => selectLastCard(e)} color={element.color}>
                    <img src={`./imgs/final_last_${element.color}.jpg`} className="final-card-img"></img>
                </div>)
        })
    ) : ("");

    const finalCardPage =
        <div className="flex-column">
            <span className="banner">Bet Final Ranking</span>
            <div className="flex-toggle">
                <span className="toggle-span-left">Champion Camel</span>
                <label className="switch"><input className="switch_toggle" type="checkbox" name="check" onChange={(e) => { switchShow(e.currentTarget.checked); }} /><span className="slider round"></span></label>
                <span className="toggle-span-right">Last Camel</span>
            </div>
            <div className="flex-row">{(finalCards.isShowTopWinner) ? (finalTopCardList) : (finalLastCardList)}</div>
            <div className="flex-row btn-div">
                <button className="btn" onClick={() => (Object.keys(finalCards.selectedCard).length !== 0) ?
                    (confirmFinal()) : (alert("Please select card first."))}>Confirm</button>
                <button className="btn" onClick={triggerPop}>Cancel</button>
            </div>
        </div>;

    return (
        finalCardPage
    );
}

export default FinalBet;