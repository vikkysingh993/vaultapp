import { ethers } from "ethers";
import { ROUTER_ADDRESS, ROUTER_ABI, ERC20_ABI } from "../config/swapConfig";

export async function swapTokenFrontend({
  userAddress,
  tokenIn,
  tokenOut,
  amountIn,
  tokenAddress,
}) {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const parsedAmount = ethers.parseUnits(amountIn.toString(), 18);

  // approve
  const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);
  console.log("Approving token transfer...",tokenContract);
  console.log("tokenIn:", tokenIn);
console.log("tokenOut:", tokenOut);
console.log("ROUTER:", ROUTER_ADDRESS);

  const allowance = await tokenContract.allowance(
    userAddress,
    ROUTER_ADDRESS
  );
  console.log("Allowance:",allowance, "Parsed Amount:", parsedAmount);
  if (allowance < parsedAmount) {
    const tx = await tokenContract.approve(
      ROUTER_ADDRESS,
      ethers.MaxUint256
    );
    await tx.wait();
  }

  const router = new ethers.Contract(
    ROUTER_ADDRESS,
    ROUTER_ABI,
    signer
  );

  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    parsedAmount,
    0,
    [tokenIn, tokenOut],
    userAddress,
    deadline
  );

  const receipt = await tx.wait();
  return receipt.hash;
}
