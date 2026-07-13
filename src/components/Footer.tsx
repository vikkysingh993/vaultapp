import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">

        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <img src="/img/logo.png" alt="OCC Launchpad" />
            <p>
              Discover the future of crypto projects with our cutting-edge OCC Launchpad.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h5>Quick Links</h5>
            <Link to="/about">About Us</Link>
            <Link to="/how-to-start">How to Start</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>

          {/* Community */}
          <div className="footer-social">
            <h5>Community</h5>
            <div className="social-icons">
              <a href="https://twitter.com/OpenClearCap" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://t.me/occvault" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <i className="bi bi-telegram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                <i className="bi bi-medium"></i>
              </a>
            </div>
          </div>

          {/* Download OCC Vault */}
          <div className="footer-vault">
            <h5>Download OCC Vault</h5>
            <div className="vault-store-btns">
              <a
                href="https://occvault.com"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
                id="footer-appstore-btn"
              >
                <i className="bi bi-apple"></i>
                <span>
                  <small>Download on the</small>
                  App Store
                </span>
              </a>
              <a
                href="https://occvault.com"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
                id="footer-googleplay-btn"
              >
                <i className="bi bi-google-play"></i>
                <span>
                  <small>Get it on</small>
                  Google Play
                </span>
              </a>
            </div>
            <a
              href="https://occvault.com"
              target="_blank"
              rel="noopener noreferrer"
              className="vault-link"
              id="footer-occvault-link"
            >
              occvault.com →
            </a>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2025 OCC Launchpad. All Rights Reserved</span>
          <div>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy-policy">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
