import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { popupSuccess, popupError, popupWarning } from "../utils/popup";
import { useAuth } from "../context/AuthContext";
import { useAppKitProvider,useAppKitAccount } from "@reown/appkit/react";
import { swapTokenFrontend } from "../utils/swapHelper";
import { getWalletAddress } from "../utils/getWalletAddress";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DummyChart from "../components/DummyChart";
import { parseLiquidity } from "../utils/parseLiquidity";
import { decryptAddress } from "../utils/crypto";
import api from "../config/axios";
import { parseBlockchainError } from "../utils/parseBlockchainError";


export default function OccyToken() {
  // ✅ HOOKS MUST BE INSIDE COMPONENT
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { walletProvider } = useAppKitProvider();
  const { address, isConnected } = useAppKitAccount();
  const [walletReady, setWalletReady] = useState(false);
  const [providerReady, setProviderReady] = useState(false);
  const [token, setToken] = useState(null);
  const liquidity = parseLiquidity(token?.liquidityResponse);
  const { tokenAddress: encryptedAddress } = useParams();
  const [activeTab, setActiveTab] = useState("buy");

useEffect(() => {
  const loadToken = async () => {
    try {
      // ✅ CASE-1: URL param present
      if (encryptedAddress !== undefined) {
        const decryptedAddress = decryptAddress(encryptedAddress);
        if (!decryptedAddress) return;

        const res = await api.get(
          `/token-flow/tokens/by-address/${decryptedAddress}`
        );

        if (res.data.success) {
          setToken(res.data.data);

          sessionStorage.setItem(
            "latestToken",
            JSON.stringify(res.data.data)
          );
        }
        return;
      }

      // ✅ CASE-2: ONLY when URL has NO param at all
      const raw = sessionStorage.getItem("latestToken");
      if (raw) {
        setToken(JSON.parse(raw));
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadToken();
}, []); // 🔥 dependency EMPTY



const USDT_BY_CHAIN = {
  // Ethereum
  1: import.meta.env.VITE_USDT_TOKEN_ADDRESS_ETH,

  // Polygon
  137: import.meta.env.VITE_USDT_TOKEN_ADDRESS_POL,

  // Base
  8453: import.meta.env.VITE_USDT_TOKEN_ADDRESS_BASE,

  //Sonic
  146: import.meta.env.VITE_OCC_TOKEN_ADDRESS,
};
  console.log("User's chain ID:", user?.chainId);
  console.log("USDT_BY_CHAIN:", USDT_BY_CHAIN[user?.chainId]);
  const USDT = user?.chainId ? USDT_BY_CHAIN[user?.chainId] : null;
  const OCCY = token?.tokenAddress;
  
  useEffect(() => {
    if (walletProvider && isConnected && address) {
      setProviderReady(true);
    }
    const raw = sessionStorage.getItem("latestToken");
    if (raw) {
      setToken(JSON.parse(raw));
    }
  }, [walletProvider, isConnected, address]);

const getInjectedProvider = () => {
  if (window.ethereum) return window.ethereum;
  return null;
};

const getConnectedWallet = () => {
  const raw = sessionStorage.getItem("authUser");
  if (!raw) return null;
  const user = JSON.parse(raw);
  return user?.walletAddress?.[0] || null;
};


  // =========================
  // 🔁 BUY / SELL SWAP
  // =========================

const handleSwap = async (type) => {
  try {
    if (!window.ethereum || !address) {
      popupWarning("Wallet Required", "Connect MetaMask first");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      popupWarning("Invalid Amount", "Enter valid amount");
      return;
    }

    setLoading(true);
    const isBuy = type === "buy";
    console.log("Swapping", {
      userAddress: address,
      tokenIn: isBuy ? OCCY : USDT,
      tokenOut: isBuy ? USDT : OCCY,
      amountIn: amount,
    });

    const txHash = await swapTokenFrontend({
      userAddress: address,
      tokenIn: isBuy ? OCCY : USDT,
      tokenOut: isBuy ? USDT : OCCY,
      amountIn: amount,
    });
     const raw = sessionStorage.getItem("authUser");
  if (!raw) return null;
  const user = JSON.parse(raw);
    // 🔥 SAVE TO DB
    const formData = new FormData();
      formData.append("walletAddress", address);
      formData.append("swapType", type.toUpperCase());
      formData.append("tokenIn", type === "buy" ? OCCY : USDT);
      formData.append("tokenOut", type === "sell" ? USDT : OCCY);
      formData.append("amountIn", amount);
      formData.append("txHash", txHash);
      formData.append("chainId", user?.chainId);
      formData.append("userId", user?.id || null);
    await api.post(
      "/swaps",
      {
        walletAddress: address,
        swapType: type.toUpperCase(),
        tokenIn: type === "buy" ? OCCY : USDT,
        tokenOut: type === "sell" ? USDT : OCCY,
        amountIn: amount,
        txHash: txHash,
        chainId: user?.chainId,
        userId: user?.id || null
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          "Content-Type": "application/json"
        }
      }
    );


    popupSuccess("Swap Successful 🎉");
    setAmount("");
  } catch (err) {
    console.error("SWAP ERROR:", err);

    const { title, message } = parseBlockchainError(err);
    popupError(title || "Swap Failed", message);
  }
 finally {
    setLoading(false);
  }
};

return (
    <>
      <Navbar />


      <section className="in_page">
        <div className="Background_RectL__oAOXA"></div>
        <div className="Background_ElipL__xhjwR"></div>

        <div className="container">
          <div className="row">
            {/* 🔥 LEFT GRAPH */}
            <div className="col-lg-7">
              <div className="w_box mb-4 p-0 overflow-hidden">
                <DummyChart />
              </div>
            </div>

            {/* 🔥 RIGHT BUY / SELL */}
            <div className="col-lg-5">
              {token && (
                
              <div className="w_box mb-4">
                <div className="d-flex align-items-center">
                  <div className="text-center coin_box_left">
                    <img src={
    (token?.logo && `${import.meta.env.VITE_API_IMG_URL}${token.logo}`)
    || "/img/about.png"
  } alt={token?.name || "token"} className="img-fluid" />
                  </div>

                  <div>
                  <h5>{token.name} ({token.symbol})</h5>
                    <h6></h6>
                    <div className="flex items-center small">
                      <span> {liquidity?.lpLockedRaw
  ? ethers.formatUnits(liquidity.lpLockedRaw.toString(), 18)
  : "0"}
                        </span> 
                    </div>
                  </div>

                  {/* <button className="btn btn_man ms-auto">Share</button> */}
                </div>
              </div>
              )}

              <div className="w_box mb-4 overflow-hidden">
                {/* <ul className="nav buy_sell_tab mb-4">
                  <li className="nav-item">
                    <button
                      className="nav-link buy active"
                      disabled={loading}
                      onClick={() => handleSwap("buy")}
                    >
                      {loading ? "Processing..." : "Buy"}
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link sell"
                      disabled={loading}
                      onClick={() => handleSwap("sell")}
                    >
                      {loading ? "Processing..." : "Sell"}
                    </button>
                  </li>
                </ul> */}
                <ul className="nav buy_sell_tab mb-4">
  <li className="nav-item w-50">
    <button
      className={`nav-link buy ${activeTab === "buy" ? "active" : ""}`}
      disabled={loading}
      onClick={() => setActiveTab("buy")}
    >
      Buy
    </button>
  </li>

  <li className="nav-item w-50">
    <button
      className={`nav-link sell ${activeTab === "sell" ? "active" : ""}`}
      disabled={loading}
      onClick={() => setActiveTab("sell")}
    >
      Sell
    </button>
  </li>
</ul>

<button
  className="btn btn_man w-100"
  disabled={loading}
  onClick={() => handleSwap(activeTab)}
>
  {loading ? "Processing..." : activeTab === "buy" ? "Buy Now" : "Sell Now"}
</button>

                <div className="tab-content">
                  <label className="mb-1">Enter Amount</label>
                  <div className="form-group mb-3 position-relative">
                    <input
                      className="form-control"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <span className="d-flex input_coin gap-2">
                      <span>{token?.name || "Token"}</span>
                      <img
                        src={
                          token?.logo
                            ? `${import.meta.env.VITE_API_IMG_URL}${token.logo}`
                            : "/img/about.png"
                        }
                        alt={token?.name || "token"}
                        className="img-fluid"
                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                      />
                    </span>
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
