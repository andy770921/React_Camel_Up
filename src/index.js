import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./three_scene";
import PlayerInfo from './components/player';
import PlayerContextProvider from './contexts/playerContext';


class App extends React.Component {
    state = {
        name: "Ryu",
        age: 30
    }
    render() {
        return (
            <div className="background body">
                <PlayerContextProvider>
                <PlayerInfo />
                <ThreeScene />
                </PlayerContextProvider>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));