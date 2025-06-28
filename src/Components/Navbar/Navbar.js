import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="/logo192.png" alt="logo" className="logo" />
        <span className="app-name">MyApp</span>
      </div>

      <div className="nav-center">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </div>

      <div className="nav-right">
        <div className="avatar" onClick={toggleDropdown}>
          <img src="https://i.pravatar.cc/30" alt="avatar" />
        </div>
        {dropdownOpen && (
          <div className="dropdown">
            <div className="mobile-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <button className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
