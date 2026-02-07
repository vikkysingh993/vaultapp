// OCC Token Configuration
export const OCC_TOKEN_CONFIG = {
  // You can add your OCC token contract address here
  // For now, we'll use this as a placeholder
  contractAddress: process.env.REACT_APP_OCC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  
  // Minimum OCC tokens required to launch without fee
  minimumTokensForFreelaunch: 1000,
  
  // Standard fee amount (in native currency or OCC tokens)
  standardLaunchFee: 0.1, // Example: 0.1 OCC or SOL
};

// ERC20 ABI (minimal - only balanceOf function)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
