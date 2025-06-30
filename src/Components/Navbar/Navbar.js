import React, { useState } from "react";
import "./Navbar.css";
import Cookies from "universal-cookie";
import { Link } from "react-router";
import logo from "./assets/be10x-icon.png"; // Adjust the path as necessary

const Navbar = () => {
  const cookies = new Cookies();

  const userId = cookies.get("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [token, setToken] = useState(cookies.get("token"));

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  function logout() {
    cookies.remove("token", { path: "/" });
    setToken(null);
    window.location.href = "/"; // Redirect to home page
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo" />
        <span className="app-name">Mutuality</span>
      </div>

      <div className="nav-center">
        <a href="/">Home</a>
        <a href="/saved">Saved</a>
      </div>

      <div className="nav-right">
        {userId ? (
          <div className="avatar" onClick={toggleDropdown}>
            <img src="https://i.pravatar.cc/30" alt="avatar" />
          </div>
        ) : (
          <a href="/login">
            <button className="login-link">Login</button>
          </a>
        )}

        {dropdownOpen && (
          <div className="dropdown">
            <div className="mobile-links">
              <a href="/">Home</a>
              <a href="/saved">Saved</a>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
