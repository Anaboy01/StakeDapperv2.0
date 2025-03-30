import { Clock, CheckCircle } from "lucide-react";
import { useStake } from "../../context/StakeContext";
import useNewClaimReward from "../../hooks/useNewClaimReward";
import { useState, useEffect } from "react";

export default function StakeList() {
  const { stakes } = useStake();
  const handleClaim = useNewClaimReward();
  const [isLoading, setIsLoading] = useState(false);
  // currentTime state will be updated every second
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  // Update currentTime every second to trigger re-render
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calls the claim function for a given stake index.
  const handleWithdrawFunds = async (index) => {
    try {
      setIsLoading(true);
      await handleClaim(index);
    } catch (error) {
      console.error("Withdrawal error", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stakes || stakes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have any active stakes yet.</p>
      </div>
    );
  }

  // Format a Unix timestamp (seconds) to a date string.
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Format a Unix timestamp (seconds) to a date & time string.
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the completion message based on the stake's end time.
  const getCompletionTime = (endTime) => {
    if (endTime <= currentTime) return "Completed";
    return `Completes on ${formatDateTime(endTime)}`;
  };

  // Check if the stake period has completed using currentTime.
  const isCompleted = (endTime) => {
    return endTime <= currentTime;
  };

  // Format the duration (in seconds) to a more readable string.
  const formatDuration = (startTime, endTime) => {
    const durationSeconds = endTime - startTime;
    const days = Math.floor(durationSeconds / 86400);
    const hours = Math.floor((durationSeconds % 86400) / 3600);

    if (days > 0) {
      return `${durationSeconds.toLocaleString()} seconds (${days} ${
        days === 1 ? "day" : "days"
      }${hours > 0 ? `, ${hours} ${hours === 1 ? "hour" : "hours"}` : ""})`;
    } else if (hours > 0) {
      return `${durationSeconds.toLocaleString()} seconds (${hours} ${
        hours === 1 ? "hour" : "hours"
      })`;
    } else {
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      return `${durationSeconds.toLocaleString()} seconds (${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      })`;
    }
  };

  return (
    <div className="space-y-4">
      {stakes.map((stake) => (
        <div key={stake.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-xs text-blue-600">
                  #{stake.id}
                </span>
              </div>
              <div>
                <p className="font-medium">
                  {Number.parseFloat(stake.amount).toLocaleString()} MPX
                </p>
                <p className="text-xs text-gray-500">
                  Staked on {formatDate(stake.startTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isCompleted(stake.duration) ? (
                <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Completed</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {getCompletionTime(stake.duration)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Lock Period</p>
              <p className="font-medium">
                {formatDate(stake.startTime)} - {formatDate(stake.duration)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDuration(stake.startTime, stake.duration)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Rewards</p>
              <p className="font-medium">N/A</p>
            </div>
          </div>

          <button
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              isCompleted(stake.duration) && !stake.hasWithdrawn
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : isCompleted(stake.duration) && stake.hasWithdrawn
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "border border-gray-300 text-gray-700 bg-white"
            }`}
            disabled={!isCompleted(stake.duration) || stake.hasWithdrawn || isLoading}
            onClick={() => handleWithdrawFunds(Number(stake.id))}
          >
            {isLoading
              ? "Processing..."
              : stake.hasWithdrawn
              ? "Withdrawn"
              : isCompleted(stake.duration)
              ? "Withdraw Stake & Rewards"
              : "Locked"}
          </button>
        </div>
      ))}
    </div>
  );
}
