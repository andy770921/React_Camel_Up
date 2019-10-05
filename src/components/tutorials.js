import '../css/normalize.css';
import '../css/common.css';
import '../css/tutorials.css';
import React, { useState } from 'react';
import NavbarTutorialPage from './nav_bar_tutorial_page';

const Tutorials = () => {
    const [pageNow, setPageNow] = useState(1);
    const content = [
        { 
            title: "遊戲說明",
            details: "這是個類似賭馬的遊戲，四名玩家輪流對場上的駱駝下注、累積金錢。遊戲結束時，錢最多的玩家獲勝", 
            imgUrl: "./imgs/guide-1-large-comp.gif" 
        },
        { 
            title: "遊戲開始", 
            details: "遊戲一開始，會自動擲骰子，骰子會對應到駱駝的移動。四隻駱駝移動完後，玩家可以開始操作", 
            imgUrl: "./imgs/guide-2-large-comp.gif" 
        },        
        { 
            title: "駱駝移動", 
            details: "若下方駱駝的先移動，會帶動上方駱駝一起動。結算時靠近終點線者贏。若兩隻駱駝在同一格，上方的駱駝贏。", 
            imgUrl: "./imgs/guide-3-large-comp.gif" 
        },
        { 
            title: "玩家操作 - 骰骰子", 
            details: "玩家操作共三種可選。若選擇骰骰子，可幫助任意一隻駱駝前進，骰完後會得到 1 元", 
            imgUrl: "./imgs/guide-4-large-comp.gif" 
        },
        { 
            title: "玩家操作 - 賭小局", 
            details: "拿到一張賭注卡。當四種顏色骰子骰完，遊戲會進行小局結算。分配獎金", 
            imgUrl: "./imgs/guide-5-comp.gif" 
        },
        { 
            title: "玩家操作 - 賭終局", 
            details: "放自己的頭像卡在終局下注區。可猜第一個跨越終點線的駱駝，或賭最慢的駱駝", 
            imgUrl: "./imgs/guide-6-large-comp.gif" 
        },        
        { 
            title: "遊戲結束", 
            details: "場上任一駱駝超過終點線時，遊戲即結束。結算玩家的小局及終局獎金後，錢最多的玩家獲勝", 
            imgUrl: "./imgs/guide-7-comp.gif" 
        },
        { 
            title: "補充 - 小局賭金", 
            details: "小局結算時，若該顏色駱駝第一名，第一下注的玩家可得到 5 元，下注越慢獎金越低。駱駝第二名，可得到 1 元。其他，扣 1 元。", 
            imgUrl: "./imgs/guide-8-img.jpg" 
        },
        { 
            title: "補充 - 終局賭金", 
            details: "終局結算時，先下注又猜中的玩家，可以得到最多錢，後依序減低獎金，分別為 8、5、3、2。若沒猜中，則扣 1 元", 
            imgUrl: "./imgs/guide-9-img.jpg" 
        },
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
                    <div className="shadow"></div>
                </div>
            </div>
            </li>
        )
    });

    return (
        <div className="tutorials">
            <NavbarTutorialPage />
            <div className="tutorials-bg"></div>
            <div className="opening"></div>
            <div className="opening-inner">
                <div className="tutorial-title">Guide</div>
                <div className="tutorial-subtitle">All you need to know about this game</div>
            </div>
            <img className="tutorial-gif" src={content[pageNow - 1].imgUrl} alt="tutorial-gif"></img>
            <div className="csslider">
                <input type="radio" name="slides" id="slides_1" defaultChecked="true" />
                <input type="radio" name="slides" id="slides_2" />
                <input type="radio" name="slides" id="slides_3" />
                <input type="radio" name="slides" id="slides_4" />
                <input type="radio" name="slides" id="slides_5" />
                <input type="radio" name="slides" id="slides_6" />
                <input type="radio" name="slides" id="slides_7" />
                <input type="radio" name="slides" id="slides_8" />
                <input type="radio" name="slides" id="slides_9" />
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
                    <label htmlFor="slides_6" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_7" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_8" onClick={(e)=> {updatePageNow(e);}}></label>
                    <label htmlFor="slides_9" onClick={(e)=> {updatePageNow(e);}}></label>
                    {/* <label htmlFor="slides_N"></label> */}
                </div>
                <div className="navigation">
                    <div>
                        <label htmlFor="slides_1" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_2" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_3" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_4" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_5" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_6" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_7" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_8" onClick={(e)=> {updatePageNow(e);}}></label>
                        <label htmlFor="slides_9" onClick={(e)=> {updatePageNow(e);}}></label>
                        {/* <label htmlFor="slides_N"></label> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorials;