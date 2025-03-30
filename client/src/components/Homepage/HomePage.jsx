import { useState, useEffect } from "react";
import { Wallet, Coins, ShieldAlert } from "lucide-react";
import StakeForm from "./StakeForm";
import StakeList from "./StakeList";
import AccountInfo from "./AcctInfo";
import { Link } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useStake } from "../../context/StakeContext";
import useSignerOrProvider from "../../hooks/useSignerOrProvider";
import { getERC20Balances } from "../../utils/getTokenUserBalances"; 


export default function StakingPage() {
  const [activeTab, setActiveTab] = useState("stake");
  const { isConnected, address } = useAppKitAccount();
  const { isOwner, totalRewardsEarned } = useStake();
  const { signer, readOnlyProvider } = useSignerOrProvider();
  const provider = signer || readOnlyProvider;

 
  const [accountData, setAccountData] = useState({
    mpxBalance: "0",
    xfiBalance: "0",
  });

  


  useEffect(() => {
    if (address && provider) {
      getERC20Balances(address, provider)
        .then((balances) => setAccountData(balances))
        .catch(console.error);
    }
  }, [address, provider]);




  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-8">
    
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">StakeXFI Dashboard</h1>
            <p className="text-gray-500">
              Stake MPX tokens and earn XFI rewards
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`${isConnected ? "bg-black rounded-md" : "bg-transparent"}`}
            >
              <appkit-button />
            </div>

            {isConnected && isOwner && (
              <Link
                to="/admin"
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center"
              >
                <ShieldAlert className="h-4 w-4 mr-1" />
                <span className="text-sm">Admin</span>
              </Link>
            )}
          </div>
        </div>

        {isConnected && (
          <AccountInfo
            mpxBalance={accountData.mpxBalance}
            xfiBalance={accountData.xfiBalance}
            totalRewards={totalRewardsEarned}
          />
        )}

        {isConnected ? (
          <div>
            {/* Custom Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "stake"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("stake")}
              >
                Stake MPX
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "manage"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("manage")}
              >
                Manage Stakes
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "stake" ? (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Stake MPX Tokens</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Stake your MPX tokens to earn XFI rewards. Minimum stake is
                    1,000 MPX and maximum is 100,000 MPX.
                  </p>
                </div>
                <div className="p-4">
                  <StakeForm
                  
                    mpxBalance={accountData.mpxBalance}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Your Stakes</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    View and manage your active stakes
                  </p>
                </div>
                <div className="p-4">
                  <StakeList />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-blue-100 p-6 mb-4">
              <Coins className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Connect your wallet to view your balances, stake MPX tokens, and
              manage your rewards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
