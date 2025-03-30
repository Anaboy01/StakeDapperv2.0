import { ethers } from "ethers";
import MPX_ABI from "../ABI/mpx.json"
import XFI_ABI from "../ABI/xfi.json"


const  mpxAddress =  import.meta.env.VITE_MPX_CONTRACT_ADDRESS
const  xfiAddress  =  import.meta.env.VITE_XFI_CONTRACT_ADDRESS
const  stakeContractAddress  =  import.meta.env.VITE_STAKE_CONTRACT_ADDRESS

export async function getERC20Balances(
  userAddress,
  provider,     
     
       
) {
  try {
    const mpxContract = new ethers.Contract(mpxAddress, MPX_ABI, provider);
    const xfiContract = new ethers.Contract(xfiAddress, XFI_ABI, provider);

    
    const [mpxBalance, xfiBalance] = await Promise.all([
      mpxContract.balanceOf(userAddress),
      xfiContract.balanceOf(userAddress),
    ]);

 
    return {
      mpxBalance: ethers.formatEther(mpxBalance),
      xfiBalance: ethers.formatEther(xfiBalance),
    };
  } catch (error) {
    console.error("Error fetching ERC20 balances", error);
    return { mpxBalance: "0", xfiBalance: "0" };
  }
}



export async function approveStakeFunds(userAddress, provider, amount) {
  try {

    const mpxContract = new ethers.Contract(mpxAddress, MPX_ABI, provider);
    
    const parsedAmount = ethers.parseEther(amount);
    
    const tx = await mpxContract.approve(stakeContractAddress, parsedAmount);
    
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error approving funds", error);
    throw error;
  }
}

export async function mintMPXToUser(userAddress, amount, signer) {
  try {
   
    const mpxContract = new ethers.Contract(mpxAddress, MPX_ABI, signer);
    
   
    const parsedAmount = ethers.parseEther(amount);
  
    const tx = await mpxContract.mint(userAddress, parsedAmount);
    
   
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error minting MPX tokens", error);
    throw error;
  }
}


export async function mintXfiToStakeContract(amount, signer) {
  try {
  
    const xfiContract = new ethers.Contract(xfiAddress, XFI_ABI, signer);
    
   
    const parsedAmount = ethers.parseEther(amount);
    
   
    const tx = await xfiContract.mint(stakeContractAddress, parsedAmount);
    
  
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error minting XFI tokens", error);
    throw error;
  }
}
