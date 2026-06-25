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
import { parseBlockchainError } from "../utils/parseBlockchainError";


// ================= CONFIG =================
const FREE_LIMIT = 1000; // OCC
const PLATFORM_FEE_OCC = "10"; // 10 OCC for Sonic
const PLATFORM_FEE_USDT = "10"; // 10 USDT for other chains

const OCC_TOKEN_ADDRESS = "0x307Ad911cF5071be6Aace99Cb2638600212dC657"; // mainnet
const USDT_TOKEN_ADDRESSES = {
  ethereum: process.env.VITE_USDT_TOKEN_ADDRESS_ETH || "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  polygon: process.env.VITE_USDT_TOKEN_ADDRESS_POL || "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  base: process.env.VITE_USDT_TOKEN_ADDRESS_BASE || "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  sonic: null // No USDT fee for Sonic
};

const FIXED_WALLET =
  process.env.FIXED_WALLET_ETH ||
  "0x78E6c8BE860257A3c9730a0095b11437eA5018bC";

const ROYALTY_WALLET =
  process.env.ROYALTY_WALLET_ETH ||
  "0x78E6c8BE860257A3c9730a0095b11437eA5018bC";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
];

const CHAINS = {
  ethereum: { chainId: "0x1", name: "Ethereum Mainnet" },
  polygon: { chainId: "0x89", name: "Polygon Mainnet" },
  base: { chainId: "0x2105", name: "Base Mainnet" },
  sonic: { chainId: "0x92", name: "Sonic Mainnet" },
};

export default function CreateCoin() {
  const { user } = useAuth();
  const appkit = useAppKitProvider();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    tagline: "",
    projectCategory: "",
    description: "",
    chain: "",
    logo: null,
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
  });
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState("Preparing deployment");
  const [occBalance, setOccBalance] = useState(null);

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
      const previewUrl = URL.createObjectURL(files[0]);
      setLogoPreview(previewUrl);
    } else {
      setForm({ ...form, [name]: value });
    }
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
    
    let decimals = 18;
    try {
      decimals = await token.decimals();
    } catch (err) {
      console.warn('decimals() failed, using 18:', err.message);
    }
    
    const bal = await token.balanceOf(userAddr);
    return Number(ethers.formatUnits(bal, decimals));
  };

  // ================= PAY FEE BASED ON CHAIN =================
