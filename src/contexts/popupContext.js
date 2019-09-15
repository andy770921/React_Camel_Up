import React, { createContext, useState } from 'react';

export const PopupContext = createContext();

const PopupContextProvider = (props) => {
    const [showCtrl, setShowCtrl] = useState({
        isShow: false,
        showClassNames: { container: 'avgrund-contents avgrund-active no-transition', popup: 'avgrund-popup avgrund-active', cover: 'avgrund-cover' },
        hideClassNames: { container: 'avgrund-contents no-transition', popup: 'avgrund-popup', cover: '' }
    });
    const triggerPop = () => {
        // console.log("hi");
        // console.log(showCtrl.isShow);
        // console.log(showCtrl.showClassNames);
        setShowCtrl({ ...showCtrl, isShow: !showCtrl.isShow });
    }

    return (
        <PopupContext.Provider value={{ showCtrl, triggerPop }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export default PopupContextProvider;