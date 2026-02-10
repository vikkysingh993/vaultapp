import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import CreateCoin from "./pages/CreateCoin";
import OccyToken from "./pages/OccyToken";
import Coin from "./pages/Coin";
import StaticPage from "./pages/StaticPage";
import Launchpad from "./pages/Launchpad";
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-coin" element={<CreateCoin />} />
        {/* <Route path="/occy-token" element={<OccyToken />} /> */}
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/occy-token/:tokenAddress?" element={<OccyToken />} />
        
        <Route path="/:slug" element={<StaticPage />} />
      </Routes>
    </AuthProvider>
  );
}
