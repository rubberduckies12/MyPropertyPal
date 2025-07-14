import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "../../styles/header/header.css";

export default function WebpageHeader() {
  const router = useRouter();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);
  const [hideHeader, setHideHeader] = useState(false);

  // Hide header on scroll past hero
  useEffect(() => {
    function onScroll() {
      const hero = document.getElementById("hero-section");
      const heroHeight = hero ? hero.offsetHeight : 400;
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

  // Helper for active link
  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path);

  return (
    <header className={`webpage-header-outer${hideHeader ? " header-hidden" : ""}`}>
      <div className="webpage-header-rounded">
        <div className="webpage-header-inner">
          <img
            src="/publicassets/LogoWB.png"
            alt="MyPropertyPal Logo"
            className="webpage-logo"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
          <nav className="webpage-nav">
            <Link href="/" passHref legacyBehavior>
              <a className={`webpage-nav-link${isActive("/") ? " active" : ""}`}>Home</a>
            </Link>
            <Link href="/features/features" passHref legacyBehavior>
              <a className={`webpage-nav-link${isActive("/features") ? " active" : ""}`}>Features</a>
            </Link>
            <Link href="/about/about" passHref legacyBehavior>
              <a className={`webpage-nav-link${isActive("/about") ? " active" : ""}`}>About Us</a>
            </Link>
            <Link href="/mtd/mtd" passHref legacyBehavior>
              <a className={`webpage-nav-link${isActive("/mtd") ? " active" : ""}`}>MTD</a>
            </Link>
            <div
              className={`webpage-nav-dropdown${resourcesOpen ? " open" : ""}`}
              ref={resourcesRef}
            >
              <button
                className={`webpage-nav-link${isActive("/blog") ? " active" : ""}`}
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
                  <Link href="/blog/blog" passHref legacyBehavior>
                    <a
                      className={`webpage-nav-link${isActive("/blog") ? " active" : ""}`}
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Blog
                    </a>
                  </Link>
                  <Link href="/privacy/privacy" passHref legacyBehavior>
                    <a
                      className={`webpage-nav-link${isActive("/privacy") ? " active" : ""}`}
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Privacy Policy
                    </a>
                  </Link>
                  <Link href="/tos/tos" passHref legacyBehavior>
                    <a
                      className={`webpage-nav-link${isActive("/tos") ? " active" : ""}`}
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Terms of Service
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </nav>
          {/* <button
            className="webpage-login-btn-modern"
            onClick={() => window.location.href = "http://localhost:3001/"}
            type="button"
            aria-label="Log in to your account"
          >
            <span className="login-text">Log In</span>
          </button> */}
        </div>
      </div>
    </header>
  );
}