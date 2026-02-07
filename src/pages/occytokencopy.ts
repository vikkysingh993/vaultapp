import { BrowserProvider, Contract, parseUnits } from "ethers";
import {
  ROUTER_ADDRESS,
  ERC20_ABI,
  ROUTER_ABI,
} from "../config/swapConfig";

export const swapTokenFrontend = async ({
  walletProvider,
  userAddress,
  tokenIn,
  tokenOut,
  amountIn,
}) => {
  if (!walletProvider) {
    throw new Error("Wallet provider not found");
  }

  // ✅ ethers v6 provider
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner(userAddress);

  const router = new Contract(
    ROUTER_ADDRESS,
    ROUTER_ABI,
    signer
  );

  const tokenInContract = new Contract(
    tokenIn,
    ERC20_ABI,
    signer
  );

  const decimals = await tokenInContract.decimals();
  const amtIn = parseUnits(amountIn.toString(), decimals);

  // 🔹 balance check
  const balance = await tokenInContract.balanceOf(userAddress);
  if (balance < amtIn) {
    throw new Error("Insufficient balance");
  }

  // 🔹 allowance check
  const allowance = await tokenInContract.allowance(
    userAddress,
    ROUTER_ADDRESS
  );

  if (allowance < amtIn) {
    const approveTx = await tokenInContract.approve(
      ROUTER_ADDRESS,
      amtIn
    );
    await approveTx.wait();
  }

  // 🔥 SWAP
  const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amtIn,
    0,
    [tokenIn, tokenOut],
    userAddress,
    Math.floor(Date.now() / 1000) + 1200
  );

  const receipt = await tx.wait();
  return receipt.transactionHash;
};
