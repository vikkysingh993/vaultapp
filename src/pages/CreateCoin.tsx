import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import tokenArtifact from "../contract/MyToken.json";
import { popupSuccess, popupError, popupWarning } from "../utils/popup";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../config/axios";



// ================= CONFIG =================
const FREE_LIMIT = 1000; // OCC
const PLATFORM_FEE = "10"; // 10 OCC
// const OCC_TOKEN_ADDRESS = "0xa4AB1A20c710cc956B72fe4C57b65613d1Bb8727"; // testnet

const OCC_TOKEN_ADDRESS = "0x307Ad911cF5071be6Aace99Cb2638600212dC657"; // mainnet

const FIXED_WALLET =
  process.env.FIXED_WALLET_ETH ||
  "0xE573DE17dAA654BC6D8e62D765feC77d6Ef3f0D4";

const ROYALTY_WALLET =
  process.env.ROYALTY_WALLET_ETH ||
  "0xE573DE17dAA654BC6D8e62D765feC77d6Ef3f0D4";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
];

// ================= NETWORK CONFIG (MAINNET) ================= //
const CHAINS = { ethereum: { chainId: "0x1", name: "Ethereum Mainnet" }, polygon: { chainId: "0x89", name: "Polygon Mainnet" }, base: { chainId: "0x2105", name: "Base Mainnet" }, sonic: { chainId: "0x92", name: "Sonic Mainnet" }, };
export default function CreateCoin() {
  const { user } = useAuth();
  const appkit = useAppKitProvider();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    description: "",
    chain: "",
    logo: null,
  });

  const [deploying, setDeploying] = useState(false);

  // ================= HELPERS =================
  const getWalletProvider = () => {
    if (appkit?.walletProvider) return appkit.walletProvider;
    if (window.ethereum) return window.ethereum;
    return null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
        setForm({ ...form, logo: files[0] });

        // 🔥 PREVIEW
        const previewUrl = URL.createObjectURL(files[0]);
        setLogoPreview(previewUrl);
      } else {
        setForm({ ...form, [name]: value });
      }
    // setForm({ ...form, [name]: name === "logo" ? files[0] : value });
  };

  // ================= SWITCH NETWORK =================
  const ensureCorrectNetwork = async (chainKey) => {
    const config = CHAINS[chainKey];
    if (!config) throw new Error("Unsupported network");

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
  };

// ================= ON-CHAIN OCC BALANCE =================
const getOnChainOccBalance = async (signer) => {
  const token = new ethers.Contract(OCC_TOKEN_ADDRESS, ERC20_ABI, signer);
  const userAddr = await signer.getAddress();
  
  let decimals = 18; // Default ERC20
  try {
    decimals = await token.decimals();
  } catch (err) {
    console.warn('decimals() failed, using 18:', err.message);
  }
  
  const bal = await token.balanceOf(userAddr);
  return Number(ethers.formatUnits(bal, decimals));
};
  // ================= PAY PLATFORM FEE =================
