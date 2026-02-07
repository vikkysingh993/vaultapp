import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";
import occAbi from "./OccyTokenABI.json";

const OCC_TOKEN_ADDRESS =
  import.meta.env.VITE_OCC_TOKEN_ADDRESS;

export const checkBalanceAndTransfer = async (
  walletProvider,
  receiver,
  amount
) => {
  try {
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    const token = new Contract(
      OCC_TOKEN_ADDRESS,
      occAbi,
      signer
    );

    const userAddress = await signer.getAddress();

    const balance = await token.balanceOf(userAddress);
    const formatted = formatUnits(balance, 18);

    if (balance < parseUnits(amount, 18)) {
      return {
        success: false,
        balance: formatted,
      };
    }

    const tx = await token.transfer(
      receiver,
      parseUnits(amount, 18)
    );

    await tx.wait();

    return {
      success: true,
      hash: tx.hash,
      balance: formatted,
    };
  } catch (err) {
    console.error("OCC transfer error:", err);
    return { success: false, error: err.message };
  }
};
