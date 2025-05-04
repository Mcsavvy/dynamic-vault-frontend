import { aiOracleService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateQuery } from '@/lib/validators';
import { oraclePerformanceQuerySchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Get AI Oracle performance metrics
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins and oracles can view oracle performance
      if (!req.user || !req.user.roles.some(role => ['admin', 'oracle'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Validate query parameters
      const [queryParams, validationError] = validateQuery(request, oraclePerformanceQuerySchema);
      
      if (validationError) {
        return validationError;
      }

      // Get performance metrics
      const performanceMetrics = await aiOracleService.getOraclePerformance(
        queryParams?.startDate,
        queryParams?.endDate
      );

      // Get feature importance analysis
      const featureImportance = await aiOracleService.getFeatureImportanceAnalysis(
        queryParams?.startDate,
        queryParams?.endDate
      );

      return NextResponse.json({
        performance: performanceMetrics,
        featureAnalysis: featureImportance
      });
    } catch (error) {
      console.error('Error fetching oracle performance metrics:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 