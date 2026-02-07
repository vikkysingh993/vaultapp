export const getWalletAddress = (user) => {
  if (!user?.walletAddress) return null;

  // Case 1: array
  if (Array.isArray(user.walletAddress)) {
    return user.walletAddress[0] || null;
  }

  // Case 2: string
  if (typeof user.walletAddress === "string") {
    return user.walletAddress;
  }

  return null;
};
