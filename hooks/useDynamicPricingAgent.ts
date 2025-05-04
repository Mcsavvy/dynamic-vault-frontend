import {
  useReadContract,
  useWriteContract,
} from "wagmi";
import { 
  CONTRACT_ADDRESSES, 
  DynamicPricingAgentABI 
} from "@/constants/contracts";
import { type Address } from "viem";

// Type definition for PriceUpdate
export type PriceUpdate = {
  tokenId: bigint;
  oldPrice: bigint;
  newPrice: bigint;
  timestamp: bigint;
  dataSource: string;
  confidenceScore: number;
};

/**
 * Hook to get the latest price update for a token
 * @param tokenId The ID of the token
 */
export function useLatestPriceUpdate(tokenId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getLatestPriceUpdate",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get price update history for a token with pagination
 * @param tokenId The ID of the token
 * @param offset The offset to start from
 * @param limit The number of records to fetch
 */
export function usePriceUpdateHistory(
  tokenId: bigint | undefined,
  offset: bigint = BigInt(0),
  limit: bigint = BigInt(10)
) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getPriceUpdateHistory",
    args: tokenId ? [tokenId, offset, limit] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

/**
 * Hook to get the minimum confidence score required for price updates
 */
export function useMinimumConfidenceScore() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getMinimumConfidenceScore",
  });
}

/**
 * Hook to update the minimum confidence score
 * Note: This can only be called by an address with ADMIN_ROLE
 */
export function useUpdateMinimumConfidenceScore() {
  const { writeContractAsync } = useWriteContract();

  const updateMinimumConfidenceScore = async (newScore: number) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "updateMinimumConfidenceScore",
      args: [newScore],
    });
  };

  return { updateMinimumConfidenceScore };
}

/**
 * Hook to update the price of an asset
 * Note: This can only be called by an address with ORACLE_ROLE
 */
export function useUpdateAssetPrice() {
  const { writeContractAsync } = useWriteContract();

  const updateAssetPrice = async (
    tokenId: bigint,
    newPrice: bigint,
    dataSource: string,
    confidenceScore: number
  ) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "updatePrice",
      args: [tokenId, newPrice, dataSource, confidenceScore],
    });
  };

  return { updateAssetPrice };
}

/**
 * Hook to get the address of the RWA Asset Contract
 */
export function useRWAAssetContract() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getRWAAssetContract",
  });
}

/**
 * Hook to update the RWA Asset Contract address in the Dynamic Pricing Agent
 * Note: This can only be called by an address with ADMIN_ROLE
 */
export function useUpdatePricingAgentRWAAssetContract() {
  const { writeContractAsync } = useWriteContract();

  const updateRWAAssetContract = async (rwaAssetContractAddress: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "updateRWAAssetContract",
      args: [rwaAssetContractAddress],
    });
  };

  return { updateRWAAssetContract };
}

/**
 * Hook to check if an address has a specific role
 * @param role The role hash to check
 * @param account The account to check for the role
 */
export function useHasRole(role: string, account: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "hasRole",
    args: account ? [role, account] : undefined,
    query: {
      enabled: !!account,
    },
  });
}

/**
 * Hook to get the admin role for a specific role
 * @param role The role hash to get the admin for
 */
export function useRoleAdmin(role: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "getRoleAdmin",
    args: [role],
  });
}

/**
 * Hook to grant a role to an account
 * Note: This can only be called by an address with the admin role for the role being granted
 */
export function useGrantRole() {
  const { writeContractAsync } = useWriteContract();

  const grantRole = async (role: string, account: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  return { grantRole };
}

/**
 * Hook to revoke a role from an account
 * Note: This can only be called by an address with the admin role for the role being revoked
 */
export function useRevokeRole() {
  const { writeContractAsync } = useWriteContract();

  const revokeRole = async (role: string, account: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "revokeRole",
      args: [role, account],
    });
  };

  return { revokeRole };
}

/**
 * Hook to renounce a role
 * Note: This can only be called by the account that has the role
 */
export function useRenounceRole() {
  const { writeContractAsync } = useWriteContract();

  const renounceRole = async (role: string, callerConfirmation: Address) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.DynamicPricingAgent,
      abi: DynamicPricingAgentABI,
      functionName: "renounceRole",
      args: [role, callerConfirmation],
    });
  };

  return { renounceRole };
}

/**
 * Constants for the roles in the contract
 */
export const ROLES = {
  DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000",
  ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000001", // This is an example, use the actual value from the contract
  ORACLE_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000002", // This is an example, use the actual value from the contract
};

/**
 * Hook to get the ADMIN_ROLE constant
 */
export function useAdminRole() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "ADMIN_ROLE",
  });
}

/**
 * Hook to get the ORACLE_ROLE constant
 */
export function useOracleRole() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "ORACLE_ROLE",
  });
}

/**
 * Hook to get the DEFAULT_ADMIN_ROLE constant
 */
export function useDefaultAdminRole() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DynamicPricingAgent,
    abi: DynamicPricingAgentABI,
    functionName: "DEFAULT_ADMIN_ROLE",
  });
}