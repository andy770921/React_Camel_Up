import '../css/normalize.css';
import '../css/common.css';
import '../css/nav_bar.css';
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { HomeContext } from '../contexts/homeContext';

const Navbar = () => {
    const { resetCarousel } = useContext(HomeContext);
    return (
        <nav className="nav">
            <ul className="nav-ul grid-container" id="menu">
                <div className="entry-btn-pos1"><Link to="/game"><li className="nav-li" onClick={resetCarousel}><span>Play</span></li></Link></div>
                <div className="entry-btn-pos2"><Link to="/tutorials"><li className="nav-li" onClick={resetCarousel}><span>Guide</span></li></Link></div>
                <div className="entry-btn-pos3"><Link to="/about" onClick={e => e.preventDefault()}><li className="nav-li"><span>About</span></li></Link></div>
            </ul>
        </nav>
    );
}

export default Navbar;