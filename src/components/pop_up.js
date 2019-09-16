import '../css/normalize.css';
import '../css/common.css';
import '../css/pop_up.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import { TweenLite, TimelineMax } from "gsap/all";


const PopUp = () => {

    const { showCtrl, triggerPop, roundCards, sendSelectedCard, sendConfirmedCard } = useContext(PopupContext);

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
        // 加入旋轉動畫
        tl.to(`#${e.currentTarget.id}`, 1.3, { rotationY: -360 }).to(`#${e.currentTarget.id}`, 0.2, { boxShadow: "0 0 1px 11px #a1dffd"});
        //.to(`#${e.currentTarget.id}`, 1, {scale:.6, bottom: -200, left:0})

        sendSelectedCard({color: e.currentTarget.getAttribute("color"), 
                        rewards: e.currentTarget.getAttribute("rewards"), 
                        id: parseInt(e.currentTarget.id.substr(5))-9000 });
    }


    const roundCardList = roundCards.cards.length ? (
        roundCards.cards.map((element, i) => {
            return (
                <div key={element.id + 9000} className={`bet-card-div`}>
                    <div className="card" id={`card_${element.id + 9000}`} onClick={(e) => selectCard(e)} color={element.color} rewards={element.rewards}>
                        <img src={`./imgs/bet_${element.color}_${element.rewards}.png`} className="bet-card-img front"></img>
                        <img src="./imgs/bet_back.png" className="bet-card-back back"></img>
                    </div></div>)
        })
    ) : ("");
    const roundCardPage = 
        <div className="flex-column"> 
            <div className="flex-row">{roundCardList}</div> 
            <div className="flex-row selected-card-div">
                <span className="flex-row selected-card-span">Card selected: </span> 
                <img src={ (Object.keys(roundCards.selectedCard).length !== 0 )? 
                    (`./imgs/bet_${roundCards.selectedCard.color}_${roundCards.selectedCard.rewards}.png`) : ("./imgs/bet_back.png")} 
                    className="selected-card-img"></img>
            </div> 
            <div className="flex-row btn-div">
                <button className="btn" onClick={ () => (Object.keys(roundCards.selectedCard).length !== 0 )? 
                        (sendConfirmedCard(roundCards.selectedCard)):( alert("Please select card first.")) }>Confirm</button>
                <button className="btn" onClick={triggerPop}>Cancel</button>
            </div>
        </div>;

    return (
        <div className="avgrund-ready">
            {/* <article className={(showCtrl.isShow)? (showCtrl.showClassNames.container):(showCtrl.hideClassNames.container)}>
                    <button onClick={triggerPop}>Grow it</button>
                </article> */}
            <div className={(showCtrl.isShow) ? (showCtrl.showClassNames.cover) : (showCtrl.hideClassNames.cover)}></div>
                <div className={((showCtrl.isShow)? (showCtrl.showClassNames.popup):(showCtrl.hideClassNames.popup)) +" " + 
                ((showCtrl.isRoundBet)? (showCtrl.roundBetClassNames.popup):(""))}>
                <button onClick={triggerPop} className="icon-cross-popup"><img src="./imgs/cross-3.png" className="icon-cross-img"></img></button>
                {(showCtrl.isRoundBet) ? (roundCardPage) : ("")}
            </div>
        </div>
    );
}

export default PopUp;