import CryptoJS from "crypto-js";

// ⚠️ same key everywhere
const SECRET_KEY = import.meta.env.VITE_URL_SECRET || "occy-secret-123";

// 🔐 Encrypt (URL-safe)
export const encryptAddress = (text) => {
  if (!text) return null;
  return encodeURIComponent(
    CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
  );
};

// 🔓 Decrypt
export const decryptAddress = (cipher) => {
  if (!cipher) return null;

  const bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(cipher),
    SECRET_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};
