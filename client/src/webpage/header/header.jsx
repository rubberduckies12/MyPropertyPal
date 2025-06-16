import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

export default function WebpageHeader() {
  const navigate = useNavigate();

  return (
    <header className="webpage-header">
      <div className="webpage-header-inner">
        <img
          src="/logo.png"
          alt="Logo"
          className="webpage-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <nav className="webpage-nav">
          <button
            className="webpage-nav-link"
            onClick={() => navigate("/")}
            type="button"
          >
            Home
          </button>
          <button
            className="webpage-nav-link"
            onClick={() => navigate("/features")}
            type="button"
          >
            Features
          </button>
          <button
            className="webpage-nav-link"
            onClick={() => navigate("/about")}
            type="button"
          >
            About Us
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