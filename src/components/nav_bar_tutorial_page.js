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
                <div className="tutorial-btn"><li className="nav-li"><Link to="/game"><span>Play</span></Link></li></div>
                <div className="tutorial-btn"><li className="nav-li"><Link to="/"><span>Home</span></Link></li></div>
            </ul>
        </nav>
    );
}

export default NavbarTutorialPage;