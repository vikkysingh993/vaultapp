// src/utils/parseLiquidity.js

export const parseLiquidity = (liquidityResponse) => {
  if (!liquidityResponse) return null;

  try {
    const data =
      typeof liquidityResponse === "string"
        ? JSON.parse(liquidityResponse)
        : liquidityResponse;

    return {
      pairAddress: data?.pairAddress || null,

      lpLocked:
        data?.lpLocked &&
        data.lpLocked !== "0" &&
        data.lpLocked !== 0,

      lpLockedRaw: data?.lpLocked || null,
    };
  } catch (e) {
    console.error("❌ Invalid liquidityResponse JSON", e);
    return null;
  }
};
