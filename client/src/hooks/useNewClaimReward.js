import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useNewClaimReward = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (index) => {
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
        // Estimate gas for the withdrawal with the provided index.
        const estimatedGas = await contract.withdrawStake.estimateGas(index);
        const tx = await contract.withdrawStake(index, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Withdraw successful");
          return true;
        }
        toast.error("Failed to Withdraw");
        return false;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodedError = await errorDecoder.decode(error);
        console.error("Error Withdrawing", decodedError);
        toast.error(decodedError.reason);
        return false;
      }
    },
    [address, contract, chainId]
  );
};

export default useNewClaimReward;
