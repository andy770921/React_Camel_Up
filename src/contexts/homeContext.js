import React, { createContext, useState } from 'react';

export const HomeContext = createContext();

const HomeContextProvider = (props) => {
    const [homeData, setHomeData] = useState({
        imgUrls: [
            "url('./imgs/bullet-scene-1.jpg')",
            "url('./imgs/bullet-scene-2.jpg')",
            "url('./imgs/bullet-scene-3.jpg')",
            "url('./imgs/bullet-scene-4.jpg')",
            "url('./imgs/bullet-scene-5.jpg')"],
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
    const resetCarousel = () => {
        setHomeData({ ...homeData, imgIndexNow: 0, imgIndexBefore: 0, imgInClassName: "", imgOutClassName: "" });
    }
    return (
        <HomeContext.Provider value={{ homeData, nextImg, resetCarousel }}>
            {props.children}
        </HomeContext.Provider>
    );
}

export default HomeContextProvider;