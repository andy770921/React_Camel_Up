import '../css/normalize.css';
import '../css/common.css';
import '../css/about.css';
import React from 'react';
import NavbarAboutPage from './nav_bar_about_page';

const About = () => {
    return (
        <div className="tutorials">
            <NavbarAboutPage />
            <div className="tutorials-bg"></div>
            <div className="opening"></div>
            <div className="opening-inner">
                <div className="tutorial-title">About</div>
                <div className="tutorial-subtitle">Development story</div>
            </div>
            <div className="section-about-page">
                <div className="section flex-column">
                    <div className="section-inner section-margin-bottom">
                        <h1 className="title-ch title-middle">開發故事</h1>
                        <p>&ensp;&ensp;&ensp;&ensp;遊戲的玩法，參考桌遊駱駝大賽的規則，試圖透過網頁，還原出桌遊當下，燒腦競賽、緊張刺激的氣氛。</p>
                    </div>
                    <div className="section-inner">
                        <h1 className="title-ch title-middle">特別感謝</h1>
                        <p>&ensp;&ensp;&ensp;&ensp;程式碼上的完善及使用者體驗的改良，感謝彭彭、Enid Tian、Rita Chang、Teresa Hsieh、Josh Yang、Ggag Liu、Danial Lin、Teddy Ku 的幫忙與協助。</p>
                        <p>&ensp;&ensp;&ensp;&ensp;3D 畫面的呈現，感謝 Abbie Wang 協助完成駱駝物件。</p>
                    </div>
                    <div className="shadow"></div>
                </div>
            </div>
        </div>
    );
}

export default About;