import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import ABI from "../ABI/stake.json";
import useContractInstance from "../hooks/useContractInstance";
import useSignerOrProvider from "../hooks/useSignerOrProvider";
import { useAppKitAccount } from "@reown/appkit/react";
import { readOnlyProvider } from "../constants/readOnlyProvider";

const StakeContext = createContext({
  stakes: [],
  mpxBalance: "",
  xfiBalance: "",
  isOwner: false,
  totalRewardsEarned: "",
});

export const StakeContextProvider = ({ children }) => {
  const [stakes, setStakes] = useState([]);
  const [mpxBalance, setMpxBalance] = useState("");
  const [xfiBalance, setXfiBalance] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [totalRewardsEarned, setTotalRewardsEarned] = useState("");

  const readOnlyStakeContract = useContractInstance();
  const { signer } = useSignerOrProvider();
  const { address } = useAppKitAccount();

  


  const ownerStakeContract = useMemo(() => {
    if (signer && readOnlyStakeContract && readOnlyStakeContract.target) {
      return new ethers.Contract(
        readOnlyStakeContract.target,
        ABI,
        signer
      );
    }
    return null;
  }, [signer, readOnlyStakeContract]);

  const getOwnerAddress = useCallback(async () => {
    if (!readOnlyStakeContract) return;
    try {
      const contractOwner = await readOnlyStakeContract.owner();
      setIsOwner(address.toLowerCase() === contractOwner.toLowerCase());
    } catch (error) {
      console.log("Error fetching contract owner", error);
    }
  }, [readOnlyStakeContract, address]);

  useEffect(() => {
    getOwnerAddress();
  }, [getOwnerAddress]);


  const getStakes = useCallback(async () => {
    if (!readOnlyStakeContract) return;
    try {
      const data = await readOnlyStakeContract.getAllStakes(address);
     
      const formattedStakes = data.map((stake, index) => ({
        id: index.toString(),
        amount: ethers.formatEther(stake.amount).toString(),
        startTime: Number(stake.startTime),
        duration: Number(stake.duration),
        hasWithdrawn: stake.hasWithdrawn,
      }));
      setStakes(formattedStakes);
    } catch (error) {
      console.log("Error fetching stakes", error);
    }
  }, [readOnlyStakeContract, address]);

  useEffect(() => {
    getStakes();
  }, [getStakes]);

  // Fetch and set the contract's MPX balance (owner-only).
  const getContractMpxBalance = useCallback(async () => {
    if (!ownerStakeContract || !isOwner) return;
    try {
      const balance = await ownerStakeContract.getContractMPXBalance();
      setMpxBalance(ethers.formatEther(balance).toString());
    } catch (error) {
      console.log("Error fetching contract MPX balance", error);
    }
  }, [ownerStakeContract, isOwner]);

  useEffect(() => {
    getContractMpxBalance();
  }, [getContractMpxBalance]);

  // Fetch and set the contract's XFI balance (owner-only).
  const getContractXFIBalance = useCallback(async () => {
    if (!ownerStakeContract || !isOwner) return;
    try {
      const balance = await ownerStakeContract.getContractXFIBalance();
      setXfiBalance(ethers.formatEther(balance).toString());
    } catch (error) {
      console.log("Error fetching contract XFI balance", error);
    }
  }, [ownerStakeContract, isOwner]);

  useEffect(() => {
    getContractXFIBalance();
  }, [getContractXFIBalance]);

  // Fetch and set the total rewards earned for the user.
  const getTotalRewardsEarned = useCallback(async () => {
    if (!readOnlyStakeContract) return;
    try {
      const rewards = await readOnlyStakeContract.totalRewardsEarned(address);
      setTotalRewardsEarned(ethers.formatEther(rewards).toString());
    } catch (error) {
      console.log("Error fetching total rewards earned", error);
    }
  }, [readOnlyStakeContract, address]);

  useEffect(() => {
    getTotalRewardsEarned();
  }, [getTotalRewardsEarned]);

  // Listen to contract events and refresh state accordingly.
  useEffect(() => {
    if (!readOnlyStakeContract || !address) return;

    // When a deposit is made by the current user, refresh stakes.
    const depositListener = (staker, amount, startTime) => {
      if (staker.toLowerCase() === address.toLowerCase()) {
        getStakes();
      }
    };

    // When a withdrawal is made by the current user, refresh stakes and total rewards.
    const withdrawalListener = (staker, amount, reward) => {
      if (staker.toLowerCase() === address.toLowerCase()) {
        getStakes();
        getTotalRewardsEarned();
      }
    };

    // When ownership is transferred, re-check the owner.
    const ownershipListener = (previousOwner, newOwner) => {
      getOwnerAddress();
    };

    readOnlyStakeContract.on("DepositSuccessful", depositListener);
    readOnlyStakeContract.on("WithdrawalSuccessful", withdrawalListener);
    readOnlyStakeContract.on("OwnershipTransfered", ownershipListener);

    return () => {
      readOnlyStakeContract.off("DepositSuccessful", depositListener);
      readOnlyStakeContract.off("WithdrawalSuccessful", withdrawalListener);
      readOnlyStakeContract.off("OwnershipTransfered", ownershipListener);
    };
  }, [
    readOnlyStakeContract,
    address,
    getStakes,
    getTotalRewardsEarned,
    getOwnerAddress,
  ]);

  return (
    <StakeContext.Provider
      value={{
        stakes,
        mpxBalance,
        xfiBalance,
        isOwner,
        totalRewardsEarned,
      }}
    >
      {children}
    </StakeContext.Provider>
  );
};

export const useStake = () => {
  return useContext(StakeContext);
};
