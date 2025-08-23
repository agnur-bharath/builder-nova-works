import { createConfig, http } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Avalanche network configuration
export const avalancheConfig = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});

// Contract addresses for NFT functionality
export const NFT_CONTRACT_ADDRESS = '0x...'; // To be deployed
export const CHAT_CONTRACT_ADDRESS = '0x...'; // To be deployed

// Avalanche network details
export const AVALANCHE_MAINNET = {
  chainId: 43114,
  name: 'Avalanche',
  currency: 'AVAX',
  explorerUrl: 'https://snowtrace.io',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
};

export const AVALANCHE_FUJI = {
  chainId: 43113,
  name: 'Avalanche Fuji',
  currency: 'AVAX',
  explorerUrl: 'https://testnet.snowtrace.io',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
};
