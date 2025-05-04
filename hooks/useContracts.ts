// Re-export all the hooks from the individual files
export * from './useMarketplace';
export * from './useRWAAsset';
export * from './useDynamicPricingAgent';

import { CONTRACT_ADDRESSES } from '@/constants/contracts';

export const CONTRACTS = {
  RWAAsset: {
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    name: 'RWA Asset Contract',
    description: 'ERC-721 contract for tokenized real-world assets',
  },
  DynamicPricingAgent: {
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    name: 'Dynamic Pricing Agent',
    description: 'Updates asset prices based on real-world data and market conditions',
  },
  Marketplace: {
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    name: 'Marketplace Contract',
    description: 'Facilitates the buying and selling of tokenized real-world assets',
  },
};
