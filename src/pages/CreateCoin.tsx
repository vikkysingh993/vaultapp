import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import type { Eip1193Provider } from "ethers";
import tokenArtifact from "../contract/MyToken.json";
import { popupSuccess, popupError, popupWarning } from "../utils/popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../config/axios";
import { parseBlockchainError } from "../utils/parseBlockchainError";

// ================= CONFIG =================
const FREE_LIMIT = 1000;
const PLATFORM_FEE_OCC = "10";
const PLATFORM_FEE_USDT = "10";

const OCC_TOKEN_ADDRESS =
  import.meta.env.VITE_OCC_TOKEN_ADDRESS ||
  "0x307Ad911cF5071be6Aace99Cb2638600212dC657";

const USDT_TOKEN_ADDRESSES: Record<string, string | null> = {
  ethereum:
    import.meta.env.VITE_USDT_TOKEN_ADDRESS_ETH ||
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  polygon:
    import.meta.env.VITE_USDT_TOKEN_ADDRESS_POL ||
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  base:
    import.meta.env.VITE_USDT_TOKEN_ADDRESS_BASE ||
    "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  sonic: null,
};

const TREGIDY_WALLET: string =
  import.meta.env.VITE_TREGIDY_WALLET

// Backend wallet = address derived from PRIVATE_KEY on the server.
// Token supply is minted here so the backend can distribute it.
const BACKEND_WALLET: string =
  import.meta.env.VITE_BACKEND_WALLET

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
];

const CHAINS: Record<string, { chainId: string; name: string }> = {
  ethereum: { chainId: "0x1", name: "Ethereum Mainnet" },
  polygon: { chainId: "0x89", name: "Polygon Mainnet" },
  base: { chainId: "0x2105", name: "Base Mainnet" },
  sonic: { chainId: "0x92", name: "Sonic Mainnet" },
};

