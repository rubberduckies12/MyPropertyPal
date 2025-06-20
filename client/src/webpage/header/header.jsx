import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

export default function WebpageHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
    }
    if (resourcesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [resourcesOpen]);

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
          <div
            className={`webpage-nav-dropdown${resourcesOpen ? " open" : ""}`}
            ref={resourcesRef}
          >
            <button
              className={`webpage-nav-link${
                location.pathname.startsWith("/blog") ? " active" : ""
              }`}
              type="button"
              onClick={() => setResourcesOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
            >
              Resources{" "}
              <span
                className={`dropdown-arrow${resourcesOpen ? " open" : ""}`}
                style={{
                  fontSize: "0.8em",
                  display: "inline-block",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </button>
            {resourcesOpen && (
              <div className="webpage-nav-dropdown-menu">
                <button
                  className={`webpage-nav-link${
                    location.pathname.startsWith("/blog") ? " active" : ""
                  }`}
                  onClick={() => {
                    setResourcesOpen(false);
                    navigate("/blog");
                  }}
                  type="button"
                >
                  Blog
                </button>
                {/* Training Courses option TBA here */}
              </div>
            )}
          </div>
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