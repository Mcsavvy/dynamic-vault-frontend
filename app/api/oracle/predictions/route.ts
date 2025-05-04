import { aiOracleService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { predictionSubmitSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Submit a new price prediction (oracle only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth(request, async (req) => {
    try {
      // Only oracles can submit predictions
      if (!req.user || !req.user.roles.includes('oracle')) {
        return NextResponse.json(
          { error: 'Unauthorized - Oracle privileges required' },
          { status: 403 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, predictionSubmitSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Submit the prediction
      const prediction = await aiOracleService.submitPrediction(
        bodyData.tokenId,
        {
          predictedPrice: bodyData.predictedPrice,
          confidenceScore: bodyData.confidenceScore,
          dataSourcesUsed: bodyData.dataSourcesUsed,
          modelVersion: bodyData.modelVersion,
          inputs: bodyData.inputs,
          featureImportance: bodyData.featureImportance,
          performanceMetrics: bodyData.performanceMetrics
        }
      );
      
      return NextResponse.json({
        message: 'Prediction submitted successfully',
        prediction: {
          id: prediction._id.toString(),
          tokenId: prediction.tokenId,
          predictedPrice: prediction.predictedPrice,
          confidenceScore: prediction.confidenceScore,
          status: prediction.status,
          timestamp: prediction.timestamp
        }
      }, { status: 201 });
    } catch (error) {
      console.error('Error submitting price prediction:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Get recent predictions
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only oracles and admins can view all predictions
      if (!req.user || !req.user.roles.some(role => ['oracle', 'admin'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Get query parameters
      const url = new URL(request.url);
      const tokenId = url.searchParams.get('tokenId') ? parseInt(url.searchParams.get('tokenId')!) : undefined;
      const status = url.searchParams.get('status') || undefined;
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      if (tokenId !== undefined && isNaN(tokenId)) {
        return NextResponse.json(
          { error: 'Invalid token ID' },
          { status: 400 }
        );
      }

      // Get predictions
      const predictions = tokenId
        ? await aiOracleService.getPredictionsByTokenId(tokenId, limit, status)
        : [];

      // Format the response
      const formattedPredictions = predictions.map(pred => ({
        id: pred._id.toString(),
        tokenId: pred.tokenId,
        assetId: typeof pred.assetId === 'string' ? pred.assetId : pred.assetId.toString(),
        predictedPrice: pred.predictedPrice,
        confidenceScore: pred.confidenceScore,
        modelVersion: pred.modelVersion,
        status: pred.status,
        timestamp: pred.timestamp,
        dataSourcesUsed: pred.dataSourcesUsed
      }));

      return NextResponse.json({ predictions: formattedPredictions });
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 