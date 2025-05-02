import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
} from "wagmi";
import {
  CONTRACT_ADDRESSES,
  RWAAssetContractABI,
  DynamicPricingAgentABI,
  MarketplaceContractABI,
} from "@/constants/contracts";
import { parseEther } from "viem";

// Get asset details from the RWAAssetContract
export function useAssetDetails(assetId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getAssetDetails",
    args: [assetId],
  });
}

// Get asset price history from DynamicPricingAgent
export function usePriceHistory(
  assetId: bigint,
  offset: bigint,
  limit: bigint
) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getPriceUpdateHistory",
    args: [assetId, offset, limit],
  });
}

// Buy an asset through the MarketplaceContract
export function useBuyAsset(assetId: bigint, price: string) {
  const { data } = useSimulateContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "buy",
    args: [assetId],
    value: parseEther(price),
  });

  return {
    write: useWriteContract(),
    data: data,
  };
}

// List an asset for sale
export function useListAsset(assetId: bigint, price: string) {
  const { data } = useSimulateContract({
    address: CONTRACT_ADDRESSES.MarketplaceContract,
    abi: MarketplaceContractABI,
    functionName: "listAsset",
    args: [assetId, parseEther(price)],
  });

  return {
    write: useWriteContract(),
    data: data,
  };
}

// Approve marketplace to transfer the asset (call before listing)
export function useApproveMarketplace(assetId: bigint) {
  const { data } = useSimulateContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "approve",
    args: [CONTRACT_ADDRESSES.MarketplaceContract, assetId],
  });

  return {
    write: useWriteContract(),
    data: data,
  };
}
