import { assetService, priceHistoryService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { assetPriceUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Update asset price (protected route for admins and oracles)
export async function PUT(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth(request, async (req) => {
    try {
      // Only admins and oracles can update prices
      if (!req.user || !req.user.roles.some(role => ['admin', 'oracle'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
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
      const [bodyData, validationError] = await validateBody(request, assetPriceUpdateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Update asset price
      const updatedAsset = await assetService.updateAssetPrice(
        tokenId,
        bodyData.price,
        bodyData.priceUsd,
        bodyData.aiConfidenceScore
      );
      
      // Record in price history
      await priceHistoryService.recordPrice(tokenId, {
        price: bodyData.price,
        priceUsd: bodyData.priceUsd,
        source: {
          type: req.user.roles.includes('oracle') ? 'ai-oracle' : 'manual'
        },
        aiMetrics: bodyData.aiConfidenceScore 
          ? { confidenceScore: bodyData.aiConfidenceScore }
          : undefined
      });
      
      return NextResponse.json({
        message: 'Asset price updated successfully',
        asset: {
          tokenId: updatedAsset?.tokenId,
          currentPrice: updatedAsset?.currentPrice
        }
      });
    } catch (error) {
      console.error(`Error updating price for asset with tokenId ${params.tokenId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 