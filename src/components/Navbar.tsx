import React from "react";
import { Link } from "react-router-dom";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Occy Token" className="logo" />
          <span>Occy Token</span>
        </Link>

        <div id="box1" className="box2"><span></span></div>

        <button
          className="navbar-toggler ml-auto collapsed"
          data-bs-toggle="collapse"
          data-bs-target="#toggler1"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="collapse navbar-collapse" id="toggler1">
          <ul className="navbar-nav ms-auto     align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/launchpad">Launchpad</Link></li>
            {/* <li className="nav-item"><Link className="nav-link" to="/staking-farming">Stake/Farm</Link></li> */}
            <li className="nav-item"><Link className="nav-link" to="/how-to-start">How to Start</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
            <li className="nav-item"> <Link to="/create-coin" className="btn btn_man ms-md-3">Create Coin</Link></li>
           
          </ul>
        </div>

        <div className="connect_btn d-flex align-items-center ms-md-4">
          
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
