import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encryptAddress } from "../utils/crypto";
import $ from "jquery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { timeAgo } from "../utils/timeAgo";
import api from "../config/axios";
const Launchpad = () => {

const [tokens, setTokens] = useState([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState("all");
const navigate = useNavigate();
useEffect(() => {
  fetchTokens();
}, []);

const handleTokenClick = (token) => {
  const encrypted = encryptAddress(token.tokenAddress);

  // session backup
  sessionStorage.setItem("latestToken", JSON.stringify(token));

  navigate(`/occy-token/${encrypted}`);
};

const fetchTokens = async (type = "all") => {
  try {
    setLoading(true);

    const res = await api.get(`/launchpad/tokens?type=${type}`);

    if (res.data.success) {
      setTokens(res.data.data);
    }
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false); // 🔥 THIS WAS MISSING
  }
};

useEffect(() => {
  fetchTokens(activeTab);
}, [activeTab]);

useEffect(() => {
  if (!tokens.length) return;

  const $slider = $(".slider-nav");

  if ($slider.hasClass("slick-initialized")) {
    $slider.slick("unslick");
  }

  $slider.slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  });

  return () => {
    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }
  };
}, [tokens]);

  return (
    <>
      <Navbar />
      <section className="launch in_page bg_color" id="about-us3">
        <div className="Background_ElipL__xhjwR"></div>

        <div className="container">
          <div className="row mb-3">
            <div className="col-md-5 m-auto">
              <form className="d-flex w100 items-center gap-2">
                <div className="position-relative w100">
                  <i className="bi bi-search search_icon"></i>
                  <input
                    className="input_search"
                    placeholder="Search..."
                    type="text"
                    name="search-token"
                  />
                </div>
                <button className="btn btn_man min-w105" type="submit">
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          <h3 className="mb-3">Now Trending</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="slider-nav">
              {tokens.map((token) => (
                <div key={token.id}>
                  <div
                    className="coin_box"
                    onClick={() => handleTokenClick(token)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex mb-2">
                      <div className="text-center coin_box_left">
                        <img
                          src={
                            token.logo
                              ? import.meta.env.VITE_API_IMG_URL + token.logo
                              : "/img/about.png"
                          }
                          className="img-fluid"
                          alt={token.name}
                        />
                      </div>

                      <div>
                        <h3>
                          {token.name} ({token.symbol})
                        </h3>

                        <div className="color1">
                          Market Cap: ${token.marketCap || "0"}
                        </div>

                        <div className="small text-muted">
                          {timeAgo(token.createdAt)}
                        </div>

                      </div>
                    </div>
                    <p className="mb-0 small" style={{ height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {token.description || 'No description available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}


          <div className="token_tab mt-4 mb-4">
            {[
              { key: "all", label: "All" },
              { key: "new", label: "New coins" },
              { key: "old", label: "Oldest coins" },
              { key: "trade", label: "Last trade" },
            ].map((t) => (
              <button
                key={t.key}
                className={activeTab === t.key ? "active" : ""}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>


          <div className="row">
            {tokens.map((token) => (
              <div className="col-md-4 mb-4" key={token.id}>
                <div className="coin_box coin_box_big">
                  <div className="d-flex mb-2">
                    <div className="coin_box_left">
                      <img
                        src={
                          token.logo
                            ? import.meta.env.VITE_API_IMG_URL + token.logo
                            : "/img/about.png"
                        }
                        alt={token.name}
                        className="img-fluid"
                      />
                    </div>

                    <div className="ps-1">
                      <h3>{token.name} ({token.symbol})</h3>

                      <div className="op_05">
                        {new Date(token.createdAt).toLocaleDateString()}
                      </div>

                      <div className="op_05">
                        {token.liquidityResponse
                          ? "Liquidity Added"
                          : "No Liquidity"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default Launchpad;