export default function CreateCoin() {
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    tagline: "",
    projectCategory: "",
    description: "",
    chain: "",
    logo: null as File | null,
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
  });
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState("Preparing deployment");

  // ================= HELPERS =================
  const getWalletProvider = (): Eip1193Provider | null => {
    if (walletProvider) return walletProvider as Eip1193Provider;
    if (window.ethereum) return window.ethereum as unknown as Eip1193Provider;
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (name === "logo" && files && files[0]) {
      setForm({ ...form, logo: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SWITCH NETWORK =================
  const ensureCorrectNetwork = async (provider: Eip1193Provider, chainKey: string) => {
    const config = CHAINS[chainKey];
    if (!config) throw new Error("Unsupported network");
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
  };

  // ================= OCC BALANCE =================
  const getOnChainOccBalance = async (signer: ethers.Signer) => {
    const token = new ethers.Contract(OCC_TOKEN_ADDRESS, ERC20_ABI, signer);
    const userAddr = await signer.getAddress();
    let decimals = 18;
    try {
      decimals = await token.decimals();
    } catch {
      console.warn("decimals() failed, using 18");
    }
    const bal = await token.balanceOf(userAddr);
    return Number(ethers.formatUnits(bal, decimals));
  };

  // ================= PAY FEE =================
  const payFee = async (signer: ethers.Signer, chain: string) => {
    const userAddr = await signer.getAddress();

    if (chain === "sonic") {
      const balance = await getOnChainOccBalance(signer);

      if (balance >= FREE_LIMIT) {
        console.log("Free deployment — OCC balance sufficient");
        return { feePaid: "0", feeTxHash: "FREE", feeType: "FREE" };
      }

      const token = new ethers.Contract(OCC_TOKEN_ADDRESS, ERC20_ABI, signer);
      let decimals = 18;
      try {
        decimals = await token.decimals();
      } catch {
        console.warn("OCC decimals() failed");
      }
      const amount = ethers.parseUnits(PLATFORM_FEE_OCC, decimals);
      const bal = await token.balanceOf(userAddr);
      if (bal < amount) {
        throw new Error(
          `Insufficient OCC. Need ${PLATFORM_FEE_OCC}, have ${balance.toFixed(2)}`
        );
      }
      const tx = await token.transfer(BACKEND_WALLET, amount);
      await tx.wait();
      return { feePaid: PLATFORM_FEE_OCC, feeTxHash: tx.hash, feeType: "OCC" };
    }

    // Other chains — charge USDT
    const usdtAddress = USDT_TOKEN_ADDRESSES[chain];
    if (!usdtAddress) throw new Error("USDT address not configured for this chain");

    const usdtToken = new ethers.Contract(usdtAddress, ERC20_ABI, signer);
    let decimals = 6;
    try {
      decimals = await usdtToken.decimals();
    } catch {
      console.warn("USDT decimals() failed");
    }
    const amount = ethers.parseUnits(PLATFORM_FEE_USDT, decimals);
    const bal = await usdtToken.balanceOf(userAddr);
    if (bal < amount) {
      const usdtBal = Number(ethers.formatUnits(bal, decimals));
      throw new Error(
        `Insufficient USDT. Need ${PLATFORM_FEE_USDT}, have ${usdtBal.toFixed(2)}`
      );
    }
    const tx = await usdtToken.transfer(BACKEND_WALLET, amount);
    await tx.wait();
    return { feePaid: PLATFORM_FEE_USDT, feeTxHash: tx.hash, feeType: "USDT" };
  };

  // ================= MAIN FLOW =================
  const deployToken = async () => {
    setDeploying(true);
    setDeployStep("Checking wallet connection");

    try {
      const rawProvider = getWalletProvider();
      if (!rawProvider) {
        popupError("Wallet Required", "Please connect your wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(rawProvider as Eip1193Provider);
      const accounts = await provider.send("eth_accounts", []);
      if (!accounts || accounts.length === 0) {
        popupWarning("Wallet Not Connected", "Please connect your wallet first");
        return;
      }

      if (!form.chain) {
        popupError("Chain Required", "Please select a blockchain network");
        return;
      }

      // Switch network using raw provider so AppKit/WalletConnect works too
      setDeployStep(`Switching to ${CHAINS[form.chain]?.name || "selected network"}`);
      await ensureCorrectNetwork(rawProvider, form.chain);

      // Re-get signer AFTER network switch so it's on the correct chain
      const freshProvider = new ethers.BrowserProvider(rawProvider as Eip1193Provider);
      const signer = await freshProvider.getSigner();
      const userAddress = await signer.getAddress();

      // Pay fee
      setDeployStep("Confirming platform fee");
      const feeResult = await payFee(signer, form.chain);
      console.log("Fee result:", feeResult);

      // Deploy token — mint entire supply to BACKEND_WALLET so server can distribute
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
        BACKEND_WALLET,   // receiver_ → backend wallet holds all tokens for distribution
        totalSupply,
        TREGIDY_WALLET    // royaltyWallet_
      );
      await contract.waitForDeployment();
      const tokenAddress = await contract.getAddress();
      console.log("Token deployed at:", tokenAddress);

      // Save to backend
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

      await api.post("/token-flow/create-token-flow", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      popupSuccess("Token Created", "", () => navigate("/occy-token"));
    } catch (err) {
      console.error("Deploy error:", err);
      const { title, message } = parseBlockchainError(err);
      popupError(title, message);
    } finally {
      setDeploying(false);
      setDeployStep("Preparing deployment");
    }
  };

  // ================= UI =================
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

                <form onSubmit={(e) => { e.preventDefault(); deployToken(); }}>
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
                          if (e.key === "-" || e.key === "e") e.preventDefault();
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
                        <option value="rwa">Real World Assets (RWA)</option>
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
                      rows={4}
                      minLength={100}
                      maxLength={200}
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter description (100–200 characters)"
                      required
                    />
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
