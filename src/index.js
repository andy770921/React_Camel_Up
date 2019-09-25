import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./three_scene";
import PlayerInfo from './components/player';
import PopUp from './components/pop_up';
import FinalArea from './components/final_area';
import PlayerContextProvider from './contexts/playerContext';
import PopupContextProvider from './contexts/popupContext';
import RoundContextProvider from './contexts/roundContext';
import FinalContextProvider from './contexts/finalContext';


class App extends React.Component {
    state = {
        passGameBegin: {},
        passGameRestart: {}
    }
    setPassGameBegin = (func) => { 
        this.setState({passGameBegin: func});
    }
    setPassGameRestart = (func) => { 
        this.setState({passGameRestart: func});
    }

    render() {
        return (
            <div className="background body">
                <PlayerContextProvider>
                    <PopupContextProvider>
                        <RoundContextProvider>
                            <FinalContextProvider>
                                <PlayerInfo />
                                <PopUp gameBegin={this.state.passGameBegin} boardGameRestart={this.state.passGameRestart}/>
                                <FinalArea />
                                <ThreeScene setParentGameBegin={this.setPassGameBegin} setParentGameRestart={this.setPassGameRestart}/>
                            </FinalContextProvider>
                        </RoundContextProvider>
                    </PopupContextProvider>
                </PlayerContextProvider>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));