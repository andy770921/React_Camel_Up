import '../css/normalize.css';
import '../css/common.css';
import '../css/nav_bar.css';
import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
        <nav className="nav">
            <ul className="nav-ul grid-container" id="menu">
                <div className="entry-btn-pos1"><li className="nav-li"><span><Link to= "/game">Play</Link></span></li></div>
                <div className="entry-btn-pos2"><li className="nav-li"><span><Link to= "/tutorials">Guide</Link></span></li></div>
                <div className="entry-btn-pos3"><li className="nav-li"><span><Link to= "/about">About</Link></span></li></div>
            </ul>
        </nav>
  );
}
 
export default Navbar;