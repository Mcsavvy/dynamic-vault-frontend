import { assetService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { assetMetadataUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Get a single asset by token ID
export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  try {
    const tokenId = parseInt(params.tokenId);
    
    if (isNaN(tokenId)) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    // Increment view count for analytics
    await assetService.incrementViewCount(tokenId);
    
    // Get the asset
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Return full asset data
    return NextResponse.json({ asset });
  } catch (error) {
    console.error(`Error fetching asset with tokenId ${params.tokenId}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update asset metadata (protected route)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth(request, async (req) => {
    try {
      const tokenId = parseInt(params.tokenId);
      
      if (isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }
      
      // Get the asset to check ownership and permissions
      const asset = await assetService.getAssetByTokenId(tokenId);
      
      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }
      
      // Check permissions - only owner, admin, or oracle can update
      const isOwner = req.user?.walletAddress.toLowerCase() === asset.ownership.currentOwner.toLowerCase();
      const isAdminOrOracle = req.user?.roles.some(role => ['admin', 'oracle'].includes(role));
      
      if (!isOwner && !isAdminOrOracle) {
        return NextResponse.json(
          { error: 'Unauthorized - You do not have permission to update this asset' },
          { status: 403 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, assetMetadataUpdateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Update asset metadata
      const updatedAsset = await assetService.updateAssetMetadata(tokenId, {
        ...bodyData,
        provenance: bodyData.provenance?.map((item) => ({
          ...item,
          documentation: item.documentation || "", // Ensure documentation is never undefined
        })),
        acquisitionDate: bodyData.acquisitionDate
          ? new Date(bodyData.acquisitionDate)
          : undefined,
        creationDate: bodyData.creationDate
          ? new Date(bodyData.creationDate)
          : undefined,
        certificates: bodyData.certificates?.map((item) => ({
          ...item,
          date: item.date ? new Date(item.date) : new Date(),
          fileKey: item.fileKey || "",
        })),
      });
      
      return NextResponse.json({
        message: 'Asset metadata updated successfully',
        asset: updatedAsset
      });
    } catch (error) {
      console.error(`Error updating asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete an asset (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins can delete assets
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
      
      // Delete the asset and its associated files
      const success = await assetService.deleteAsset(tokenId);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Asset not found or could not be deleted' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 