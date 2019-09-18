import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./three_scene";
import PlayerInfo from './components/player';
import PopUp from './components/pop_up';
import PlayerContextProvider from './contexts/playerContext';
import PopupContextProvider from './contexts/popupContext';
import RoundContextProvider from './contexts/roundContext';


class App extends React.Component {
    render() {
        return (
            <div className="background body">
                <PlayerContextProvider>
                    <PopupContextProvider>
                        <RoundContextProvider>
                            <PlayerInfo />
                            <PopUp />
                            <ThreeScene />
                        </RoundContextProvider>
                    </PopupContextProvider>
                </PlayerContextProvider>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));