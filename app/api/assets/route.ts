import { assetService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import { validateBody, validateQuery } from '@/lib/validators';
import { assetCreateSchema, assetQuerySchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Get all assets with filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  // Validate query parameters
  const [queryParams, validationError] = validateQuery(request, assetQuerySchema);
  
  if (validationError) {
    return validationError;
  }

  if (!queryParams) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    );
  }

  try {
    // Get assets with filtering options
    const { 
      assets, 
      total, 
      page, 
      totalPages 
    } = await assetService.getAssets(queryParams);

    // Transform assets to return only necessary data
    const assetList = assets.map(asset => ({
      id: asset._id.toString(),
      tokenId: asset.tokenId,
      contractAddress: asset.contractAddress,
      name: asset.name,
      assetType: asset.assetType,
      thumbnailUrl: asset.media.thumbnailUrl,
      currentPrice: asset.currentPrice,
      isListed: asset.marketStatus.isListed,
      currentOwner: asset.ownership.currentOwner,
      isVerified: asset.verification.isVerified
    }));

    return NextResponse.json({
      assets: assetList,
      pagination: {
        total,
        page,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new asset (protected route)
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth(request, async (req) => {
    // Only admins and oracles can create assets
    if (!req.user || !req.user.roles.some(role => ['admin', 'oracle'].includes(role))) {
      return NextResponse.json(
        { error: 'Unauthorized - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Validate request body
    const [bodyData, validationError] = await validateBody(request, assetCreateSchema);
    
    if (validationError) {
      return validationError;
    }

    if (!bodyData) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    try {
      // Create the asset
      const asset = await assetService.createAsset(bodyData);

      return NextResponse.json({
        message: 'Asset created successfully',
        asset: {
          id: asset._id.toString(),
          tokenId: asset.tokenId
        }
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating asset:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 