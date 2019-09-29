import React, { createContext, useState } from 'react';

export const HomeContext = createContext();

const HomeContextProvider = (props) => {
    const [homeData, setHomeData] = useState({
        imgUrls: [
            "url('./imgs/bullet-scene-1.png')",
            "url('./imgs/bullet-scene-2.png')",
            "url('./imgs/bullet-scene-3.png')",
            "url('./imgs/bullet-scene-4.png')",
            "url('./imgs/bullet-scene-5.png')"],
        imgIndexNow: 0,
        imgIndexBefore: 0,
        imgInClassName: "",
        imgOutClassName: ""
    });
    const clearAni = () => {
        setHomeData({ ...homeData, imgInClassName: "", imgOutClassName: "" });
    }
    const nextImg = () => {
        clearAni();
        if (homeData.imgIndexNow < homeData.imgUrls.length - 1) {
            window.setTimeout(() => {
                setHomeData({ ...homeData, imgIndexNow: homeData.imgIndexNow + 1, imgIndexBefore: homeData.imgIndexNow, imgInClassName: "in", imgOutClassName: "out" });
            }, 50);
        } else if (homeData.imgIndexNow === homeData.imgUrls.length - 1) {
            window.setTimeout(() => {
                setHomeData({ ...homeData, imgIndexNow: 0, imgIndexBefore: homeData.imgUrls.length - 1, imgInClassName: "in", imgOutClassName: "out" });
            }, 50);
        }
    }
    return (
        <HomeContext.Provider value={{ homeData, nextImg }}>
            {props.children}
        </HomeContext.Provider>
    );
}

export default HomeContextProvider;