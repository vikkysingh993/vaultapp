import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔥 IMPORTANT
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // 👈 THIS FIXES IT
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default api;
