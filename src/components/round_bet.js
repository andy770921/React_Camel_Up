import '../css/normalize.css';
import '../css/common.css';
import '../css/round_bet.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { PlayerContext } from '../contexts/playerContext';
import { RoundContext } from '../contexts/roundContext';
import { TweenLite, TimelineMax, CSSPlugin, AttrPlugin } from "gsap/all";
const plugins = [ CSSPlugin, AttrPlugin ]; //without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...

const RoundBet = () => {

    const { triggerPop, showReceiveRoundBet } = useContext(PopupContext);
    const { roundCards, sendSelectedCard, sendConfirmedCard } = useContext(RoundContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const selectCard = (e) => {
        TweenLite.set(".cardWrapper", { perspective: 800 });
        TweenLite.set(".card", { transformStyle: "preserve-3d" });
        TweenLite.set(".back", { rotationY: -180 });
        TweenLite.set([".back", ".front"], { backfaceVisibility: "hidden" });

        let tl = new TimelineMax();
        // 重設所有卡片，使旋轉歸零與外框顏色歸零
        for (let i = 1; i <= 4; i++ ){
            tl.set(`#card_${i + 9000}`, { rotationY: -0,  boxShadow: "none" });
        }
        // 加入旋轉動畫，及外框顏色 RWD
        if (window.innerWidth >= 401 && window.innerWidth < 600 ) {
            tl.to(`#${e.currentTarget.id}`, 1.3, { rotationY: -360 }).to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 6px #a1dffd"});
        } else if (window.innerWidth >= 201 && window.innerWidth < 400 ) {
            tl.to(`#${e.currentTarget.id}`, 1.3, { rotationY: -360 }).to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 4.5px #a1dffd"});
        } else {
            tl.to(`#${e.currentTarget.id}`, 1.3, { rotationY: -360 }).to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd"});
        }
        sendSelectedCard({color: e.currentTarget.getAttribute("color"), 
                        rewards: e.currentTarget.getAttribute("rewards"), 
                        id: parseInt(e.currentTarget.id.substr(5))-9000 });
    }

    const confirmCard = () => {
        sendConfirmedCard(roundCards.selectedCard);
        dispatch({ type: 'ADD_ROUND_CARD_END_TURN', cardObj: roundCards.selectedCard, playerId: playerData.playerIdNow });
        showReceiveRoundBet();
    }
    const roundCardList = roundCards.cards.length ? (
        roundCards.cards.map((element) => {
            return (
                <div key={element.id + 9000} className={`bet-card-div`}>
                    <div className="card" id={`card_${element.id + 9000}`} onClick={(e) => (parseInt(element.rewards) !== 0)? (selectCard(e)):({})} color={element.color} rewards={element.rewards}>
                        <img src={`./imgs/bet_${element.color}_${element.rewards}.jpg`} className="bet-card-img front" style={(parseInt(element.rewards) === 0)? {cursor: 'default'}: {} }></img>
                        <img src="./imgs/bet_back.jpg" className="bet-card-back back"></img>
                    </div></div>)
        })
    ) : ("");
    const roundCardPage = 
        <div className="flex-column"> 
            <span className="banner">Bet Round Winner</span>
            <div className="flex-row">{roundCardList}</div> 
            <div className="flex-row selected-card-div">
                <span className="flex-row selected-card-span">Card selected: </span> 
                <img src={ (Object.keys(roundCards.selectedCard).length !== 0 )? 
                    (`./imgs/bet_${roundCards.selectedCard.color}_${roundCards.selectedCard.rewards}.jpg`) : ("./imgs/bet_back.jpg")} 
                    className="selected-card-img"></img>
            </div> 
            <div className="flex-row btn-div">
                <button className="btn" onClick={ () => (Object.keys(roundCards.selectedCard).length !== 0 )? 
                        (confirmCard()):( alert("Please select card first.")) }>Confirm</button>
                <button className="btn" onClick={triggerPop}>Cancel</button>
            </div>
        </div>;

    return roundCardPage;
}

export default RoundBet;