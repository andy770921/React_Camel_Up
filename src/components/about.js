import '../css/normalize.css';
import '../css/common.css';
import '../css/about.css';
import React from 'react';
import NavbarAboutPage from './nav_bar_about_page';

const About = () => {
    return (
        <div>
            <NavbarAboutPage />
            <div className="tutorials-bg z-neg-2"></div>
            <div className="opening z-neg-1"></div>
            <div className="opening-inner about-inner">
                <div className="common-title">About</div>
                <div className="about-subtitle common-subtitle">Story and Acknowledgments</div>
            </div>
            <div className="section-about-page">
                <div className="section flex-column about-section">
                    <div className="section-inner section-margin-bottom about-section-inner">
                        <h1 className="title-ch title-content">開發故事</h1>
                        <p>&ensp;&ensp;&ensp;&ensp;開發者為周仰皓，為前端工程師。試圖透過網頁，還原出桌遊當下，燒腦競賽、緊張刺激的氣氛。玩法可參考桌遊駱駝大賽的規則，或參照 Guide 頁面圖文說明。</p>
                    </div>
                    <div className="section-inner about-section-inner">
                        <h1 className="title-ch title-content">特別感謝</h1>
                        <p>&ensp;&ensp;&ensp;&ensp;程式碼的完善及使用者體驗的改良，感謝彭彭、Enid、Rita、Teresa、Josh、Ggag、Danial、Ted 的幫忙與協助。</p>
                        <p>&ensp;&ensp;&ensp;&ensp;3D 的場景，感謝王靜儀協助打造駱駝棋子。</p>
                    </div>
                    <div className="shadow"></div>
                </div>
            </div>
        </div>
    );
}

export default About;