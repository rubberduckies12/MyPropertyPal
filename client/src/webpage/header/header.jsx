import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

export default function WebpageHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="webpage-header">
      <div className="webpage-header-inner">
        <img
          src="/publicassets/LogoWB.png"
          alt="MyPropertyPal Logo"
          className="webpage-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <nav className="webpage-nav">
          <button
            className={`webpage-nav-link${
              location.pathname === "/" ? " active" : ""
            }`}
            onClick={() => navigate("/")}
            type="button"
          >
            Home
          </button>
          <button
            className={`webpage-nav-link${
              location.pathname.startsWith("/features") ? " active" : ""
            }`}
            onClick={() => navigate("/features")}
            type="button"
          >
            Features
          </button>
          <button
            className={`webpage-nav-link${
              location.pathname.startsWith("/about") ? " active" : ""
            }`}
            onClick={() => navigate("/about")}
            type="button"
          >
            About Us
          </button>
          <button
            className={`webpage-nav-link${
              location.pathname.startsWith("/mtd") ? " active" : ""
            }`}
            onClick={() => navigate("/mtd")}
            type="button"
          >
            MTD
          </button>
        </nav>
        <button
          className="webpage-login-btn-modern"
          onClick={() => navigate("/login")}
          type="button"
          aria-label="Log in to your account"
        >
          <span className="login-text">Log In</span>
        </button>
      </div>
    </header>
  );
}