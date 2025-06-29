// src/Hero.jsx
import React from "react";
import "./Hero.css";
// import { Link } from "react-router";
import Cookies from "js-cookie"; // Use js-cookie for cookie management

export default function Hero() {
  const userId = Cookies.get("userId");
  return (
    <section className="hero">
      
      <div className="floating-icons">
        <span className="icon idea">🚀</span>
        <span className="icon brain">🧠</span>
        <span className="icon gear">🛠️</span>
        <span className="icon chart">📈</span>
        <span className="icon rocket">💡</span>

      </div>

      <div className="hero-content">
        <h1 className="hero-title animate-fade-up delay-1">
          Know Your Mutual Funds Better, Easily!
        </h1>
        <p className="hero-subtitle animate-fade-up delay-2">
          Explore, know, and track your mutual funds with ease. 
          <br />
          Get insights and make informed decisions.
        </p>
        <a href="#card-container"><div className="hero-buttons animate-fade-up delay-3">
          {/* <Link to={userId ? "/category" : "/login"} className="btn primary"> */}
          💡 Get Started
          {/* </Link> */}
          
        </div>
        </a>
      </div>
    </section>
  );
}
