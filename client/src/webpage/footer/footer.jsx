import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="awesome-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/publicassets/LogoBB.png"
            alt="MyPropertyPal Logo"
            className="footer-logo-img"
            style={{ height: "230px", width: "auto", marginBottom: "8px" }}
          />
        </div>
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/about">About Us</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="/blog">Blog</a>
            <a href="/help">Help Center</a>
            <a href="/contact">Contact</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
        <div className="footer-social">
          <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noopener noreferrer">x</a>
          <a href="https://facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
          <a href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">li</a>
          <a href="mailto:support@landlordpro.com" aria-label="Email">E-mail</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MyPropertyPal. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;