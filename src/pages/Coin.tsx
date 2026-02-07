import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Coin() {
  return (
    <>
      <Navbar />

      <section className="in_page">
        <div className="Background_RectL__oAOXA"></div>
        <div className="Background_ElipL__xhjwR"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="w_box mb-4 overflow-hidden">
                <img src="/img/chart.jpg" alt="chart" className="img-fluid" />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="w_box mb-4">
                <div className="d-flex align-items-center">
                  <div className="text-center coin_box_left">
                    <img className="img-fluid" src="/img/about.png" alt="about" />
                  </div>
                  <div>
                    <h5>Occy Token (OCCY)</h5>
                    <h6>PlaiPin</h6>
                    <div><span>kingchilll</span> <span>10h ago</span></div>
                  </div>
                  <button className="btn btn_man ms-auto">Share</button>
                </div>
              </div>

              <div className="w_box mb-4 overflow-hidden">
                <ul className="nav buy_sell_tab mb-4">
                  <li className="nav-item"><a className="nav-link buy active" data-bs-toggle="tab" href="#buytab">Buy</a></li>
                  <li className="nav-item"><a className="nav-link sell" data-bs-toggle="tab" href="#selltab">Sell</a></li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane active" id="buytab">
                    <label>Enter Amount</label>
                    <div className="form-group mb-3 position-relative">
                      <input className="form-control" placeholder="Enter amount" />
                      <span className="d-flex input_coin gap-2">
                        <span>OCCY</span><img src="/img/about.png" alt="coin" className="img-fluid" />
                      </span>
                    </div>
                    <button className="btn buy_btn w100">Buy</button>
                  </div>

                  <div className="tab-pane fade" id="selltab">
                    <label>Enter Amount</label>
                    <div className="form-group mb-3 position-relative">
                      <input className="form-control" placeholder="Enter amount" />
                      <span className="d-flex input_coin gap-2">
                        <span>OCCY</span><img src="/img/about.png" alt="coin" className="img-fluid" />
                      </span>
                    </div>
                    <button className="btn sell_btn w100">Sell</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
