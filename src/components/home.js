import '../css/normalize.css';
import '../css/common.css';
import '../css/home.css';
import React , { useContext, useEffect } from "react";
import { HomeContext } from '../contexts/homeContext';
import Navbar from './nav_bar';

const Home = () => {
    const { homeData, nextImg } = useContext(HomeContext);
    let nextImgSetting = [];
    useEffect(() => {
        nextImgSetting = window.setTimeout( nextImg, 3000);
    }, [homeData.imgIndexNow]);

    return (
        <div className="home-div">
            <Navbar />
            <div className="logo-div">
                <div className="logo" id="logo-no1">CAMEL</div>
                <div className="logo" id="logo-no2">UP</div>
                <div className="subtitle"> Multi-player Board Game</div>
            </div>
            <div className="bullet-div">
                <div className="introduction-div box-shadow-effect" onClick={()=> { window.clearTimeout(nextImgSetting); nextImg();} }>
                    <div className={`introduction-img ${homeData.imgInClassName}`} style={{ backgroundImage: homeData.imgUrls[homeData.imgIndexNow] }}></div>
                    <div className={`introduction-img ${homeData.imgOutClassName}`} style={{ backgroundImage: homeData.imgUrls[homeData.imgIndexBefore] }}></div>
                </div>
            </div>
        </div>
    );
}

export default Home;