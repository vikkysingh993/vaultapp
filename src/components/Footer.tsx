import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
<footer className="footer" id="contact">
  <div className="container">

    <div className="footer-top">

      <div className="footer-brand">
        <img src="/img/logo.png" alt="Launchpad" />
        <p>
          Discover the future of crypto projects with our cutting-edge
          Occy Token Launchpad.
        </p>
      </div>


      <div className="footer-links">
        <h5>Quick Links</h5>
        <Link to="/about">About Us</Link>
        <Link to="/how-to-start">How to Start</Link>
        <Link to="/faq">Faq</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>

      <div className="footer-social">
        <h5>Community</h5>

        <div className="social-icons">
          <a href="https://twitter.com/OpenClearCap" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="https://t.me/occvault" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-telegram"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-youtube"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-medium"></i>
          </a>
        </div>
      </div>

    </div>

    <div className="footer-bottom">
      <span>© 2025 Occy Token. All Rights Reserved</span>

      <div>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy-policy">Privacy</Link>
      </div>
    </div>

  </div>
</footer>
  );
}
