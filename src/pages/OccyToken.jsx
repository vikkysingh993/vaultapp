import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { popupSuccess, popupError, popupWarning } from "../utils/popup";
import { useAuth } from "../context/AuthContext";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { swapTokenFrontend } from "../utils/swapHelper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DummyChart from "../components/DummyChart";
import { parseLiquidity } from "../utils/parseLiquidity";
import { decryptAddress } from "../utils/crypto";
import api from "../config/axios";
import { parseBlockchainError } from "../utils/parseBlockchainError";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "";

export default function OccyToken() {
  const [amount, setAmount]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [token, setToken]         = useState(null);
  const [activeTab, setActiveTab] = useState("buy");

  const { user }                           = useAuth();
  const { walletProvider }                 = useAppKitProvider();
  const { address, isConnected }           = useAppKitAccount();
  const { tokenAddress: encryptedAddress } = useParams();

  const liquidity = parseLiquidity(token?.liquidityResponse);

  // ── Load token ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadToken = async () => {
      try {
        if (encryptedAddress !== undefined) {
          const decrypted = decryptAddress(encryptedAddress);
          if (!decrypted) return;
          const res = await api.get(`/token-flow/tokens/by-address/${decrypted}`);
          if (res.data.success) {
            setToken(res.data.data);
            sessionStorage.setItem("latestToken", JSON.stringify(res.data.data));
          }
          return;
        }
        const raw = sessionStorage.getItem("latestToken");
        if (raw) setToken(JSON.parse(raw));
      } catch (err) {
        console.error(err);
      }
    };
    loadToken();
  }, [encryptedAddress]);

  useEffect(() => {
    if (walletProvider && isConnected && address) {
      const raw = sessionStorage.getItem("latestToken");
      if (raw && !token) setToken(JSON.parse(raw));
    }
  }, [walletProvider, isConnected, address]);

  // ── USDT/OCC addresses by chain ─────────────────────────────────────────
  const USDT_BY_CHAIN = {
    1:    import.meta.env.VITE_USDT_TOKEN_ADDRESS_ETH,
    137:  import.meta.env.VITE_USDT_TOKEN_ADDRESS_POL,
    8453: import.meta.env.VITE_USDT_TOKEN_ADDRESS_BASE,
    146:  import.meta.env.VITE_OCC_TOKEN_ADDRESS,
  };
  const USDT = user?.chainId ? USDT_BY_CHAIN[user?.chainId] : null;
  const OCCY = token?.tokenAddress;

  // ── Swap ─────────────────────────────────────────────────────────────────
  const handleSwap = async (type) => {
    try {
      if (!window.ethereum || !address) {
        popupWarning("Wallet Required", "Connect MetaMask first");
        return;
      }
      if (!amount || Number(amount) <= 0) {
        popupWarning("Invalid Amount", "Enter a valid amount");
        return;
      }
      setLoading(true);
      const isBuy = type === "buy";
      const txHash = await swapTokenFrontend({
        userAddress: address,
        tokenIn:  isBuy ? USDT : OCCY,
        tokenOut: isBuy ? OCCY : USDT,
        amountIn: amount,
      });
      const rawUser  = sessionStorage.getItem("authUser");
      const authUser = rawUser ? JSON.parse(rawUser) : {};
      await api.post(
        "/swaps",
        {
          walletAddress: address,
          swapType: type.toUpperCase(),
          tokenIn:  isBuy ? USDT : OCCY,
          tokenOut: isBuy ? OCCY : USDT,
          amountIn: amount,
          txHash,
          chainId: authUser?.chainId,
          userId:  authUser?.id || null,
        },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, "Content-Type": "application/json" } }
      );
      popupSuccess("Swap Successful 🎉");
      setAmount("");
    } catch (err) {
      const { title, message } = parseBlockchainError(err);
      popupError(title || "Swap Failed", message);
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const logoSrc = token?.logo ? `${IMG_BASE}${token.logo}` : "/img/about.png";

  const socialLinks = [
    { key: "website",  icon: "bi-globe2",    label: "Website"  },
    { key: "twitter",  icon: "bi-twitter-x", label: "Twitter"  },
    { key: "telegram", icon: "bi-telegram",  label: "Telegram" },
    { key: "discord",  icon: "bi-discord",   label: "Discord"  },
  ].filter(s => token?.[s.key]);

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <section className="in_page">
        <div className="Background_RectL__oAOXA" />
        <div className="Background_ElipL__xhjwR" />

        <div className="container">
          <div className="row g-4">

            {/* ── Chart (left) ── */}
            <div className="col-lg-7">
              <div className="w_box p-0 overflow-hidden">
                <DummyChart />
              </div>
            </div>

            {/* ── Buy / Sell (right) ── */}
            <div className="col-lg-5">

              {token && (
                <div className="w_box mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={logoSrc}
                      alt={token.name}
                      className="coin_box_left img-fluid"
                      onError={e => { e.target.src = "/img/about.png"; }}
                    />
                    <div>
                      <h5 className="mb-0">{token.name} ({token.symbol})</h5>
                      <small className="text-muted">{token.chain}</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="w_box overflow-hidden">
                <ul className="nav buy_sell_tab mb-4">
                  <li className={`nav-item w-50 buy_btn ${activeTab === "buy" ? "active" : ""}`}>
                    <button className="nav-link buy_btn" disabled={loading} onClick={() => setActiveTab("buy")}>
                      Buy
                    </button>
                  </li>
                  <li className={`nav-item w-50 sell_btn ${activeTab === "sell" ? "active" : ""}`}>
                    <button className="nav-link sell_btn" disabled={loading} onClick={() => setActiveTab("sell")}>
                      Sell
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  <label className="mb-1">Enter Amount</label>
                  <div className="form-group mb-3 position-relative">
                    <input
                      className="form-control"
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <span className="d-flex input_coin gap-2">
                      <span>{token?.name || "Token"}</span>
                      <img
                        src={logoSrc}
                        alt={token?.name || "token"}
                        className="img-fluid"
                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                        onError={e => { e.target.src = "/img/about.png"; }}
                      />
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn_man w-100"
                  disabled={loading}
                  onClick={() => handleSwap(activeTab)}
                >
                  {loading ? "Processing..." : activeTab === "buy" ? "Buy Now" : "Sell Now"}
                </button>
              </div>
            </div>

            {/* ── Full-width token info card ── */}
            {token && (
              <div className="col-12">
                <div className="w_box token-info-card">

                  {/* Header */}
                  <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                    <img
                      src={logoSrc}
                      alt={token.name}
                      className="token-info-logo"
                      onError={e => { e.target.src = "/img/about.png"; }}
                    />
                    <div>
                      <h4 className="mb-0">
                        {token.name}
                        <span className="token-symbol ms-2">({token.symbol})</span>
                      </h4>
                      {token.chain && <span className="token-chain-badge">{token.chain}</span>}
                    </div>

                    {socialLinks.length > 0 && (
                      <div className="d-flex gap-2 ms-auto flex-wrap">
                        {socialLinks.map(s => (
                          <a
                            key={s.key}
                            href={token[s.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="token-social-icon"
                            title={s.label}
                          >
                            <i className={`bi ${s.icon}`} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tagline + Description */}
                  <div className="row g-3 mb-3">
                    {token.tagline && (
                      <div className={token.description ? "col-md-4" : "col-12"}>
                        <p className="token-tagline mb-0">"{token.tagline}"</p>
                      </div>
                    )}
                    {token.description && (
                      <div className={token.tagline ? "col-md-8" : "col-12"}>
                        <div className="token-description mb-0">
                          <h6 className="token-section-label">About</h6>
                          <p>{token.description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="token-stats-row">
                    <div className="token-stat">
                      <span className="token-stat-label">Category</span>
                      <span className="token-stat-value">{token.projectCategory || "—"}</span>
                    </div>
                    <div className="token-stat">
                      <span className="token-stat-label">Total Supply</span>
                      <span className="token-stat-value">
                        {token.supply ? Number(token.supply).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="token-stat">
                      <span className="token-stat-label">LP Locked</span>
                      <span className="token-stat-value">
                        {liquidity?.lpLockedRaw
                          ? Number(ethers.formatUnits(liquidity.lpLockedRaw.toString(), 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })
                          : token.lpLocked ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="token-stat">
                      <span className="token-stat-label">Status</span>
                      <span className={`token-stat-value token-status token-status--${(token.status || "").toLowerCase()}`}>
                        {token.status || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Contract */}
                  <div className="token-address-row">
                    <span className="token-stat-label">Contract</span>
                    <code className="token-address">{token.tokenAddress}</code>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
