import '../css/normalize.css';
import '../css/common.css';
import '../css/game_entry.css';
import React from "react";
import ThreeScene from "../three_scene";
import PlayerInfo from './player';
import PopUp from './pop_up';
import FinalArea from './final_area';
import PlayerContextProvider from '../contexts/playerContext';
import PopupContextProvider from '../contexts/popupContext';
import RoundContextProvider from '../contexts/roundContext';
import FinalContextProvider from '../contexts/finalContext';


class GameEntry extends React.Component {
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
export default GameEntry;