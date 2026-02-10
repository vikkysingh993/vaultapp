export function parseBlockchainError(err) {
  let title = "Transaction Failed";
  let message =
    "The transaction could not be completed. Please try again.";

  const raw =
    err?.reason ||
    err?.error?.message ||
    err?.data?.message ||
    err?.message ||
    "";

  const text = raw.toLowerCase();

  // ---------------- USER REJECT ----------------
  if (err.code === 4001) {
    return {
      title: "Transaction Cancelled",
      message: "You rejected the transaction in your wallet.",
    };
  }

  // ---------------- CALL_EXCEPTION (🔥 MOST IMPORTANT) ----------------
  if (err.code === "CALL_EXCEPTION") {
    return {
      title: "Liquidity Transaction Failed",
      message:
        "The liquidity transaction was reverted by the blockchain. " +
        "This usually happens due to one of the following reasons:\n\n" +
        "• Token amount is too low\n" +
        "• Token decimals mismatch\n" +
        "• Liquidity pool does not support this pair\n" +
        "• Slippage is too low\n\n" +
        "Please try again with a higher amount or different settings.",
    };
  }

  // ---------------- INSUFFICIENT FUNDS ----------------
  if (text.includes("insufficient funds")) {
    return {
      title: "Insufficient Balance",
      message:
        "Your wallet does not have enough balance to pay for gas or tokens.",
    };
  }

  // ---------------- ALLOWANCE ----------------
  if (text.includes("allowance")) {
    return {
      title: "Approval Required",
      message:
        "Token approval is required before continuing. Please approve and try again.",
    };
  }

  // ---------------- LIQUIDITY ----------------
  if (text.includes("liquidity")) {
    return {
      title: "Low Liquidity",
      message:
        "There is not enough liquidity available for this pair. Try a smaller amount.",
    };
  }

  // ---------------- GAS ----------------
  if (text.includes("out of gas")) {
    return {
      title: "Gas Limit Error",
      message:
        "The transaction ran out of gas. Please try again with higher gas.",
    };
  }

  // ---------------- NETWORK ----------------
  if (text.includes("network")) {
    return {
      title: "Network Issue",
      message:
        "The blockchain network is busy. Please wait a moment and try again.",
    };
  }

  // ---------------- FALLBACK ----------------
  return {
    title,
    message: raw
      ? raw.replace(/execution reverted:?/i, "").trim()
      : message,
  };
}
