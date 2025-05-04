import {
  useReadContract,
  useWriteContract,
} from "wagmi";
import { 
  CONTRACT_ADDRESSES, 
  RWAAssetContractABI 
} from "@/constants/contracts";
import { parseEther, type Address } from "viem";

// Type definitions for AssetMetadata
export type AssetMetadata = {
  name: string;
  assetType: string;
  assetLocation: string;
  acquisitionDate: bigint;
  description: string;
  isVerified: boolean;
};

/**
 * Hook to get an asset's metadata
 * @param tokenId The ID of the token
 */
export function useAssetMetadata(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getAssetMetadata",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the current price of an asset
 * @param tokenId The ID of the token
 */
export function useAssetPrice(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getPrice",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the initial price of an asset
 * @param tokenId The ID of the token
 */
export function useAssetInitialPrice(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getInitialPrice",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the URI of a token
 * @param tokenId The ID of the token
 */
export function useTokenURI(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the owner of a token
 * @param tokenId The ID of the token
 */
export function useTokenOwner(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "ownerOf",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the balance of tokens for an address
 * @param address The address to check
 */
export function useTokenBalance(address: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Hook to mint a new asset
 */
export function useMintAsset() {
  const { writeContractAsync } = useWriteContract();

  const mintAsset = async (
    to: Address,
    tokenURI: string,
    initialPrice: string,
    metadata: AssetMetadata
  ) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "mint",
      args: [
        to,
        tokenURI,
        parseEther(initialPrice),
        {
          name: metadata.name,
          assetType: metadata.assetType,
          assetLocation: metadata.assetLocation,
          acquisitionDate: metadata.acquisitionDate,
          description: metadata.description,
          isVerified: metadata.isVerified,
        },
      ],
    });
  };

  return { mintAsset };
}

/**
 * Hook to approve an address to transfer a token
 * @param tokenId The ID of the token
 * @param to The address to approve
 */
export function useApproveToken() {
  const { writeContractAsync } = useWriteContract();

  const approveToken = async (tokenId: bigint, to: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "approve",
      args: [to, tokenId],
    });
  };

  return { approveToken };
}

/**
 * Hook to set approval for all tokens to an operator
 * @param operator The address to approve
 * @param approved Whether to approve or revoke
 */
export function useSetApprovalForAll() {
  const { writeContractAsync } = useWriteContract();

  const setApprovalForAll = async (operator: Address, approved: boolean) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "setApprovalForAll",
      args: [operator, approved],
    });
  };

  return { setApprovalForAll };
}

/**
 * Hook to check if an address is approved for a token
 * @param tokenId The ID of the token
 */
export function useGetApproved(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getApproved",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to check if an address is an approved operator for another address
 * @param owner The owner address
 * @param operator The operator address
 */
export function useIsApprovedForAll(owner: Address | undefined, operator: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "isApprovedForAll",
    args: owner && operator ? [owner, operator] : undefined,
    query: {
      enabled: !!(owner && operator),
    },
  });
}

/**
 * Hook to transfer a token
 */
export function useTransferToken() {
  const { writeContractAsync } = useWriteContract();

  const transferToken = async (from: Address, to: Address, tokenId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "transferFrom",
      args: [from, to, tokenId],
    });
  };

  return { transferToken };
}

/**
 * Hook to safely transfer a token
 */
export function useSafeTransferToken() {
  const { writeContractAsync } = useWriteContract();

  const safeTransferToken = async (from: Address, to: Address, tokenId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "safeTransferFrom",
      args: [from, to, tokenId],
    });
  };

  return { safeTransferToken };
}

/**
 * Hook for updating the price of an asset
 * Note: This will usually be called by the pricing agent, not directly
 */
export function useUpdatePrice() {
  const { writeContractAsync } = useWriteContract();

  const updatePrice = async (tokenId: bigint, newPrice: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "updatePrice",
      args: [tokenId, parseEther(newPrice)],
    });
  };

  return { updatePrice };
}

/**
 * Hook to get the pricing agent address
 */
export function useGetPricingAgent() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.RWAAssetContract,
    abi: RWAAssetContractABI,
    functionName: "getPricingAgent",
  });
}

/**
 * Hook to set the pricing agent address
 * Note: This can only be called by the contract owner
 */
export function useSetPricingAgent() {
  const { writeContractAsync } = useWriteContract();

  const setPricingAgent = async (pricingAgent: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.RWAAssetContract,
      abi: RWAAssetContractABI,
      functionName: "setPricingAgent",
      args: [pricingAgent],
    });
  };

  return { setPricingAgent };
} 