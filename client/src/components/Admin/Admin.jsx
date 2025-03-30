"use client";

import { useState } from "react";
import { ArrowDown, ShieldAlert, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { mintMPXToUser, mintXfiToStakeContract } from "../../utils/getTokenUserBalances"; // Import both functions
import { toast } from "react-toastify";
import useSignerOrProvider from "../../hooks/useSignerOrProvider";

export default function AdminPage() {
  const { signer } = useSignerOrProvider();
  
  // MPX minting state
  const [mpxMintAmount, setMpxMintAmount] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isMintingMPX, setIsMintingMPX] = useState(false);
  
  // XFI minting state
  const [xfiMintAmount, setXfiMintAmount] = useState("");
  const [isMintingXFI, setIsMintingXFI] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [contractBalances, setContractBalances] = useState({
    mpx: "150000",
    xfi: "25000",
  });

  const handleRefreshBalances = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setContractBalances({
        mpx: (Number.parseFloat(contractBalances.mpx) + Math.random() * 1000).toFixed(2),
        xfi: (Number.parseFloat(contractBalances.xfi) + Math.random() * 1000).toFixed(2),
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const handleMintMPX = async (e) => {
    e.preventDefault();
    if (!mpxMintAmount || isNaN(Number(mpxMintAmount)) || Number(mpxMintAmount) <= 0 || !userAddress) {
      alert("Please enter a valid amount and user address");
      return;
    }
    if (!signer) {
      alert("Signer is not available");
      return;
    }
    setIsMintingMPX(true);
    try {
      console.log("Minting MPX", { userAddress, mpxMintAmount });
      const receipt = await mintMPXToUser(userAddress, mpxMintAmount, signer);
      setContractBalances({
        ...contractBalances,
        mpx: (Number.parseFloat(contractBalances.mpx) + Number.parseFloat(mpxMintAmount)).toFixed(2),
      });
      toast.success(`Successfully minted ${mpxMintAmount} MPX to ${userAddress}`);
      // Clear inputs after minting
      setMpxMintAmount("");
      setUserAddress("");
    } catch (error) {
      alert("Minting failed. Check console for details.");
    }
    setIsMintingMPX(false);
  };

  const handleMintXFI = async (e) => {
    e.preventDefault();
    if (!xfiMintAmount || isNaN(Number(xfiMintAmount)) || Number(xfiMintAmount) <= 0) {
      alert("Please enter a valid amount for XFI minting");
      return;
    }
    if (!signer) {
      alert("Signer is not available");
      return;
    }
    setIsMintingXFI(true);
    try {
      console.log("Minting XFI", { xfiMintAmount });
      const receipt = await mintXfiToStakeContract(xfiMintAmount, signer);
      setContractBalances({
        ...contractBalances,
        xfi: (Number.parseFloat(contractBalances.xfi) + Number.parseFloat(xfiMintAmount)).toFixed(2),
      });
      toast.success(`Successfully minted ${xfiMintAmount} XFI to the stake contract`);
      // Clear input after minting
      setXfiMintAmount("");
    } catch (error) {
      alert("Minting XFI failed. Check console for details.");
    }
    setIsMintingXFI(false);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">StakeXFI Admin Panel</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ArrowDown className="h-4 w-4 mr-1 rotate-180" />
            Back to Staking
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contract Balances Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contract Balances</h2>
              <button
                onClick={handleRefreshBalances}
                disabled={isRefreshing}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 mr-3">
                    <span className="font-bold text-sm text-blue-600">MPX</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contract Balance</p>
                    <p className="font-medium">{contractBalances.mpx} MPX</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 mr-3">
                    <span className="font-bold text-sm text-green-600">XFI</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contract Balance</p>
                    <p className="font-medium">{contractBalances.xfi} XFI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mint MPX Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Mint MPX to User</h2>
            <form onSubmit={handleMintMPX} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount to Mint</label>
                <div className="relative">
                  <input
                    type="text"
                    value={mpxMintAmount}
                    onChange={(e) => {
                      console.log("New MPX mint amount:", e.target.value);
                      setMpxMintAmount(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="Enter amount"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-gray-500">MPX</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">User Address</label>
                <div className="relative">
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => {
                      console.log("New user address:", e.target.value);
                      setUserAddress(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="Enter user address"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isMintingMPX}
                className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  isMintingMPX ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isMintingMPX ? "Minting..." : "Mint MPX to User"}
              </button>
            </form>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-700 mt-1">
                    Mint new MPX tokens directly to Users. (Only the contract owner can call this function.)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mint XFI Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Mint XFI to Stake Contract</h2>
            <form onSubmit={handleMintXFI} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount to Mint</label>
                <div className="relative">
                  <input
                    type="text"
                    value={xfiMintAmount}
                    onChange={(e) => {
                      console.log("New XFI mint amount:", e.target.value);
                      setXfiMintAmount(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12"
                    placeholder="Enter amount"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-gray-500">XFI</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isMintingXFI}
                className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  isMintingXFI ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isMintingXFI ? "Minting..." : "Mint XFI to Stake Contract"}
              </button>
            </form>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-700 mt-1">
                    Mint new XFI tokens directly to the Stake Contract. (Only the contract owner can call this function.)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
