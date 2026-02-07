import { ethers } from "ethers";

export const OCCY_TOKEN_ADDRESS =
  "0x153938b34c8d891cf45c2cf26d40f7afcd3981bb";

export const OCCY_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address,uint256) returns (bool)",
];
