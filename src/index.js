import './css/normalize.css';
import './css/common.css';
import './css/index.css';
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from 'react-router-dom';
import Home from './components/home';
import GameEntry from './components/game_entry';
import Tutorials from './components/tutorials';
import About from './components/about';
import HomeContextProvider from './contexts/homeContext';

function App() {
    return (
        <HashRouter>
            <>
                <HomeContextProvider>
                    <Route exact path="/" component={Home}/>
                    <Route path="/tutorials" component={Tutorials} />
                    <Route path="/game" component={GameEntry} /> 
                    <Route path="/about" component={About} />
                </HomeContextProvider> 
            </>
        </HashRouter>
    );
}

ReactDOM.render(<App />, document.querySelector("#root"));