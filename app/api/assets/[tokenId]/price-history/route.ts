import { priceHistoryService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';

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

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const period = url.searchParams.get('period') as 'hour' | 'day' | 'week' | 'month' | undefined;
    
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;
    
    // Validate dates
    if (startDateParam && isNaN(startDate?.getTime() || NaN)) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      );
    }
    
    if (endDateParam && isNaN(endDate?.getTime() || NaN)) {
      return NextResponse.json(
        { error: 'Invalid end date format' },
        { status: 400 }
      );
    }

    // Get price history
    let priceHistory;
    
    if (period) {
      // Aggregated price history by period
      priceHistory = await priceHistoryService.getPriceHistoryAggregated(
        tokenId,
        period,
        startDate,
        endDate
      );
    } else {
      // Raw price history
      priceHistory = await priceHistoryService.getPriceHistory(
        tokenId,
        limit,
        startDate,
        endDate
      );
    }

    // Get price analytics
    const priceAnalytics = await priceHistoryService.getPriceAnalytics(tokenId);

    // Get source distribution
    const sourceDistribution = await priceHistoryService.getPriceSourcesDistribution(tokenId);

    return NextResponse.json({
      priceHistory,
      analytics: priceAnalytics,
      sources: sourceDistribution
    });
  } catch (error) {
    console.error(`Error fetching price history for asset with tokenId ${params.tokenId}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 