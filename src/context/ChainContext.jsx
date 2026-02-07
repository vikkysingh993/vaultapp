import React, { createContext, useContext, useState } from "react";

const ChainContext = createContext();

export const ChainProvider = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState("sepolia"); // default

  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = () => useContext(ChainContext);
