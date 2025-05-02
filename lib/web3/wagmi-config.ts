import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

// Add Pharos network config (custom chain)
const pharosChain = {
  id: 50002, // Replace with actual Pharos chain ID
  name: "Pharos Network",
  network: "pharos",
  nativeCurrency: {
    decimals: 18,
    name: "Pharos",
    symbol: "PHA",
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.dplabs-internal.com"],
    },
  },
  blockExplorers: {
    default: { name: "PharosScan", url: "https://pharosscan.xyz" },
  },
} as const;

// Supported chains
const chains = [pharosChain];

// Create wagmi config
export const config = createConfig({
  chains: [pharosChain],
  ssr: true,
  transports: {
    [pharosChain.id]: http("https://rpc.testnet.pharosnetwork.xyz"),
  },
  connectors: [injected({ target: "metaMask" })],
});

export { chains };
