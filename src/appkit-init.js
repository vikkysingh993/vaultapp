// src/appkit-init.js
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// ⚙️ WalletConnect project ID
const projectId = "4c10dfedd13987f0e33ec78449a618dc";

// 🌐 Ethereum Mainnet
const ethereumMainnet = {
  id: 1,
  name: "Ethereum",
  network: "ethereum",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/eth"] },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
  testnet: false,
};

// 🌐 Polygon Mainnet
const polygonMainnet = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://polygonscan.com",
    },
  },
  testnet: false,
};

// 🌐 Base Mainnet
const baseMainnet = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  },
  testnet: false,
};

// 🌐 Sonic Mainnet
const sonicMainnet = {
  id: 146, // ⚠️ verify once
  name: "Sonic",
  network: "sonic",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.soniclabs.com"] },
  },
  blockExplorers: {
    default: {
      name: "SonicScan",
      url: "https://sonicscan.org",
    },
  },
  testnet: false,
};

// 🧠 Initialize AppKit
function initAppKit() {
  const isPhantom =
    typeof window !== "undefined" &&
    window?.ethereum?.isPhantom === true;

  /**
   * Phantom supports only EVM mainnets
   * Sonic exclude for Phantom
   */
  const networks = isPhantom
    ? [ethereumMainnet, polygonMainnet, baseMainnet]
    : [ethereumMainnet, polygonMainnet, baseMainnet, sonicMainnet];

  const metadata = {
    name: "Token Launchpad",
    description: "Multi-chain Token Launchpad (Mainnet)",
    url: "http://localhost:5173",
    icons: ["https://yourdomain.com/logo.png"],
  };

  createAppKit({
    adapters: [
      new EthersAdapter({
        enableWalletConnect: true,
        projectId,
      }),
    ],
    networks,
    metadata,
    projectId,
    features: {
      analytics: true,
    },
  });

  console.log(
    `✅ AppKit initialized (Mainnet): ${networks
      .map((n) => n.name)
      .join(", ")}`
  );
}

// Wait until DOM ready
if (document.readyState === "complete") {
  initAppKit();
} else {
  window.addEventListener("load", initAppKit);
}
