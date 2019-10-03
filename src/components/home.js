import '../css/normalize.css';
import '../css/common.css';
import '../css/home.css';
import React , { useContext, useEffect } from "react";
import { HomeContext } from '../contexts/homeContext';
import Navbar from './nav_bar';

const Home = () => {
    const { homeData, nextImg } = useContext(HomeContext);

    useEffect(() => {
        const nextImgSetting = window.setTimeout( nextImg, 3000);
        return () => {
            window.clearTimeout(nextImgSetting);
        };
    }, [homeData.imgIndexNow]);

    return (
        <div className="home-div">
            <Navbar />
            <div className="logo-div">
                <div className="logo" id="logo-no1">CAMEL</div>
                <div className="logo" id="logo-no2">UP</div>
            </div>
            <div className="subtitle"> Multi-player Board Game</div>
            <div className="bullet-div">
                <div className="introduction-div box-shadow-effect" onClick={()=> { nextImg();} }>
                    <div className={`introduction-img ${homeData.imgInClassName}`} style={{ backgroundImage: homeData.imgUrls[homeData.imgIndexNow] }}></div>
                    <div className={`introduction-img ${homeData.imgOutClassName}`} style={{ backgroundImage: homeData.imgUrls[homeData.imgIndexBefore] }}></div>
                    <div className="introduction-img pre-load-img" 
                         style={{ backgroundImage: (homeData.imgIndexNow !== homeData.imgUrls.length - 1)? homeData.imgUrls[homeData.imgIndexNow + 1 ] : homeData.imgUrls[0] }}></div>
                </div>
            </div>
        </div>
    );
}

export default Home;