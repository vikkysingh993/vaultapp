// src/networks.js
// Local fallback MAINNET network definitions
// (Used if @reown/appkit/networks package is unavailable)

// 🌐 Sonic Mainnet
export const sonicMainnet = {
  id: 146, // ⚠️ VERIFY from official Sonic docs
  name: "Sonic",
  network: "sonic-mainnet",
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

// 🌐 Ethereum Mainnet
export const ethereum = {
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
export const polygon = {
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
export const base = {
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

// ✅ Supported MAINNET Networks
export const supportedNetworks = [
  ethereum,
  polygon,
  base,
  sonicMainnet,
];
