import '../css/normalize.css';
import '../css/common.css';
import '../css/tutorials.css';
import React, { useState } from 'react';

const Tutorials = () => {
    const [pageNow, setPageNow] = useState(1);
    const content = [
        { title: "遊戲說明", details: "這是一個類似賭馬的遊戲", imgUrl: "./imgs/game-gif-1.gif" },
        { title: "遊戲開始", details: "這是一個類似賭馬的遊戲", imgUrl: "./imgs/game-gif-2.gif" },
        { title: "遊戲按鍵 - 骰", details: "這是一個類似賭馬的遊戲", imgUrl: "./imgs/game-gif-1.gif" },
        { title: "遊戲按鍵 - 賭小局", details: "這是一個類似賭馬的遊戲", imgUrl: "./imgs/game-gif-2.gif" },
        { title: "遊戲按鍵 - 賭終局", details: "這是一個類似賭馬的遊戲", imgUrl: "./imgs/game-gif-1.gif" }
    ];
    const updatePageNow = (e) => {
        let targetSliderName = e.currentTarget.htmlFor;
        setPageNow(parseInt(targetSliderName.slice(-1)));
    }

    const paragraph = content.map((element, i) => {
        return (
            <li key={i + 70}>
            <div className="section-wrap">
                <div className="section">
                    <div className="section-inner">
                        <h1 className="title-ch">{element.title}</h1>
                        <p>{element.details}</p>
                    </div>
                    {/* <div className="section-image"><img className="gif" src={element.imgUrl} alt="tutorial-img"></img></div> */}
                    <div className="shadow"></div>
                </div>
            </div>
            </li>
        )
    });

    return (
        <div className="tutorials">
            <div className="tutorials-bg"></div>
            <div className="opening"></div>
            <div className="opening-inner">
                <div className="tutorial-title">Guide</div>
                <div className="tutorial-subtitle">All you need to know about this game</div>
            </div>
            <img className="tutorial-gif" src={content[pageNow - 1].imgUrl} alt="tutorial-gif"></img>
            {/* <div className="section-wrap">
            <div className="section">
                <div className="section-inner">
                    <h1 className="title-ch">{content[0].title}</h1>
                    <p>{content[0].details}</p>
                </div>

                <div className="section-image"><img className="gif" src="./imgs/game-gif-1.gif" alt="tutorial-img"></img></div>
                <div className="shadow"></div>
            </div>

            <div id="section-two">
                <div id="section-inner-two">
                    <div id="content-two">
                        <h1 class="title" id="cap-two">LOREM IPSUM.</h1>
                        <h1 class="title">Lorem ipsum.</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                    </div>
                </div>

                <div id="section-image-two">
                </div>
                <div id="shadow-two"></div>
                </div>
            </div> */}

            <div className="csslider">
                <input type="radio" name="slides" id="slides_1" defaultChecked="true" />
                <input type="radio" name="slides" id="slides_2" />
                <input type="radio" name="slides" id="slides_3" />
                <input type="radio" name="slides" id="slides_4" />
                <input type="radio" name="slides" id="slides_5" />
                {/* <input type="radio" name="slides" id="slides_N" /> */}
                <ul>
                    {paragraph}
                    {/* <li>Content of slide 1</li>
                    <li>Content of slide 2</li>
                    <li>Content of slide 3</li>
                    <li>Content of slide 4</li>
                    <li>Content of slide 5</li> */}
                </ul>
                <div className="arrows">
                    <label htmlFor="slides_1" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_2" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_3" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_4" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_5" onClick={(e)=> {updatePageNow(e);}}></label>
                    {/* <label htmlFor="slides_N"></label> */}
                </div>
                <div className="navigation">
                    <div>
                        <label htmlFor="slides_1" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_2" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_3" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_4" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_5" onClick={(e)=> {updatePageNow(e);}}></label>
                        {/* <label htmlFor="slides_N"></label> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorials;