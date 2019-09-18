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
    const { finalCards } = useContext(FinalContext);
    const { playerData, dispatch } = useContext(PlayerContext);

    const finalCardPage = 
        <div className="flex-column"> 
            hi
        </div>;

    return (
        finalCardPage
    );
}

export default FinalBet;