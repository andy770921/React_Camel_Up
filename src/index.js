import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/nav_bar';
import Home from './components/home';
import GameEntry from './components/game_entry';
import Tutorials from './components/tutorials';


function App() {
    return (
        <BrowserRouter>
            <React.Fragment>
                <Navbar />
                <Route exact path="/" component={Home}/>
                <Route path="/tutorials" component={Tutorials} />
                <Route path="/game" component={GameEntry} /> 
                {/* <GameEntry /> */}
            </React.Fragment>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.querySelector("#root"));