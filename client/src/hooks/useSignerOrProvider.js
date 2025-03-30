
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { readOnlyProvider } from "../constants/readOnlyProvider";

const useSignerOrProvider = () => {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null); 

  const { walletProvider } = useAppKitProvider("eip155");

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
  );
 

  useEffect(() => {
    if (!provider) return setSigner(null);

    provider.getSigner().then((newSigner) => {
      if (!signer || newSigner.address !== signer.address) {
        setSigner(newSigner);
        setAddress(newSigner.address); 
      }
    });
  }, [provider, signer]);

 

  return { signer, provider, address, readOnlyProvider };
};

export default useSignerOrProvider;