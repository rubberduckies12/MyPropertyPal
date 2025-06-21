import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

export default function WebpageHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);
  const [hideHeader, setHideHeader] = useState(false);

  // Hide header on scroll past hero
  useEffect(() => {
    function onScroll() {
      // Adjust selector if your hero section uses a different id/class
      const hero = document.getElementById("hero-section");
      const heroHeight = hero ? hero.offsetHeight : 400; // fallback height
      setHideHeader(window.scrollY > heroHeight - 60);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
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
    <header className={`webpage-header-outer${hideHeader ? " header-hidden" : ""}`}>
      <div className="webpage-header-rounded">
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
                <div className="webpage-nav-dropdown-menu" role="menu">
                  <button
                    className={`webpage-nav-link${
                      location.pathname.startsWith("/blog") ? " active" : ""
                    }`}
                    onClick={() => {
                      setResourcesOpen(false);
                      navigate("/blog");
                    }}
                    type="button"
                    role="menuitem"
                  >
                    Blog
                  </button>
                  <button
                    className={`webpage-nav-link${
                      location.pathname.startsWith("/privacy") ? " active" : ""
                    }`}
                    onClick={() => {
                      setResourcesOpen(false);
                      navigate("/privacy");
                    }}
                    type="button"
                    role="menuitem"
                  >
                    Privacy Policy
                  </button>
                  <button
                    className={`webpage-nav-link${
                      location.pathname.startsWith("/tos") ? " active" : ""
                    }`}
                    onClick={() => {
                      setResourcesOpen(false);
                      navigate("/tos");
                    }}
                    type="button"
                    role="menuitem"
                  >
                    Terms of Service
                  </button>
                </div>
              )}
            </div>
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
      </div>
    </header>
  );
}