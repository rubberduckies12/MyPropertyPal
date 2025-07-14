import React from "react";
import "../../styles/footer/footer.css";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <footer className="awesome-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/publicassets/LogoBB.png"
            alt=""
            className="footer-logo-img"
            style={{ height: "130px", width: "auto", marginBottom: "8px" }}
          />
          <div className="footer-social">
            <a
              href="https://twitter.com/propertypal_app"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61577330848552"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://linkedin.com/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h3>Product</h3>
            <Link href="/features/features">Features</Link>
            <Link href="/about/about">About Us</Link>
          </div>
          <div>
            <h3>Resources</h3>
            <Link href="/blog/blog">Blog</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/tos/tos">Terms of Service</Link>
            <Link href="/privacy/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MyPropertyPal. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;