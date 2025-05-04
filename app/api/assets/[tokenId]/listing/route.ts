import { assetService, transactionService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { assetListingSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// List an asset for sale
export async function POST(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      const tokenId = parseInt(params.tokenId);
      
      if (isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }
      
      if (!req.user?.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Get the asset to check ownership
      const asset = await assetService.getAssetByTokenId(tokenId);
      
      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }
      
      // Ensure user is the owner of the asset
      if (asset.ownership.currentOwner.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
        return NextResponse.json(
          { error: 'Unauthorized - You are not the owner of this asset' },
          { status: 403 }
        );
      }
      
      // Check if asset is already listed
      if (asset.marketStatus.isListed) {
        return NextResponse.json(
          { error: 'Asset is already listed for sale' },
          { status: 400 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, assetListingSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Calculate USD price based on current exchange rate
      const usdRate = asset.currentPrice.valueUsd / asset.currentPrice.value;
      const priceUsd = bodyData.listingPrice * usdRate;
      
      // List the asset
      const updatedAsset = await assetService.listAssetForSale(
        tokenId,
        bodyData.listingPrice,
        req.user.walletAddress
      );
      
      // Record the listing transaction
      await transactionService.recordListing(
        tokenId,
        bodyData.listingPrice,
        priceUsd,
        req.user.walletAddress
      );
      
      return NextResponse.json({
        message: 'Asset listed for sale successfully',
        asset: {
          tokenId: updatedAsset?.tokenId,
          listingPrice: updatedAsset?.marketStatus.listingPrice,
          isListed: updatedAsset?.marketStatus.isListed
        }
      });
    } catch (error) {
      console.error(`Error listing asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delist an asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      const tokenId = parseInt(params.tokenId);
      
      if (isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }
      
      if (!req.user?.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Get the asset to check ownership
      const asset = await assetService.getAssetByTokenId(tokenId);
      
      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }
      
      // Ensure user is the owner of the asset
      if (asset.ownership.currentOwner.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
        // Allow admins to delist assets as well
        if (!req.user.roles.includes('admin')) {
          return NextResponse.json(
            { error: 'Unauthorized - You are not the owner of this asset' },
            { status: 403 }
          );
        }
      }
      
      // Check if asset is actually listed
      if (!asset.marketStatus.isListed) {
        return NextResponse.json(
          { error: 'Asset is not listed for sale' },
          { status: 400 }
        );
      }
      
      // Delist the asset
      const updatedAsset = await assetService.delistAsset(tokenId);
      
      // Record the delisting transaction
      await transactionService.recordDelisting(
        tokenId,
        req.user.walletAddress
      );
      
      return NextResponse.json({
        message: 'Asset delisted successfully',
        asset: {
          tokenId: updatedAsset?.tokenId,
          isListed: updatedAsset?.marketStatus.isListed
        }
      });
    } catch (error) {
      console.error(`Error delisting asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}