import '../css/normalize.css';
import '../css/common.css';
import '../css/nav_bar.css';
import '../css/about.css';
import React from 'react';
import { Link } from "react-router-dom";

const NavbarAboutPage = () => {
    return (
        <nav className="nav nav-about-page">
            <ul className="nav-ul nav-about-container" id="menu">
                <div className="about-btn"><li className="nav-li"><Link to="/tutorials"><span>Guide</span></Link></li></div>
                <div className="about-btn"><li className="nav-li"><Link to="/"><span>Home</span></Link></li></div>
            </ul>
        </nav>
    );
}

export default NavbarAboutPage;