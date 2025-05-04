import {
  useReadContract,
  useWriteContract,
} from "wagmi";
import { 
  CONTRACT_ADDRESSES, 
  MarketplaceContractABI 
} from "@/constants/contracts";
import { parseEther, formatEther, type Address } from "viem";

// Type definition for Listing
export type Listing = {
  tokenId: bigint;
  seller: Address;
  price: bigint;
  isActive: boolean;
  listedTimestamp: bigint;
};

/**
 * Hook to get a specific asset listing
 * @param tokenId The ID of the token
 */
export function useListing(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "getListing",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get all active listings from the marketplace
 */
export function useActiveListings() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "getActiveListings",
  });
}

/**
 * Hook to get the marketplace fee percentage
 */
export function useMarketplaceFee() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "getMarketplaceFee",
  });
}

/**
 * Hook to get the fee collector address
 */
export function useFeeCollector() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "getFeeCollector",
  });
}

/**
 * Hook to get the RWA Asset Contract address
 */
export function useMarketplaceRWAAssetContract() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "getRWAAssetContract",
  });
}

/**
 * Hook to list an asset for sale
 */
export function useListAsset() {
  const { writeContractAsync } = useWriteContract();

  const listAsset = async (tokenId: bigint, price: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "listAsset",
      args: [tokenId, parseEther(price)],
    });
  };

  return { listAsset };
}

/**
 * Hook to delist an asset from the marketplace
 */
export function useDelistAsset() {
  const { writeContractAsync } = useWriteContract();

  const delistAsset = async (tokenId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "delistAsset",
      args: [tokenId],
    });
  };

  return { delistAsset };
}

/**
 * Hook to buy an asset from the marketplace
 */
export function useBuyAsset() {
  const { writeContractAsync } = useWriteContract();

  const buyAsset = async (tokenId: bigint, price: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "buy",
      args: [tokenId],
      value: parseEther(price),
    });
  };

  return { buyAsset };
}

/**
 * Hook to update the marketplace fee
 * Note: This can only be called by the owner of the contract
 */
export function useUpdateMarketplaceFee() {
  const { writeContractAsync } = useWriteContract();

  const updateMarketplaceFee = async (newFeePercentage: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "updateMarketplaceFee",
      args: [newFeePercentage],
    });
  };

  return { updateMarketplaceFee };
}

/**
 * Hook to update the fee collector address
 * Note: This can only be called by the owner of the contract
 */
export function useUpdateFeeCollector() {
  const { writeContractAsync } = useWriteContract();

  const updateFeeCollector = async (newFeeCollector: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "updateFeeCollector",
      args: [newFeeCollector],
    });
  };

  return { updateFeeCollector };
}

/**
 * Hook to update the RWA Asset Contract address in the Marketplace
 * Note: This can only be called by the owner of the contract
 */
export function useUpdateMarketplaceRWAAssetContract() {
  const { writeContractAsync } = useWriteContract();

  const updateRWAAssetContract = async (rwaAssetContractAddress: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.MarketplaceContract,
      abi: MarketplaceContractABI,
      functionName: "updateRWAAssetContract",
      args: [rwaAssetContractAddress],
    });
  };

  return { updateRWAAssetContract };
}

/**
 * Hook to get the owner of the marketplace contract
 */
export function useMarketplaceOwner() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "owner",
  });
}

/**
 * Utility to format a listing for display
 * @param listing The listing to format
 */
export function formatListing(listing: Listing) {
  return {
    ...listing,
    formattedPrice: formatEther(listing.price),
    formattedDate: new Date(Number(listing.listedTimestamp) * 1000).toLocaleString(),
  };
} 