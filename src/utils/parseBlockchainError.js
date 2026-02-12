export function parseBlockchainError(err) {
  let title = "Transaction Failed";
  let message =
    "The transaction could not be completed. Please try again.";

  // 🔥 STEP 1: If axios backend error exists → extract that FIRST
  const backendError = err?.response?.data;

  if (backendError) {
    if (backendError.userMessage) {
      return {
        title: "Transaction Failed",
        message: backendError.userMessage,
      };
    }

    if (backendError.error === "LIQUIDITY_FAILED") {
      return {
        title: "Liquidity Failed",
        message:
          "We could not add liquidity for this token.\n\n" +
          "Possible reasons:\n" +
          "• Invalid token ratio\n" +
          "• Token supply too low\n" +
          "• Pool not supported\n\n" +
          "Please try again with different values.",
      };
    }

    if (backendError.code === "CALL_EXCEPTION") {
      return {
        title: "Blockchain Reverted",
        message:
          "The blockchain rejected the transaction.\n\n" +
          "This usually happens when contract validation fails.\n" +
          "Please verify token details and try again.",
      };
    }

    if (backendError.error) {
      return {
        title: "Error",
        message: backendError.error,
      };
    }
  }
  const isUserRejected =
    err?.code === 4001 ||
    err?.error?.code === 4001 ||
    err?.info?.error?.code === 4001 ||
    err?.message?.toLowerCase().includes("user denied") ||
    err?.message?.toLowerCase().includes("user rejected");

  if (isUserRejected) {
    return {
      title: "Transaction Cancelled",
      message: "You cancelled the transaction in your wallet."
    };
  }

  // 🔥 Backend error
  if (err?.response?.data?.userMessage) {
    return {
      title: "Transaction Failed",
      message: err.response.data.userMessage
    };
  }

  // 🔥 STEP 2: Wallet errors
    if (err.code === 4001) {
      return {
        title: "Transaction Cancelled",
        message: "You rejected the transaction in your wallet.",
      };
    }

    if (err.code === "INSUFFICIENT_FUNDS") {
      return {
        title: "Insufficient Funds",
        message:
          "Your wallet does not have enough balance to complete this transaction.",
      };
    }

    if (err.code === "CALL_EXCEPTION") {
      return {
        title: "Smart Contract Error",
        message:
          "The transaction was reverted by the smart contract.\n" +
          "Please review your inputs and try again.",
      };
    }

  

  // 🔥 STEP 3: Fallback
  return {
    title,
    message:
      err?.message?.replace("Request failed with status code 400", "") ||
      message,
  };
}
