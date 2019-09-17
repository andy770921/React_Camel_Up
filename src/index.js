import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./three_scene";
import PlayerInfo from './components/player';
import PlayerContextProvider from './contexts/playerContext';
import PopupContextProvider from './contexts/popupContext';
import PopUp from './components/pop_up';


class App extends React.Component {
    render() {
        return (
            <div className="background body">
                <PlayerContextProvider>
                    <PopupContextProvider>
                        <PlayerInfo />
                        <PopUp />
                        <ThreeScene />
                    </PopupContextProvider>
                </PlayerContextProvider>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));