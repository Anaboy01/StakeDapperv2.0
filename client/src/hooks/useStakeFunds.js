import { ethers } from "ethers";
import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { approveStakeFunds } from "../utils/getTokenUserBalances";
import useSignerOrProvider from "./useSignerOrProvider";

const useStakeFunds = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { signer, readOnlyProvider } = useSignerOrProvider();
  const provider = signer || readOnlyProvider;

  return useCallback(
    async (amount, duration) => {
      if (!amount || !duration) {
        toast.error("Amount and duration are required");
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== 4157) {
        toast.error("You're not connected to CrossFi");
        return;
      }

    
      try {
        await approveStakeFunds(address, provider, amount);
        toast.success("Funds approved successfully");
      } catch (error) {
        toast.error("Approval failed");
        return;
      }

   
      const amountInWei = ethers.parseEther(amount);
      try {
      
        const estimatedGas = await contract.stake.estimateGas(amountInWei, duration);
        const tx = await contract.stake(amountInWei, duration, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();
        if (receipt.status === 1) {
          toast.success("Stake initiated successfully");
          return;
        }
        toast.error("Failed to initiate staking transaction");
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const { reason } = await errorDecoder.decode(error);
        toast.error(reason);
      }
    },
    [contract, address, chainId, provider]
  );
};

export default useStakeFunds;
