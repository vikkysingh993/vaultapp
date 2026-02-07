import React from "react";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="row align-items-start">
          <div className="col-md-6 pr-md-5">
            <div className="navbar-brand mb-3">
              <img src="/img/logo.png" alt="Launchpad" className="logo" />
            </div>
            <p>
              Discover the future of crypto projects with our cutting-edge Occy
              Token Launchpad. Get access to exclusive token sales and be a part
              of the revolution.
            </p>
          </div>

          <div className="col-md-5 ps-md-5 left_border">
            <div className="nav_link mt-3">
              <h4>Follow Us On</h4>
              <div className="vertical-social">
                <ul>
                  <li>
                    <a target="_blank" href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="bi bi-telegram"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="bi bi-medium"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-sm-2 text-sm-end">
                <a href="#">Terms of Services</a>
              </div>
              <div className="col-md-6 order-sm-1">
                © 2025 Occy Token. All Rights Reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
