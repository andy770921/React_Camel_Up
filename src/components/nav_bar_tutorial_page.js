import '../css/normalize.css';
import '../css/common.css';
import '../css/nav_bar.css';
import '../css/tutorials.css';
import React from 'react';
import { Link } from "react-router-dom";

const NavbarTutorialPage = () => {
    return (
        <nav className="nav nav-tutorial-page">
            <ul className="nav-ul nav-flex-container" id="menu">
                <div className="tutorial-btn"><Link to="/game"><li className="nav-li"><span>Play</span></li></Link></div>
                <div className="tutorial-btn"><Link to="/"><li className="nav-li"><span>Home</span></li></Link></div>
            </ul>
        </nav>
    );
}

export default NavbarTutorialPage;