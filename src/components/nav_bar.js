import '../css/normalize.css';
import '../css/common.css';
import '../css/nav_bar.css';
import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
        <nav>
            <ul className="nav-ul" id="menu">
                <li className="nav-li"><span><Link to= "/">Home</Link></span></li>
                <li className="nav-li"><span><Link to= "/tutorials">Guide</Link></span></li>
                <li className="nav-li"><span><Link to= "/game">Play</Link></span></li>
            </ul>
        </nav>
  );
}
 
export default Navbar;