import React from "react";
import { Link } from "react-router-dom";
import ConnectButton from "./ConnectButton";

export default function Header(): JSX.Element {
  return (
    <>
      {/* ===== Header Section ===== */}
      <header className="home text-center" id="home">
        <div className="Background_RectL__oAOXA" />
        <div className="Background_ElipL__xhjwR" />
        <div className="container">
          <h1 className="mb text-center">
            The Next Generation <br />
            <span className="type1">
              <span className="index-module_type__E-SaG">Occy Token</span>
            </span>
          </h1>

          <h4 className="mb-4">Building Tomorrow’s Innovation Today.</h4>

          <div className="login_btns">
            <Link to="/create-coin" className="btn btn_man me-3">
              Create Coin
            </Link>
            {/* <ConnectButton /> */}
          </div>
        </div>
      </header>
    </>
  );
}