// ================= PAY FEE BASED ON CHAIN =================
const payFee = async (signer, chain) => {
  const userAddr = await signer.getAddress();
  
  // OCC balance check ONLY on Sonic chain (where OCC contract exists)
  let occBalance = 0;
  if (chain === "sonic") {
    occBalance = await getOnChainOccBalance(signer);
    setOccBalance(occBalance);
  }
  
  // Free if OCC >= 1000 (Sonic only) OR other chains (no OCC check needed)
  if (occBalance >= FREE_LIMIT) {
    console.log("Free deployment");
    return { feePaid: "0", feeTxHash: "FREE", feeType: "FREE" };
  }

  // Sonic = Charge OCC fee
  if (chain === "sonic") {
    const token = new ethers.Contract(OCC_TOKEN_ADDRESS, ERC20_ABI, signer);
    let decimals = 18;
    try {
      decimals = await token.decimals();
    } catch (err) {
      console.warn('OCC decimals() failed:', err);
    }
    
    const amount = ethers.parseUnits(PLATFORM_FEE_OCC, decimals);
    const bal = await token.balanceOf(userAddr);

    if (bal < amount) {
      throw new Error(`Insufficient OCC. Need ${PLATFORM_FEE_OCC}, have ${occBalance.toFixed(2)}`);
    }

    const tx = await token.transfer(FIXED_WALLET, amount);
    await tx.wait();
    return { feePaid: PLATFORM_FEE_OCC, feeTxHash: tx.hash, feeType: "OCC" };
  } 
  // Other chains = Charge USDT fee
  else {
    const usdtAddress = USDT_TOKEN_ADDRESSES[chain];
    console.log("USDT address for chain", chain, ":", usdtAddress);
    if (!usdtAddress) {
      throw new Error("USDT address not configured");
    }

    const usdtToken = new ethers.Contract(usdtAddress, ERC20_ABI, signer);
    let decimals = 6;
    try {
      decimals = await usdtToken.decimals();
    } catch (err) {
      console.warn('USDT decimals() failed:', err);
    }
    
    const amount = ethers.parseUnits(PLATFORM_FEE_USDT, decimals);
    const bal = await usdtToken.balanceOf(userAddr);

    if (bal < amount) {
      const usdtBal = Number(ethers.formatUnits(bal, decimals));
      throw new Error(`Insufficient USDT. Need ${PLATFORM_FEE_USDT}, have ${usdtBal.toFixed(2)}`);
    }

    const tx = await usdtToken.transfer(FIXED_WALLET, amount);
    await tx.wait();
    return { feePaid: PLATFORM_FEE_USDT, feeTxHash: tx.hash, feeType: "USDT" };
  }
};

  // ================= MAIN FLOW =================
  const deployToken = async () => {
    try {
      setDeploying(true);
      setDeployStep("Checking wallet connection");
      const walletProvider = getWalletProvider();
      
      if (!walletProvider) {
        popupError("Wallet Required", "Please connect your wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(walletProvider);

      // 🔥 CHECK ACCOUNTS FIRST
      const accounts = await provider.send("eth_accounts", []);

      if (!accounts || accounts.length === 0) {
        popupWarning("Wallet Not Connected", "Please connect your wallet first");
        return;
      }

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (!userAddress) {
        popupWarning("Wallet Not Connected", "Please connect your wallet first");
        return;
      }

      // const provider = new ethers.BrowserProvider(walletProvider);
      // const signer = await provider.getSigner();
      // const userAddress = await signer.getAddress();
      console.log('Connected wallet:', userAddress);

      if (!form.chain) {
        popupError("Chain Required", "Please select a blockchain network");
        return;
      }

      // Network switch
      setDeployStep(`Switching to ${CHAINS[form.chain]?.name || "selected network"}`);
      await ensureCorrectNetwork(form.chain);

      // Pay fee based on chain and OCC balance
      setDeployStep("Confirming platform fee");
      const feeResult = await payFee(signer, form.chain);
      console.log('Fee result:', feeResult);

      // Deploy token
      setDeployStep("Deploying token contract");
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

      // Backend API call
      setDeployStep("Saving coin details");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("symbol", form.symbol);
      formData.append("supply", form.supply);
      formData.append("description", form.description);
      formData.append("tagline", form.tagline);
      formData.append("projectCategory", form.projectCategory);
      formData.append("chain", form.chain);
      formData.append("tokenAddress", tokenAddress);
      formData.append("creatorWallet", userAddress);
      formData.append("feePaid", feeResult.feePaid);
      formData.append("feeTxHash", feeResult.feeTxHash);
      formData.append("feeType", feeResult.feeType);
      formData.append("website", form.website);
      formData.append("twitter", form.twitter);
      formData.append("telegram", form.telegram);
      formData.append("discord", form.discord);
      if (form.logo) formData.append("logo", form.logo);
      
      // formData.append("name", 'SonicToken7');
      // formData.append("symbol", 'SONIC7');
      // formData.append("supply", '5');
      // formData.append("description", 'This is a description for SonicToken7');
      // formData.append("chain", form.chain);
      // formData.append("tokenAddress", '0x4265790a5Cf6Efc18d94Ff77Cb9Ac90300c08f59');
      // formData.append("creatorWallet", '0x4103921D5FEA1cEe55AA00b3aE6103E958dEf91F');
      // formData.append("feePaid", '0');
      // formData.append("feeTxHash", 'FREE');
      // formData.append("feeType", 'FREE');
      const res = await api.post("/token-flow/create-token-flow", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      popupSuccess(
        "Token Created", 
        "",
        () => navigate("/occy-token")
      );

    } catch (err) {
      console.error('FULL ERROR OBJECT:', err);
      
      // 🔥 DETAILED ERROR HANDLING FOR ALL CASES
      let errorTitle = "Error";
      let errorMessage = "Something went wrong";

      // 1. AXIOS/HTTP ERRORS (Backend DEX errors)
      if (err.response?.data) {
        const backendError = err.response.data;
        
        if (backendError.error) {
          errorTitle = "Blockchain Error";
          errorMessage = backendError.error;
          
          // Show additional details if available
          if (backendError.details) {
            errorMessage += `\n\nDetails: ${JSON.stringify(backendError.details)}`;
          }
          if (backendError.code) {
            errorTitle += ` (${backendError.code})`;
          }
        } else {
          errorMessage = backendError.message || backendError.error || "Backend error";
        }
      }
      // 2. ETHEREUM/WALLET ERRORS
      else if (err.code) {
        switch (err.code) {
          case 4001:
            errorTitle = "Transaction Rejected";
            errorMessage = "You rejected the transaction";
            break;
          case 'INSUFFICIENT_FUNDS':
          case -32002:
            errorTitle = "Insufficient Funds";
            errorMessage = "Not enough gas/native token";
            break;
          case 4902:
          case 'NONCE_EXPIRED':
            errorTitle = "Nonce Error";
            errorMessage = "Please refresh and try again";
            break;
          case -32003:
            errorTitle = "Wallet Locked";
            errorMessage = "Unlock your wallet first";
            break;
          default:
            errorTitle = `Wallet Error (${err.code})`;
            errorMessage = err.message || "Wallet connection failed";
        }
      }
      // 3. NETWORK/JAVASCRIPT ERRORS
      else {
        errorTitle = "Network Error";
        errorMessage = err.message || "Connection failed. Check your internet";
      }

      // 🔥 SHOW DETAILED POPUP
      // popupError(errorTitle, errorMessage);
      const { title, message } = parseBlockchainError(err);
      popupError(title, message);

      
    } finally {
      setDeploying(false);
      setDeployStep("Preparing deployment");
    }
  };

  // ================= UI (UNCHANGED) =================
  return (
    <>
      <Navbar />

      {deploying && (
        <div className="coin-deploy-loader" role="status" aria-live="polite">
          <div className="coin-deploy-loader__panel">
            <div className="coin-deploy-loader__coin">
              <i className="bi bi-coin"></i>
            </div>
            <span className="coin-deploy-loader__eyebrow">Create New Coin</span>
            <h3>Launching your token</h3>
            <p>{deployStep}</p>
            <div className="coin-deploy-loader__bar" aria-hidden="true">
              <span></span>
            </div>
            <small>Please keep this window open and approve wallet prompts.</small>
          </div>
        </div>
      )}

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
                        required
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
                        required
                      />
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <label>Supply</label>
                      <input
                        className="form-control"
                        name="supply"
                        type="number"
                        min="1"
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}  
                        value={form.supply}
                        onChange={handleChange}
                        placeholder="Enter Supply"
                        required
                      />
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <label>Select Chain</label>
                      <select
                        className="form-control"
                        name="chain"
                        value={form.chain}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Chain</option>
                        <option value="ethereum">Ethereum Mainnet</option> 
                        <option value="polygon">Polygon Mainnet</option> 
                        <option value="base">Base Mainnet</option> 
                        <option value="sonic">Sonic Mainnet</option>
                      </select>
                    </div>
                  
                    <div className="form-group mb-3 col-md-6">
                        <label>Tagline</label>
                        <input
                          className="form-control"
                          name="tagline"
                          value={form.tagline}
                          onChange={handleChange}
                          placeholder="Enter Tagline"
                          required
                          minLength={100}
                          maxLength={200}
                        />
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <label>Project Category</label>
                        <select
                          className="form-control"
                          name="projectCategory"
                          value={form.projectCategory}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="meme">Meme Coin</option> 
                          <option value="community">Community</option> 
                          <option value="defi">DeFi</option> 
                          <option value="utility">Utility</option> 
                          <option value="gaming">Gaming/NFT</option>
                          <option value="ai">AI & Technology</option>
                          <option value="rwa">Real World Assets(RWA)</option>
                          <option value="other">Other</option>
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
                  <div className="row mt-4">
                    <div className="form-group mb-3 col-md-6">
                      <label>Website</label>
                      <input
                        className="form-control"
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <label>Twitter</label>
                      <input
                        className="form-control"
                        type="url"
                        name="twitter"
                        value={form.twitter}
                        onChange={handleChange}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <label>Telegram</label>
                      <input
                        className="form-control"
                        type="url"
                        name="telegram"
                        value={form.telegram}
                        onChange={handleChange}
                        placeholder="https://t.me/username"
                      />
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <label>Discord</label>
                      <input
                        className="form-control"
                        type="url"
                        name="discord"
                        value={form.discord}
                        onChange={handleChange}
                        placeholder="https://discord.com/invite/username"
                      />
                    </div>
                  </div>

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