const payPlatformFeeInToken = async (signer) => {
  const token = new ethers.Contract(OCC_TOKEN_ADDRESS, ERC20_ABI, signer);
  
  let decimals = 18;
  try {
    decimals = await token.decimals();
  } catch (err) {
    console.warn('decimals() failed, using 18:', err.message);
  }
  
  const amount = ethers.parseUnits(PLATFORM_FEE, decimals);
  const userAddr = await signer.getAddress();
  const bal = await token.balanceOf(userAddr);

  if (bal < amount) {
    throw new Error("Insufficient OCC balance for platform fee");
  }

  const tx = await token.transfer(FIXED_WALLET, amount);
  await tx.wait();
  return tx.hash;
};

  // ================= MAIN FLOW =================
  const deployToken = async () => {
    try {
      const walletProvider = getWalletProvider();
      console.log('Wallet provider:', walletProvider); // Debug log
      
      if (!walletProvider) {
        popupError("Wallet Required", "Please connect your wallet");
        return;
      }

      // ✅ Wallet address log करें
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Connected wallet:', userAddress);

      // Skip OCC check completely ✅
      const onChainBalance = FREE_LIMIT + 1; // Force FREE mode
      let platformFeeTx = "FREE";

      // Network switch
      await ensureCorrectNetwork(form.chain);

      // Direct deployment
      const factory = new ethers.ContractFactory(
        tokenArtifact.abi,
        tokenArtifact.bytecode,
        signer
      );

      const totalSupply = ethers.parseUnits(form.supply.toString(), 18);
      const contract = await factory.deploy(
        form.name,
        form.symbol,
        FIXED_WALLET,
        totalSupply,
        ROYALTY_WALLET
      );

      console.log('Deployment TX:', await contract.waitForDeployment());
      const tokenAddress = await contract.getAddress();

      // Backend API call (same as before)
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("symbol", form.symbol);
      formData.append("supply", form.supply);
      formData.append("description", form.description);
      formData.append("chain", form.chain);
      formData.append("tokenAddress", tokenAddress);
      formData.append("creatorWallet", userAddress); // Use actual address
      formData.append("feePaid", "0");
      formData.append("feeTxHash", platformFeeTx);

      if (form.logo) formData.append("logo", form.logo);

      const res = await api.post("/token-flow/create-token-flow", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      popupSuccess("Token Created 🎉", `Token Address:\n${tokenAddress}`, 
        () => navigate("/occy-token")
      );

    } catch (err) {
      console.error('Full error:', err);
      popupError("Error", err.message);
    } finally {
      setDeploying(false);
    }
  };


  // ================= UI (UNCHANGED) =================
  return (
    <>
      <Navbar />

      <section className="in_page">
        <div className="container">
          <h2 className="text-center mb-4">Create New Coin</h2>

          <div className="row">
            <div className="col-lg-7 m-auto apply-form">
              <div className="launchpad_box">
                <h5>Coin Details</h5>
                <p>Choose carefully, these cannot be changed later.</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    deployToken();
                  }}
                >
                  <div className="row mt-4">
                    <div className="form-group mb-3 col-md-6">
                      <label>Token Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter Coin Name"
                      />
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <label>Symbol</label>
                      <input
                        className="form-control"
                        name="symbol"
                        value={form.symbol}
                        onChange={handleChange}
                        placeholder="Enter Ticker"
                      />
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <label>Supply</label>
                      <input
                        className="form-control"
                        name="supply"
                        type="number"
                        value={form.supply}
                        onChange={handleChange}
                        placeholder="Enter Supply"
                      />
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <label>Select Chain</label>
                      <select
                        className="form-control"
                        name="chain"
                        value={form.chain}
                        onChange={handleChange}
                      >
                        <option value="">Select Chain</option>
                        <option value="ethereum">Ethereum Mainnet</option> 
                        <option value="polygon">Polygon Mainnet</option> 
                        <option value="base">Base Mainnet</option> 
                        <option value="sonic">Sonic Mainnet</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group mb-3 col-md-12">
                    <label>
                      Token Description
                      <small className="text-muted ms-2">
                        ({form.description.length}/200)
                      </small>
                    </label>

                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      minLength={100}
                      maxLength={200}
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter description (100–200 characters)"
                      required
                    ></textarea>

                    {form.description.length > 0 && form.description.length < 100 && (
                      <small className="text-danger">
                        Minimum 100 characters required
                      </small>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label>Upload Logo</label>
                    <div className="upload_box">
                      <input
                        className="form-control"
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      <i className="bi bi-cloud-upload d-block"></i>
                      <span>Upload</span>
                    </div>
                    
                  </div>
                  
                    {/* 🔥 LOGO PREVIEW */}
                  {logoPreview && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{
                          maxWidth: "120px",
                          maxHeight: "120px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}

                  <button className="btn btn_man w100" disabled={deploying}>
                    {deploying ? "Processing..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}