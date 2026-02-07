// src/config/swapConfig.js

// 🟢 Uniswap-like Router (Sepolia)
export const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS_ETH ||
  "0xee567fe1712faf6149d80da1e6934e354124cfe3";

// // 🪙 Token addresses (Sepolia)
// export const OCCY = process.env.OCCY_TOKEN_ADDRESS_ETH ||
//   "0xa4AB1A20c710cc956B72fe4C57b65613d1Bb8727";

// export const USDT =
//   "0xfc10ac938aa431a1324a6457a07EEFE9383cd82a";

/* ================================
   ABIs (exact from blockchain dev)
================================ */

export const ROUTER_ABI = [
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)"
];

export const ERC20_ABI = [
  "function approve(address,uint256)",
  "function allowance(address owner,address spender) view returns(uint256)"
];
