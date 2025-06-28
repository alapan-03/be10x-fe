// src/Hero.jsx
import React from "react";
import "./Hero.css";
// import { Link } from "react-router";
let Cookies = require("js-cookie");

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
          Build What People Actually Want, In Days
        </h1>
        <p className="hero-subtitle animate-fade-up delay-2">
          Discover real user problems and validate startup ideas directly from
          Reddit. Analyze sentiments, get expert insights, and launch products
          that matter.
        </p>
        <div className="hero-buttons animate-fade-up delay-3">
          {/* <Link to={userId ? "/category" : "/login"} className="btn primary"> */}
          💡 Get Started
          {/* </Link> */}
          
        </div>
      </div>
    </section>
  );
}
