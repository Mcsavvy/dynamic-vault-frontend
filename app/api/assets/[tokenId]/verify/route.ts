import { assetService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { assetVerificationSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Verify an asset (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins can verify assets
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        );
      }

      const tokenId = parseInt(params.tokenId);
      
      if (isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }
      
      // Check if asset exists
      const asset = await assetService.getAssetByTokenId(tokenId);
      
      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, assetVerificationSchema);
      
      if (validationError) {
        return validationError;
      }

      // Verify the asset
      const updatedAsset = await assetService.verifyAsset(
        tokenId,
        req.user.walletAddress,
        bodyData?.verificationData
      );
      
      return NextResponse.json({
        message: 'Asset verified successfully',
        asset: {
          tokenId: updatedAsset?.tokenId,
          isVerified: updatedAsset?.verification.isVerified,
          verifiedBy: updatedAsset?.verification.verifiedBy,
          verifiedAt: updatedAsset?.verification.verifiedAt
        }
      });
    } catch (error) {
      console.error(`Error verifying asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Remove verification from an asset (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins can remove verification
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        );
      }

      const tokenId = parseInt(params.tokenId);
      
      if (isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }
      
      // Check if asset exists
      const asset = await assetService.getAssetByTokenId(tokenId);
      
      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }
      
      if (!asset.verification.isVerified) {
        return NextResponse.json(
          { error: 'Asset is not verified' },
          { status: 400 }
        );
      }
      
      // Custom approach to remove verification since there's no direct API for it
      // This will call the verifyAsset method but with isVerified set to false in a custom way
      const updatedAsset = await assetService.verifyAsset(
        tokenId,
        req.user.walletAddress,
        {
          ...asset.verification.verificationData,
          isVerified: false,
          removalReason: 'Admin action'
        }
      );
      
      return NextResponse.json({
        message: 'Asset verification removed successfully',
        asset: {
          tokenId: updatedAsset?.tokenId,
          isVerified: updatedAsset?.verification.isVerified
        }
      });
    } catch (error) {
      console.error(`Error removing verification for asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 