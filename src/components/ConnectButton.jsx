import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAuth } from "../context/AuthContext"; // 👈 ADD
import api from "../config/axios";

export default function ConnectButton() {
  const { address, isConnected } = useAppKitAccount();
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const lastStatusRef = useRef(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (isConnected === undefined) return;

    // ✅ ONLY PROCESS STATUS CHANGE ONCE
    if (lastStatusRef.current === isConnected) return;
    lastStatusRef.current = isConnected;

    if (isConnected && address) {
      handleConnect(address, login);
    }

    if (!isConnected) {
      hasProcessedRef.current = false;
      handleDisconnect(logout, navigate);
    }
  }, [isConnected, address]); // ✅ ONLY THESE DEPENDENCIES

  return <appkit-button />;
}

// =====================
// 🔐 CONNECT API
// =====================
async function handleConnect(address, login) {
  try {
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });

    const chainId = parseInt(chainIdHex, 16);

    const payload = {
      walletAddress: address,
      chainId,
      chainName: getChainName(chainId),
    };

    const res = await api.post("/auth/connect-wallet", payload);
    console.log("✅ WALLET CONNECTED", res.data);

    if (res.data?.success) {
      login(res.data.data);

      if (res.data.token) {
        sessionStorage.setItem("authToken", res.data.token);
      }

      // ✅ NO REDIRECT - User controls navigation
      console.log("✅ User authenticated successfully");
    }
  } catch (e) {
    console.error("❌ Connect wallet failed", e);
  }
}



// =====================
// ❌ DISCONNECT API
// =====================
async function handleDisconnect(logout, navigate) {
  try {
    console.log("❌ Wallet DISCONNECTED");

    await api.post(
      "/auth/disconnect-wallet",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      }
    );

    logout();
    // 🏠 REDIRECT TO HOME
    navigate("/", { replace: true });
  } catch (e) {
    console.error("❌ Disconnect wallet failed", e);
  }
}


// ==========================
// 🌐 Chain Name Resolver
// ==========================
function getChainName(chainId) {
  const chains = {
    1: "Ethereum Mainnet",
    137: "Polygon Mainnet",
    56: "Binance Smart Chain",
    8453: "Base Mainnet",
    146: "Sonic Mainnet", // ⚠️ verify chainId once
  };

  return chains[chainId] || "Unknown Network";
}

