import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

export default function WebpageHeader() {
  const navigate = useNavigate();

  return (
    <header className="webpage-header">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <img
          src="/logo.png"
          alt="Logo"
          className="webpage-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <nav className="webpage-nav" style={{ display: "flex", gap: 24 }}>
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
      </div>
      <button
        className="webpage-login-btn"
        onClick={() => navigate("/login")}
        type="button"
      >
        Log In
      </button>
    </header>
  );
}