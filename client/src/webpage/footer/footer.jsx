import React from 'react';
import './footer.css';
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaEnvelope } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="awesome-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/publicassets/LogoBB.png"
            alt="MyPropertyPal Logo"
            className="footer-logo-img"
            style={{ height: "130px", width: "auto", marginBottom: "8px" }}
          />
          <div className="footer-social">
            <a href="https://x.com/propertypal_app" aria-label="X" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61577330848552" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
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
            <a
              href="/tos"
              onClick={e => {
                e.preventDefault();
                navigate('/tos');
              }}
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              onClick={e => {
                e.preventDefault();
                navigate('/privacy');
              }}
            >
              Privacy
            </a>
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