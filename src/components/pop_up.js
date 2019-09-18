import '../css/normalize.css';
import '../css/common.css';
import '../css/pop_up.css';
import React, { useContext } from "react";
import { PopupContext } from '../contexts/popupContext';
import RoundBet from './round_bet';
import FinalBet from './final_bet';


const PopUp = () => {

    const { showCtrl, triggerPop } = useContext(PopupContext);

    return (
        <div className="avgrund-ready">
            {/* <article className={(showCtrl.isShow)? (showCtrl.showClassNames.container):(showCtrl.hideClassNames.container)}>
                    <button onClick={triggerPop}>Grow it</button>
                </article> */}
            <div className={(showCtrl.isShow) ? (showCtrl.showClassNames.cover) : (showCtrl.hideClassNames.cover)}></div>
                <div className={((showCtrl.isShow)? (showCtrl.showClassNames.popup):(showCtrl.hideClassNames.popup)) +" " + 
                ((showCtrl.isRoundBet)? (showCtrl.roundBetClassNames.popup):(""))}>
                <button onClick={triggerPop} className="icon-cross-popup"><img src="./imgs/cross-3.png" className="icon-cross-img"></img></button>
                {(showCtrl.isRoundBet) ? (<RoundBet />) : ("")}
                {(showCtrl.isFinalBet) ? (<FinalBet />) : ("")}
            </div>
        </div>
    );
}

export default PopUp;