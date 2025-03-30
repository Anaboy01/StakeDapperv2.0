import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { baseSepolia, defineChain, sepolia } from '@reown/appkit/networks'


// 1. Get projectId

const projectId ="c2993e17e517b95baac47667cdda11d3";

const crossFiTestnet = defineChain({
  id: 4157,
  caipNetworkId: "eip155:4157",
  chainNamespace: "eip155",
  name: "CrossFi Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_APP_CROSSFI_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "XFI Scan",
      url: import.meta.env.VITE_APP_CROSSFI_EXPLORER_URL,
    },
  },
  contracts: {
    
  },
});



// 3. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [crossFiTestnet],
  chainImages: {
    [crossFiTestnet.id]:
      "https://s2.coinmarketcap.com/static/img/coins/64x64/26202.png",
  },
  metadata,
  projectId,
  themeVariables: {
    "--w3m-accent": "#4f46e5",
    "--w3m-border-radius-master":"1px"
  },
  features: {
    analytics: true
  },


});