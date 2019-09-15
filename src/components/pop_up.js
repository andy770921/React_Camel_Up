import '../css/normalize.css';
import '../css/common.css';
import '../css/pop_up.css';
import React, { useContext }  from "react";
import { PopupContext } from '../contexts/popupContext';


const PopUp = () => {
    const { showCtrl, triggerPop } = useContext(PopupContext);

    return (
            <div className="avgrund-ready">
                {/* <article className={(showCtrl.isShow)? (showCtrl.showClassNames.container):(showCtrl.hideClassNames.container)}>
                    <button onClick={triggerPop}>Grow it</button>
                </article> */}
                <div className={(showCtrl.isShow)? (showCtrl.showClassNames.cover):(showCtrl.hideClassNames.cover)}></div>
                <aside className={(showCtrl.isShow)? (showCtrl.showClassNames.popup):(showCtrl.hideClassNames.popup)}>
                    <button onClick={triggerPop}>Close</button>
                </aside>
            </div>
    );
}

export default PopUp;