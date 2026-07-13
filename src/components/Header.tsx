import React from "react";
import { Link } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <>
      {/* ===== Header / Hero Section ===== */}
      <header className="home text-center" id="home">
        <div className="Background_RectL__oAOXA" />
        <div className="Background_ElipL__xhjwR" />
        <div className="container">
          <h1 className="mb text-center">
            Fair Launches.{" "}
            <span className="type1">
              <span className="index-module_type__E-SaG">Real Ownership.</span>
            </span>
          </h1>

          <h4 className="mb-3 hero-sub">
            Launch your token or meme coin with zero pre-sales and full transparency.
            <br />
            Powered by the OCCY token.
          </h4>

          <p className="hero-body mb-5">
            Whether you're launching a meme coin, utility token, DeFi project, or community coin,
            the OCC Launchpad gives creators fair access and real upside. Hold 1,000+ OCCY for
            unlimited free launches, earn royalties on secondary trading, and benefit from
            built-in deflationary mechanics. Launch seamlessly on Sonic (primary), with support
            for Base, Polygon, and Ethereum.
          </p>

          <div className="login_btns">
            <Link to="/create-coin" className="btn btn_man me-3" id="hero-launch-btn">
              Launch a Coin
            </Link>
            <a
              href="https://occvault.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn_outline_man"
              id="hero-buy-occy-btn"
            >
              Buy OCCY
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
