"use client"

import { useState } from "react";
import { Clock, Info } from "lucide-react";
import useStakeFunds from "../../hooks/useStakeFunds";

export default function StakeForm({ mpxBalance }) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(86400);
  const [isStaking, setIsStaking] = useState(false);

  const stakeFunds = useStakeFunds();

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSliderChange = (e) => {
    setDuration(Number(e.target.value));
  };

  const handleMaxAmount = () => {
  
    const maxAmount = Math.min(Number.parseFloat(mpxBalance), 100000);
    setAmount(maxAmount.toString());
  };

  const handleStake = async () => {
    if (!amount || Number.parseFloat(amount) < 1000 || Number.parseFloat(amount) > 100000) {
      alert("Amount must be between 1,000 and 100,000 MPX");
      return;
    }
    setIsStaking(true);
    try {
      await stakeFunds(amount, duration);
      setAmount("");
    } catch (error) {
      console.error("Staking error:", error);
    } finally {
      setIsStaking(false);
    }
  };

 
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${seconds.toLocaleString()} seconds (${minutes} ${minutes === 1 ? "minute" : "minutes"})`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${seconds.toLocaleString()} seconds (${hours} ${hours === 1 ? "hour" : "hours"})`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${seconds.toLocaleString()} seconds (${days} ${days === 1 ? "day" : "days"})`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Amount to Stake</label>
            <span className="text-xs text-gray-500">
              Balance: {Number.parseFloat(mpxBalance).toLocaleString()} MPX
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                min={1000}
                max={100000}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-sm text-gray-500">MPX</span>
              </div>
            </div>
            <button
              onClick={handleMaxAmount}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Max
            </button>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Min: 1,000 MPX | Max: 100,000 MPX</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Staking Duration</label>
            <span className="text-sm font-medium">{formatDuration(duration)}</span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="1"
              max="259200"
              step="60"
              value={duration}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 second</span>
            <span>259,200 seconds (3 days)</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Lock Period</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="font-medium">{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
      <button
        className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isStaking || !amount || Number.parseFloat(amount) < 1000 || Number.parseFloat(amount) > 100000
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handleStake}
        disabled={
          isStaking ||
          !amount ||
          Number.parseFloat(amount) < 1000 ||
          Number.parseFloat(amount) > 100000
        }
      >
        {isStaking ? "Staking..." : "Stake MPX"}
      </button>
    </div>
  );
}
