import '../css/normalize.css';
import '../css/common.css';
import '../css/loading.css';
import React, { useContext } from "react";
import { PlayerContext } from '../contexts/playerContext';

const Loading = () => {
    const { playerData } = useContext(PlayerContext);

    const LoadingDiv =
        <div className="load-div" style={(playerData.isLoadSucceed) ? { display: 'none' } : {}}>
            <div className="camel-holder">
                <img src="./imgs/camel_red_noback.png" className="small-camel"></img>
                <img src="./imgs/camel_green_noback.png" className="small-camel"></img>
            </div>
            <div className="letter-holder">
                <div className="l-1 loading-letter start-text">L</div>
                <div className="l-2 loading-letter start-text">o</div>
                <div className="l-3 loading-letter start-text">a</div>
                <div className="l-4 loading-letter start-text">d</div>
                <div className="l-5 loading-letter start-text">i</div>
                <div className="l-6 loading-letter start-text">n</div>
                <div className="l-7 loading-letter start-text">g</div>
                <div className="l-8 loading-letter start-text">.</div>
                <div className="l-9 loading-letter start-text">.</div>
                <div className="l-10 loading-letter start-text">.</div>
            </div>
            <div className="camel-holder">
                <img src="./imgs/camel_orange_noback.png" className="small-camel"></img>
                <img src="./imgs/camel_blue_noback.png" className="small-camel"></img>
            </div>
        </div>;

    return LoadingDiv;
}

export default Loading;