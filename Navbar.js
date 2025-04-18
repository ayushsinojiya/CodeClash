import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Coding Standoff</h1>
      </div>
      <div className="navbar-right">
        <a href="http://127.0.0.1:5500/index.html" target="_blank" rel="noopener noreferrer">Home</a>
        <Link to="/subject">Training</Link> 
        <Link to="/help">Help</Link> 
      </div>
    </nav>
  );
}

export default Navbar;
